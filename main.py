import base64
import json
from contextlib import asynccontextmanager

import google.generativeai as genai
import motor.core
import uvicorn
from PIL.Image import Image
from bson import ObjectId
from fastapi import FastAPI, Cookie, Response, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from deepfit.deepfit_integration import process_image
from models.User import AuthPayload, ProfilePayload
from utils import dot_notate

MONGO_URL = "mongodb+srv://user123:user123@cluster0.bw8lb9o.mongodb.net/?retryWrites=true&w=majority"
vision_model: genai.GenerativeModel | None = None
text_model: genai.GenerativeModel | None = None
database = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    # On startup
    global text_model, vision_model, database
    text_model = get_text_model()
    vision_model = get_vision_model()
    client = AsyncIOMotorClient(MONGO_URL)
    database = client["fitness-assistant"]
    yield  # When the app is running
    # On shutdown


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def get_text_model():
    genai.configure(api_key="AIzaSyCClmFW0HVTb7-9Sw3FRbgXhFoUFX_KrN0")
    generation_config = genai.GenerationConfig(
        temperature=0,
        top_p=1,
        top_k=1,
        max_output_tokens=2048,
    )

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
    ]

    return genai.GenerativeModel(model_name="gemini-pro",
                                 generation_config=generation_config,
                                 safety_settings=safety_settings)


def get_vision_model():
    genai.configure(api_key="AIzaSyCClmFW0HVTb7-9Sw3FRbgXhFoUFX_KrN0")
    generation_config = genai.GenerationConfig(
        temperature=0.4,
        top_p=1,
        top_k=32,
        max_output_tokens=4096,
    )

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_LOW_AND_ABOVE"
        },
    ]

    return genai.GenerativeModel(model_name="gemini-pro-vision",
                                 generation_config=generation_config,
                                 safety_settings=safety_settings)


@app.post("/signup", status_code=201)
async def signup(payload: AuthPayload, response: Response):
    # Save the payload to mongodb
    collection: motor.core.AgnosticCollection = database["users"]
    result = await collection.insert_one(payload.dict())

    return {"status": "success", "user_id": str(result.inserted_id)}


@app.post("/login")
async def login(payload: AuthPayload, response: Response):
    # Check the payload in mongodb
    collection: motor.core.AgnosticCollection = database["users"]
    user = await collection.find_one(payload.dict())
    if user is None:
        return {"error": "Invalid credentials"}, 401

    return {"status": "success", "user_id": str(user["_id"])}


@app.post("/profile")
async def profile(payload: ProfilePayload):
    body_type = await identify_body_type(base64_image=payload.image)

    # Save the payload to mongodb
    collection: motor.core.AgnosticCollection = database["users"]
    payload_dict = payload.dict()
    payload_dict['bodyType'] = body_type
    del payload_dict['image']
    del payload_dict['user_id']
    payload_dict = dot_notate(payload_dict)
    update = {"$set": payload_dict}
    await collection.update_one({"_id": ObjectId(payload.user_id)}, update)
    return {"status": "success"}


@app.post("/identify-body-type")
async def identify_body_type(base64_image: str):
    image = await get_image_from_base64_url(base64_image)
    image_parts = [
        {
            "mime_type": "image/jpeg",
            "data": image,
        },
    ]

    prompt_parts = [
        """Please describe the following aspects of the person's physique in the image in the following json format:
        
```json
{
    "shoulders": {
      "width": "broad",
      "slope": "moderate",
      "muscleDefinition": "well-developed"
    },
    "arms": {
      "bicepSize": "well-developed",
      "tricepSize": "toned",
      "overallLength": "average",
      "muscleDefinition": "defined"
    },
    "hands": {
      "size": "medium",
      "shape": "normal",
      "calluses": "present"
    },
    "chest": {
      "size": "well-developed",
      "shape": "broad",
      "muscleDefinition": "defined"
    },
    "torso": {
      "length": "average",
      "proportionsToLegs": "balanced",
      "muscleDefinition": "visible"
    },
    "stomach": {
      "flatness": "toned",
      "protruding": "none",
      "muscleDefinition": "visible"
    },
    "hips": {
      "width": "average",
      "proportionsToShoulders": "balanced",
      "muscleDefinition": "toned"
    },
    "legs": {
      "quadSize": "well-developed",
      "calfSize": "toned",
      "overallLength": "average",
      "muscleDefinition": "defined"
    },
    "feet": {
      "size": "average",
      "shape": "normal",
      "muscleDefinition": "none"
    },
    "overallBodyProportions": "average",
    "posture": "upright",
    "muscleDefinition": "well-distributed",
    "bodyFatPercentage": "moderate"
}
```
        """,
        image_parts[0],
    ]

    response = vision_model.generate_content(prompt_parts).text.strip()
    response = response.removeprefix("```json\n").removesuffix("\n```")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return response


async def get_image_from_base64_url(base64_image: str):
    return base64.decodebytes(
        bytes(base64_image.removeprefix('data:image/jpeg;base64,').removeprefix(
            'data:image/png;base64,'), encoding='utf-8'))


# Get base64 url from image
async def get_base64_url_from_image(image: bytes):
    return "data:image/png;base64," + base64.b64encode(image).decode('utf-8')

@app.get("/plan")
async def get_plan(user_id: str | None = None):
    if user_id is None:
        return {"error": "User not found"}

    # Get the body stats from mongodb
    collection: motor.core.AgnosticCollection = database["users"]
    body_stats = await collection.find_one({"_id": ObjectId(user_id)})
    body_stats.pop("name")
    body_stats.pop("_id")

    prompt = """
Generate a workout plan from the given body type measurements:
The number of set doesn't necessarily need to be constant. Optimize it for output.
Take complete rest on a recovery day.

```json
""" + json.dumps(body_stats) + """
```

Output format:
```json
{
  "Monday (Leg Day)": {
    "Squats": {
      "Set1": {"Reps": 12, "Rest": "30 seconds"},
      ...
    },
    ...
  },
  "Friday (Rest Day)": null
  ...
}
```   
    """
    print(prompt)

    response = text_model.generate_content(prompt).text.strip()
    response = response.removeprefix("```json\n").removesuffix("\n```")
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return response


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        data = await get_image_from_base64_url(data)

        result = process_image(data)
        if result is None:
            continue

        result = await get_base64_url_from_image(result)

        await websocket.send_text(result)


# Hello route
@app.get("/")
async def read_root():
    return {"Hello": "World"}


if __name__ == '__main__':
    uvicorn.run("main:app", host='localhost', port=8000, reload=True)
