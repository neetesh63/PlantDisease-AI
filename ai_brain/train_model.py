"""
==============================================================
  Plant Disease Detection – CNN Training Script
  File   : ai_brain/train_model.py
  Author : PlantDisease-AI Project
==============================================================

Usage:
    python ai_brain/train_model.py

Requires the dataset to be present at ../dataset/ with three
sub-folders:
    Potato___Early_blight
    Potato___Late_blight
    Potato___healthy
"""

import os
import pathlib
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ─────────────────────────────────────────────────────────────
# 0.  REPRODUCIBILITY SEED
# ─────────────────────────────────────────────────────────────
tf.random.set_seed(42)
np.random.seed(42)

# ─────────────────────────────────────────────────────────────
# 1.  CONFIGURATION
# ─────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).resolve().parent          # ai_brain/
DATASET_DIR = BASE_DIR.parent / "dataset"              # ../dataset/
MODEL_PATH  = BASE_DIR / "saved_model.h5"              # ai_brain/saved_model.h5
CLASS_MAP_PATH = BASE_DIR / "class_indices.json"

IMG_SIZE    = (256, 256)
BATCH_SIZE  = 32
EPOCHS      = 60
LEARN_RATE  = 1e-3
VAL_SPLIT   = 0.20

print("=" * 60)
print("  🌿  Plant Disease CNN Trainer")
print("=" * 60)
print(f"  Dataset   : {DATASET_DIR}")
print(f"  Image size: {IMG_SIZE}")
print(f"  Batch     : {BATCH_SIZE}")
print(f"  Max epochs: {EPOCHS}")
print("=" * 60)

# ─────────────────────────────────────────────────────────────
# 2.  DATA AUGMENTATION & GENERATORS
# ─────────────────────────────────────────────────────────────
# Training generator  – heavy augmentation to prevent overfitting
train_datagen = ImageDataGenerator(
    rescale           = 1.0 / 255,
    validation_split  = VAL_SPLIT,
    horizontal_flip   = True,
    vertical_flip     = False,
    rotation_range    = 20,
    zoom_range        = 0.20,
    width_shift_range = 0.10,
    height_shift_range= 0.10,
    shear_range       = 0.10,
    brightness_range  = [0.8, 1.2],
    fill_mode         = "nearest",
)

# Validation generator – only rescale, NO augmentation
val_datagen = ImageDataGenerator(
    rescale          = 1.0 / 255,
    validation_split = VAL_SPLIT,
)

train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size  = IMG_SIZE,
    batch_size   = BATCH_SIZE,
    class_mode   = "categorical",
    subset       = "training",
    seed         = 42,
    shuffle      = True,
)

val_generator = val_datagen.flow_from_directory(
    DATASET_DIR,
    target_size  = IMG_SIZE,
    batch_size   = BATCH_SIZE,
    class_mode   = "categorical",
    subset       = "validation",
    seed         = 42,
    shuffle      = False,
)

NUM_CLASSES = train_generator.num_classes
CLASS_NAMES = list(train_generator.class_indices.keys())

# Save class → index mapping (needed by the API server)
with open(CLASS_MAP_PATH, "w") as f:
    json.dump(train_generator.class_indices, f, indent=2)

print(f"\n  Found {NUM_CLASSES} classes: {CLASS_NAMES}")
print(f"  Training samples  : {train_generator.samples}")
print(f"  Validation samples: {val_generator.samples}")

# ─────────────────────────────────────────────────────────────
# 3.  MODEL ARCHITECTURE
# ─────────────────────────────────────────────────────────────
def build_model(num_classes: int) -> tf.keras.Model:
    """
    Custom CNN with BatchNormalization + GlobalAveragePooling.
    ~1.5 M parameters – lightweight enough for a laptop.
    """
    inp = layers.Input(shape=(*IMG_SIZE, 3), name="image_input")

    # Block 1
    x = layers.Conv2D(32, (3, 3), padding="same", activation="relu")(inp)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(32, (3, 3), padding="same", activation="relu")(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)

    # Block 2
    x = layers.Conv2D(64, (3, 3), padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(64, (3, 3), padding="same", activation="relu")(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.25)(x)

    # Block 3
    x = layers.Conv2D(128, (3, 3), padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv2D(128, (3, 3), padding="same", activation="relu")(x)
    x = layers.MaxPooling2D((2, 2))(x)
    x = layers.Dropout(0.30)(x)

    # Block 4
    x = layers.Conv2D(256, (3, 3), padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.GlobalAveragePooling2D()(x)

    # Classifier head
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.40)(x)
    out = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs=inp, outputs=out, name="PotatoDiseaseCNN")
    return model


model = build_model(NUM_CLASSES)
model.summary()

model.compile(
    optimizer = tf.keras.optimizers.Adam(learning_rate=LEARN_RATE),
    loss      = "categorical_crossentropy",
    metrics   = ["accuracy"],
)

# ─────────────────────────────────────────────────────────────
# 4.  CALLBACKS
# ─────────────────────────────────────────────────────────────
cb_early_stop = callbacks.EarlyStopping(
    monitor           = "val_loss",
    patience          = 10,
    restore_best_weights = True,
    verbose           = 1,
)

cb_checkpoint = callbacks.ModelCheckpoint(
    filepath      = str(MODEL_PATH),
    monitor       = "val_accuracy",
    save_best_only= True,
    verbose       = 1,
)

cb_lr_reduce = callbacks.ReduceLROnPlateau(
    monitor  = "val_loss",
    factor   = 0.5,
    patience = 4,
    min_lr   = 1e-6,
    verbose  = 1,
)

# ─────────────────────────────────────────────────────────────
# 5.  TRAINING
# ─────────────────────────────────────────────────────────────
history = model.fit(
    train_generator,
    epochs          = EPOCHS,
    validation_data = val_generator,
    callbacks       = [cb_early_stop, cb_checkpoint, cb_lr_reduce],
    verbose         = 1,
)

# ─────────────────────────────────────────────────────────────
# 6.  FINAL REPORT
# ─────────────────────────────────────────────────────────────
best_val_acc = max(history.history["val_accuracy"]) * 100
model.save(str(BASE_DIR / "saved_model.h5"))
model.save(str(BASE_DIR / "saved_model.keras"))
print("\n" + "=" * 60)
print(f"  ✅  Training complete!")
print(f"  Best val accuracy : {best_val_acc:.2f}%")
print(f"  Model saved to    : {MODEL_PATH}")
print(f"  Keras format to   : {BASE_DIR / 'saved_model.keras'}")
print(f"  Class map saved to: {CLASS_MAP_PATH}")
print("=" * 60)
