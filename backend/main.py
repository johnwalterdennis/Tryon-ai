from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uuid
import shutil
import os
from typing import List
from fastapi.staticfiles import StaticFiles
import json
import asyncio

from nano_banana import generate_fashion_image


app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


USER_UPLOAD_DIR = "static/user_uploads"
SELFIE_UPLOAD_DIR = "static/selfie_uploads"
CURRENT_USER_SELFIE_PATH = ""
custom_outfit_counter = 0
PREMADE_OUTFIT_THUMBNAIL_DIR = "static/premade/thumbnails"
CUSTOM_OUTFIT_THUMBNAIL_DIR = "static/custom/thumbnails"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
    global CURRENT_USER_SELFIE_PATH
    CURRENT_USER_SELFIE_PATH = file_path
    
    return {"filename": temp_filename, "url": file_path}

#dont use this for now
@app.post("/generate-image/")
async def generate_image(
    files: List[UploadFile] = File(...),
    image_name: str = Form("temp")
):
    output_dir = "static/outputs/custom"

    output_path = generate_fashion_image(files, output_dir=output_dir, output_image_filename=image_name)

    if not output_path or not os.path.isfile(output_path):
        raise HTTPException(status_code=500, detail="Gemini did not output an image")

    return {
        "filename": os.path.basename(output_path),
        "path": output_path,
        "url": f"/{output_path}"
    }

@app.put("/generate-all-premade-outfits")
async def generate_all_premade_outfits():
    output_base_dir = "static/outputs/premade"
    input_base_dir = "static/premade"
    if not os.path.exists(input_base_dir):
        raise HTTPException(status_code=404, detail=f"{input_base_dir} not found")

    generated_outputs = []

    #get all outfit_{i} directories
    outfit_dirs = [d for d in os.listdir(input_base_dir) if d.startswith("outfit_") and os.path.isdir(os.path.join(input_base_dir, d))]
    # print(f"outfit_dirs: {outfit_dirs}")

    async def process_outfit(outfit_dir):
        outfit_path = os.path.join(input_base_dir, outfit_dir, "images")
        image_files = sorted([
            os.path.join(outfit_path, f)
            for f in os.listdir(outfit_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and f != "thumbnail.jpg"
        ])
        image_files = [CURRENT_USER_SELFIE_PATH] + image_files

        if len(image_files) <= 1:
            return None

        output_filename = f"{outfit_dir}.png"

        # call Gemini
        output_path = await asyncio.to_thread(
            generate_fashion_image,
            image_files,
            output_dir=output_base_dir,
            output_image_filename=output_filename
        )

        return {
            "outfit_dir": outfit_dir,
            "output_path": output_path,
            "url": f"/{output_path}"
        }

    # Run all outfits in parallel
    tasks = [process_outfit(d) for d in outfit_dirs]
    results = await asyncio.gather(*tasks)

    generated_outputs = [r for r in results if r]

    return {"generated_outputs": generated_outputs}
    
@app.get("/get-premade-outfit-details")
async def get_premade_outfit_details():
    with open("items.json", "r") as f:
        res = json.load(f)
    return res

@app.get("/get-generated-outfit")
async def get_generated_outfit(outfit: str = ""):
    base_url = "http://localhost:8000/"
    filepath = f"static/outputs/premade/{outfit}.png"
    res = base_url + filepath
    if os.path.exists(filepath):
        print(filepath)
        return {"url" : res}
    return None