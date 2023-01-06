from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# before validating user
class Pre_userdata(BaseModel):
    user: str = Field(...)
    password: str = Field(...)
    email: EmailStr = Field(...)
    user_id: str = Field(...)
    email_token:str=Field(...)

# requests
class Requests(BaseModel):
    request_id:str=Field(...)
    created_on:str=Field(...)
    request_from:str=Field(...)
    request_to:str=Field(...)
    amount:int=Field(...)
    subject:str=""

# single user for group
class User_Info_Group(BaseModel):
    user_id:str=Field(...)
    email:EmailStr=Field(...)
    amount:int=Field(...)

# from frontend when group is being created
class Create_group(BaseModel):
    amount:int=Field(...)
    admin:User_Info_Group=Field(...)
    participants=list[User_Info_Group]
    subject:str=Field(...)

# group stored in db
class Stored_group(BaseModel):
    subject:str=Field(...)
    amount:int=Field(...)
    created_on:str=Field(...)
    group_id:str=Field(...)
    admin:User_Info_Group=Field(...)
    participants=list[User_Info_Group]

# after validation of user
class User_data(BaseModel):
    user: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    user_id: str = Field(...)
    created_groups :list[dict] = []
    invited_groups:list[dict] = []
    requests:list[list[dict]] = []
    notifications:list[str]=[]

#user signup
class User(BaseModel):
    user: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
