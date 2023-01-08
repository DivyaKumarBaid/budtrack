from typing import Optional
from pydantic import BaseModel, EmailStr, Field
#Login model
#from front end    

class Login(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)
    
#from backend to frontend after login
class ResLogin(BaseModel):
    user: str = Field(...)
    email:EmailStr=Field(...)
    user_id: str = Field(...)
    access_token: str = Field(...)
    refresh_token: str = Field(...)
    token_type: str = Field(...)

# verify on set interval
class IntervalToken_inc(BaseModel):
    refresh_token: str

class IntervalToken_res(BaseModel):
    access_token: str

# used in verification of token data
class TokenData(BaseModel):
    email: Optional[str] = None

# class TokenDataPayload(BaseModel):
#     sub: Optional[str] = None
#     name:str
#     user_id:str
#     doctor:bool

#Login model