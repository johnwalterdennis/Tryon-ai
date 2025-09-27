from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
from dotenv import load_dotenv
import os
from typing import List
from fastapi import UploadFile

def generate_fashion_image(files: List[UploadFile], output_dir: str, output_image_filename: str) -> str:
    """
    Resizes input images to 1080p scale, sends them with a text prompt to Gemini,
    and saves the generated images. Returns the generated image path.
    """

    load_dotenv()
    NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
    client = genai.Client(api_key=NANO_BANANA_API_KEY)

    os.makedirs(output_dir, exist_ok=True)

    text_input = """Create a professional e-commerce fashion photo. Take the clothing from the images and let the person from the last image wear it.
    Generate a realistic, full-body shot of the person wearing the clothes, with the lighting and shadows adjusted to match the outdoor environment.
    Keep the environment and background the same."""

    # Load images
    contents = []
    for file in files:
        img = Image.open(BytesIO(file.file.read()))
        # Figure out scaling factor
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
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO(part.inline_data.data))

            filename = output_image_filename
            if not os.path.splitext(filename)[1]:  # no extension provided
                filename += ".png"

            out_path = os.path.join(output_dir, filename)
            image.save(out_path, format="PNG")

            return out_path
    print("ERROR: No images were returned by Gemini")