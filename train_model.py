import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models, callbacks
import os

# Paths
DATASET_DIR = "dataset"
TRAIN_DIR = os.path.join(DATASET_DIR)  # Assuming subfolders are class folders

IMG_SIZE = (256, 256)
BATCH_SIZE = 32
EPOCHS = 50

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest",
    validation_split=0.2,
)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True,
)

val_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False,
)

# Simple CNN model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation="relu", input_shape=IMG_SIZE + (3,)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation="relu"),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation="relu"),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(train_generator.num_classes, activation="softmax"),
])

model.compile(optimizer="adam",
              loss="categorical_crossentropy",
              metrics=["accuracy"])

# Callbacks
early_stop = callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)
checkpoint = callbacks.ModelCheckpoint("plant_disease_model.keras",
                                    monitor="val_loss",
                                    save_best_only=True,
                                    verbose=1)

model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=val_generator,
    callbacks=[early_stop, checkpoint],
)

# Save final model (Keras format)
model.save("plant_disease_model.keras")
print("Training complete. Model saved as plant_disease_model.keras")
