from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
import os
from typing import List
from fastapi import UploadFile

def generate_fashion_image(file_paths: List[str], output_dir: str, output_image_filename: str) -> str:
    """
    Resizes input images to 1080p scale, sends them with a text prompt to Gemini,
    and saves the generated images. Returns the generated image path.
    """

    print(f"generating {output_image_filename}...")

    load_dotenv()
    NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
    client = genai.Client(api_key=NANO_BANANA_API_KEY)

    os.makedirs(output_dir, exist_ok=True)

    text_input = """Make a realistic edit of the first photo. Take the clothing from the second image and have the person from the first image wear it.
Generate a realistic full-body shot of the person wearing the new clothing item. Preserve the original lighting, shadows, and environment. 
Ensure that previous clothing items applied remain consistent in appearance."""


    # Load images
    current_image_path = file_paths[0]
    contents = []
    for clothing_path in file_paths[1:]:
        with Image.open(current_image_path) as img:
            w, h = img.size
            scale = 1080 / min(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

            # Convert to bytes
            buffer = BytesIO()
            resized_img.save(buffer, format="WEBP")
            image_bytes = buffer.getvalue()
            contents.append(types.Part.from_bytes(data=image_bytes, mime_type="image/webp"))
        
        with Image.open(clothing_path) as img:
            w, h = img.size
            scale = 1080 / min(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

            # Convert to bytes
            buffer = BytesIO()
            resized_img.save(buffer, format="WEBP")
            image_bytes = buffer.getvalue()
            contents.append(types.Part.from_bytes(data=image_bytes, mime_type="image/webp"))

        # add text input
        contents.append(text_input)

        # Call Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                temperature=0,
                top_p=0.9,
                top_k=5,
                seed=0,
                candidate_count=1,
                presence_penalty=0.0
            )
        )
        
        output_temp_path = os.path.join(output_dir, "temp_" + output_image_filename)
        found_image = False
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                print(part.text)
            elif part.inline_data is not None:
                image = Image.open(BytesIO(part.inline_data.data))
                image.save(output_temp_path, format="PNG")
                current_image_path = output_temp_path
                found_image = True
                break
        
        if not found_image:
            print("ERROR: Intermidate image lost in Gemini", clothing_path)
            return ""

    final_path = os.path.join(output_dir, output_image_filename)
    os.replace(current_image_path, final_path)
    print(f"finished generating {output_image_filename}")
    return final_path