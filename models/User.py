from fastapi import UploadFile
from pydantic import BaseModel


class AuthPayload(BaseModel):
    email: str
    password: str


class ProfilePayload(BaseModel):
    name: str
    height: float
    weight: float
    sex: str
    image: str
    healthConditions: str | None
    age: int
    fitnessLevel: str
    focusArea: str | None
