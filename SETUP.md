# Plant Disease Detection System — Setup Guide

## ── Python Backend + AI Model ──────────────────────────────────────────

### 1. Create & activate virtual environment
```powershell
cd C:\Users\hp\Desktop\PlantDisease-AI

# Create venv
python -m venv env

# Activate (PowerShell)
.\env\Scripts\Activate.ps1
```

### 2. Install Python dependencies
```powershell
pip install --upgrade pip

pip install tensorflow==2.16.1 `
            opencv-python `
            fastapi `
            "uvicorn[standard]" `
            python-multipart `
            pydantic `
            numpy `
            pillow `
            tqdm
```

### 3. Train the CNN model
```powershell
# From project root (with venv active)
python ai_brain/train_model.py
# This creates: ai_brain/saved_model.h5  &  ai_brain/class_indices.json
```

### 4. Start the FastAPI server
```powershell
# From project root (with venv active)
uvicorn backend_server.api_main:app --host 0.0.0.0 --port 8000 --reload
# API live at: http://localhost:8000
# Swagger UI  : http://localhost:8000/docs
```

## ── Next.js Frontend ────────────────────────────────────────────────────

### 5. Install Node dependencies
```powershell
cd C:\Users\hp\Desktop\PlantDisease-AI\frontend_website
npm install
```

### 6. Run the dev server
```powershell
npm run dev
# Frontend live at: http://localhost:3000
```

## ── Project Structure ────────────────────────────────────────────────────

```
PlantDisease-AI/
├── dataset/
│   ├── Potato___Early_blight/      ← training images
│   ├── Potato___Late_blight/       ← training images
│   └── Potato___healthy/           ← training images
│
├── ai_brain/
│   ├── train_model.py              ← CNN training script
│   ├── saved_model.h5              ← generated after training
│   └── class_indices.json          ← generated after training
│
├── backend_server/
│   └── api_main.py                 ← FastAPI server
│
├── frontend_website/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                ← Hero + Upload page
│   │   ├── globals.css
│   │   └── components/
│   │       ├── ThemeProvider.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── UploadDropzone.tsx
│   │       └── ResultCard.tsx
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.js
│   └── tsconfig.json
│
├── college_docs/
│   └── Biotech_Project_Report.md   ← Full biotech report
│
└── SETUP.md                        ← This file
```
