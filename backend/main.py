from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uuid
import shutil
import os


app = FastAPI()

USER_UPLOAD_DIR = "static/user_uploads"
SELFIE_UPLOAD_DIR = "static/selfie_uploads"
current_user_selfie_path = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(USER_UPLOAD_DIR, temp_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": temp_filename, "url": file_path}

@app.post("/upload-selfie/")
async def upload_selfie(file: UploadFile = File(...)):
    # delete old selfies first
    for existing_file in os.listdir(SELFIE_UPLOAD_DIR):
        os.remove(os.path.join(SELFIE_UPLOAD_DIR, existing_file))
        
        
    # new selfie
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(SELFIE_UPLOAD_DIR, temp_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    current_user_selfie_path = file_path
    
    return {"filename": temp_filename, "url": file_path}