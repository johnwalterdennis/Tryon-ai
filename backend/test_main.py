import requests

url = "http://127.0.0.1:8000/upload/"
file_path = "my_image.webp"

with open(file_path, "rb") as f:
    response = requests.post(url, files={"file": f})

print(response.json())
