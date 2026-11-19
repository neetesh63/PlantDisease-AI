import os
import shutil

# Folders ke paths
source_dir = r"dataset\PlantVillage"
target_dir = r"potato_dataset"

# Sirf in 3 folders ko bachana hai
folders_to_keep = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy"
]

# Naya clean folder banayenge
os.makedirs(target_dir, exist_ok=True)

# 3 Potato folders ko naye folder me move karenge
for folder in folders_to_keep:
    src = os.path.join(source_dir, folder)
    dest = os.path.join(target_dir, folder)
    if os.path.exists(src):
        shutil.move(src, dest)
        print(f"✅ Safe: {folder}")

# Purana kachra (Tomato, Pepper etc.) delete kar denge
if os.path.exists("dataset"):
    shutil.rmtree("dataset")

# Naye folder ka naam wapas 'dataset' rakh denge
os.rename(target_dir, "dataset")
print("🎉 Cleanup Complete! Ab tumhara dataset 100% ready hai.")