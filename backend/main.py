from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uuid
import shutil
import os
from typing import List
from fastapi.staticfiles import StaticFiles
import json


from nano_banana import generate_fashion_image


app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


USER_UPLOAD_DIR = "static/user_uploads"
SELFIE_UPLOAD_DIR = "static/selfie_uploads"
current_user_selfie_path = None
custom_outfit_counter = 0
PREMADE_OUTFIT_THUMBNAIL_DIR = "static/premade/thumbnails"
CUSTOM_OUTFIT_THUMBNAIL_DIR = "static/custom/thumbnails"

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



# list of files upload
@app.post("/upload/")
async def upload_image(files: List[UploadFile] = File(...)):
    global custom_outfit_counter
    # create the user upload directory if it doesn't exist
    if not os.path.exists(USER_UPLOAD_DIR):
        os.makedirs(USER_UPLOAD_DIR)
    
    # create the outfit group directory
    outfit_group_dir = os.path.join(USER_UPLOAD_DIR, f"outfit_{custom_outfit_counter}")
    if not os.path.exists(outfit_group_dir):
        os.makedirs(outfit_group_dir)
    custom_outfit_counter += 1
    
    for file in files:
        file_ext = os.path.splitext(file.filename)[1]
        temp_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(outfit_group_dir, temp_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    return {"url": outfit_group_dir}



# single file upload
@app.post("/upload-selfie/")
async def upload_selfie(file: UploadFile = File(...)):
    # create the user directory if it doesn't exist
    if not os.path.exists(SELFIE_UPLOAD_DIR):
        os.makedirs(SELFIE_UPLOAD_DIR)
        
    # delete old selfies first
    for existing_file in os.listdir(SELFIE_UPLOAD_DIR):
        os.remove(os.path.join(SELFIE_UPLOAD_DIR, existing_file))
        
        
    # create the selfie directory if it doesn't exist
    if not os.path.exists(SELFIE_UPLOAD_DIR):
        os.makedirs(SELFIE_UPLOAD_DIR)
    
    # new selfie
    file_ext = os.path.splitext(file.filename)[1]
    temp_filename = f"selfie{file_ext}"
    file_path = os.path.join(SELFIE_UPLOAD_DIR, temp_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    
    # update the global user selfie path
    global current_user_selfie_path
    current_user_selfie_path = file_path
    
    return {"filename": temp_filename, "url": file_path}

@app.post("/generate-image/")
async def generate_image(
    files: List[UploadFile] = File(...),
    premade: bool = Form(True),
    image_name: str = Form("temp")
):
    output_dir = "static/outputs/premade" if premade else "static/outputs/custom"

    output_path = generate_fashion_image(files, output_dir=output_dir, output_image_filename=image_name)

    if not output_path or not os.path.isfile(output_path):
        raise HTTPException(status_code=500, detail="Gemini did not output an image")

    return {
        "filename": os.path.basename(output_path),
        "path": output_path,
        "url": f"/{output_path}"
    }
    
@app.get("/get-premade-outfit-thumbnails")
async def get_premade_outfit_thumbnails():
    with open("items.json", "r") as f:
        res = json.load(f)
    return res

