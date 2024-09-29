from fastapi import FastAPI, File, UploadFile, Query, HTTPException, Form
from inference_sdk import InferenceHTTPClient
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import gemini
import logging
import base64
from uuid import uuid4

import os

from pydantic import BaseModel

# Load environment variables from a .env file (for storing sensitive keys)
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Adjust this to specify allowed origins
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

# Configure logging
logging.basicConfig(level=logging.INFO)

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="oCNXt21BQhz9229Qrev8"  # Use your actual API key here
)

# Load Google Places API key
GOOGLE_PLACES_API_KEY = "AIzaSyBw6vBi0IxOM-66dsmP868bmEovA5rL3hQ"  # You can define this in .env

genai.configure(api_key="AIzaSyBT1BBESDIclpUAVYeaLpqhlvIX5VObkl4")

# Initialize the model and chat
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id, "description": "This is an item."}


from PIL import Image

UPLOAD_DIR = "./uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MIN_FILE_SIZE = 100  # 100 bytes, adjust as needed

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    temp_file_path = ""
    try:
        contents = await file.read()

        # Check if file is empty or too small
        if len(contents) < MIN_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File is empty or too small. Minimum size is {MIN_FILE_SIZE} bytes.")

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE // (1024 * 1024)}MB limit.")

        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Generate unique filename
        unique_filename = f"{uuid4()}_{file.filename}"
        temp_file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save the file
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(contents)
        
        logging.info(f"Temporary file saved: {temp_file_path}")

        # Verify the image file
        try:
            with Image.open(temp_file_path) as img:
                # Actually load the image data to ensure it's not corrupt
                img.load()
            logging.info(f"Image verified successfully: {temp_file_path}")
        except Exception as img_error:
            logging.error(f"Error verifying image: {str(img_error)}")
            raise HTTPException(status_code=400, detail="Invalid or corrupt image file")

        # Log file details
        file_size = os.path.getsize(temp_file_path)
        logging.info(f"File size: {file_size} bytes")
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty")

        try:
            # Use the absolute file path for inference
            abs_file_path = os.path.abspath(temp_file_path)
            logging.info(f"Attempting inference with file: {abs_file_path}")
            result = client.infer(abs_file_path, model_id="mobile-doctor/1")

            logging.info(f"Inference result: {result}")
        except Exception as workflow_error:
            logging.error(f"Error during workflow execution: {str(workflow_error)}")
            raise HTTPException(status_code=500, detail=f"Workflow error: {str(workflow_error)}")

        try:
            identified_result = gemini.identify(result)
        except Exception as gemini_error:
            logging.error(f"Error in gemini.identify: {str(gemini_error)}")
            raise HTTPException(status_code=500, detail=f"Gemini identification error: {str(gemini_error)}")

        return JSONResponse(content={"result": identified_result})

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    finally:
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logging.info(f"Temporary file removed: {temp_file_path}")


UPLOAD_DIR = "./uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MIN_FILE_SIZE = 100  # 100 bytes, adjust as needed

@app.post("/pharmacy/")
async def upload_image(file: UploadFile = File(...), textInput: str = Form(...)):
    temp_file_path = ""
    try:
        contents = await file.read()

        # Check if file is empty or too small
        if len(contents) < MIN_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File is empty or too small. Minimum size is {MIN_FILE_SIZE} bytes.")

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE // (1024 * 1024)}MB limit.")

        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Generate unique filename
        unique_filename = f"{uuid4()}_{file.filename}"
        temp_file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save the file
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(contents)
        
        logging.info(f"Temporary file saved: {temp_file_path}")

        # Verify the image file
        try:
            with Image.open(temp_file_path) as img:
                # Actually load the image data to ensure it's not corrupt
                img.load()
            logging.info(f"Image verified successfully: {temp_file_path}")
        except Exception as img_error:
            logging.error(f"Error verifying image: {str(img_error)}")
            raise HTTPException(status_code=400, detail="Invalid or corrupt image file")

        # Log file details
        file_size = os.path.getsize(temp_file_path)
        logging.info(f"File size: {file_size} bytes")
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty")

        try:
            # Use the absolute file path for inference
            abs_file_path = os.path.abspath(temp_file_path)
            logging.info(f"Attempting inference with file: {abs_file_path}")
            result = client.infer(abs_file_path, model_id="mobilepharmacy/1")

            logging.info(f"Inference result: {result}")
        except Exception as workflow_error:
            logging.error(f"Error during workflow execution: {str(workflow_error)}")
            raise HTTPException(status_code=500, detail=f"Workflow error: {str(workflow_error)}")

        try:
            identified_result = gemini.pharm(result, textInput)
        except Exception as gemini_error:
            logging.error(f"Error in gemini.identify: {str(gemini_error)}")
            raise HTTPException(status_code=500, detail=f"Gemini identification error: {str(gemini_error)}")

        return JSONResponse(content={"result": identified_result})

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    finally:
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logging.info(f"Temporary file removed: {temp_file_path}")


class chats(BaseModel):
    chat: str

@app.post("/chat")
async def small_talk(request: chats):
    text = request.chat
    response = chat.send_message(
        f"Like how a doctor would respond, don't say that you need to give medical advice and just provide general advice: {text}"
    )
    return {"text": response.text}

# Nearby doctors API using Google Places API
@app.get("/api/nearby-doctors")
async def get_nearby_doctors(lat: float, lng: float):
    """
    Find nearby doctors using Google Places API.
    :param lat: Latitude of the current location.
    :param lng: Longitude of the current location.
    """
    # Google Places API URL
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=5000&type=doctor&key={GOOGLE_PLACES_API_KEY}"

    try:
        # Make the request to Google Places API
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        # Parse the JSON response and return the results
        data = response.json()
        return JSONResponse(content=data['results'], status_code=200)
    except requests.exceptions.RequestException as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)