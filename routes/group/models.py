from typing import Optional
from pydantic import BaseModel, EmailStr, Field
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
    participants:list[User_Info_Group] = Field(...)
    # participants=list[dict]=[]
    subject:str=Field(...)

# group stored in db
class Stored_group(BaseModel):
    subject:str=Field(...)
    amount:int=Field(...)
    created_on:str=Field(...)
    group_id:str=Field(...)
    admin:dict=Field(...)
    # admin:User_Info_Group=Field(...)
    participants:list[dict] = Field(...)
    # participants=list[User_Info_Group]

# add user to group
class Req_user_add(BaseModel):
    group_id:str=Field(...)
    email:list[EmailStr]=Field(...)