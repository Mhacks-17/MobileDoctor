import google.generativeai as genai
import os

import json

API_KEY="AIzaSyBT1BBESDIclpUAVYeaLpqhlvIX5VObkl4"

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat()


def identify(json: dict):
    # Use the json module to load the string into a dictionary

    top = json["top"]
    # Send a message to the chat
    response = chat.send_message(f"Acting like a doctor, can you tell me that you just see a {top}, don't tell me you're not a doctor, don't ask a question to me, just two sentences")

    return response.text


def pharm(json: dict, textInput: str):
    # Use the json module to load the string into a dictionary

    top = json["top"]
    # Send a message to the chat
    print(f"only answer 'true' or 'false', water is good for headache is a example, does this prompt {textInput} get helped by {top}: ")
    response = chat.send_message(f"act like a doctor, only answer 'true' or 'false', water is good for headache is a example, does this prompt '{textInput}' get helped by '{top}': ")

    return response.text

