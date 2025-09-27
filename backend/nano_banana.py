from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
from dotenv import load_dotenv
import os

load_dotenv()
NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")

client = genai.Client(api_key=NANO_BANANA_API_KEY)

# Load images
with open("pranjal.webp", "rb") as f:
    person_bytes = f.read()

with open("pink_dress.webp", "rb") as f:
    dress_bytes = f.read()

text_input = """Create a professional e-commerce fashion photo. Take the clothing from the images and let the person from the last image wear it.
Generate a realistic, full-body shot of the person wearing the clothes, with the lighting and shadows adjusted to match the outdoor environment.
Keep the environment and background the same."""

# Prepare content parts
contents = [
    types.Part.from_bytes(data=dress_bytes, mime_type="image/webp"),
    types.Part.from_bytes(data=person_bytes, mime_type="image/webp"),
    text_input
]

# Call Gemini
response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=contents,
)

# Extract image(s) from response
image_parts = [
    part.inline_data.data
    for part in response.candidates[0].content.parts
    if part.inline_data
]

if image_parts:
    # Decode base64 → bytes → PIL image
    image_data = base64.b64decode(image_parts[0])
    image = Image.open(BytesIO(image_data))

    # Save and preview
    output_path = "static/user_upload/fashion_ecommerce_shot.png"
    image.save(output_path)
    image.show()
    print(f"✅ Image saved to {output_path}")
else:
    print("❌ No image generated")