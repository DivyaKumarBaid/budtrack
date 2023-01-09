from fastapi import Depends, APIRouter, HTTPException, status
import config.database as database
import uuid
from routes.user.models import (Pre_userdata, User, User_data,Search_User,Res_Search_User)
from routes.login.models import (IntervalToken_inc, IntervalToken_res)
import mailer.verification as mailer
import mailer.html_res as html_res
import routes.auth.hashing as hashing
from routes.auth import (Token,oauth2)
import bson
import os
from fastapi.responses import HTMLResponse

router = APIRouter(tags=["Users"], prefix="/users")

@router.post('/create', status_code=201)
def create_user(inc_user: User):

    try:
        etoken = Token.create_email_token(data={"sub": inc_user.email})

        Users = Pre_userdata(
            user=inc_user.user, 
            password=hashing.hash_pass(
            inc_user.password), 
            email=inc_user.email, 
            user_id=str(uuid.uuid4()),
            email_token=etoken
        )
        
        cursor2 = database.user_col.find_one({"email": inc_user.email})
        if cursor2:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)

        else:
            cursor1 = database.unverified_user.find_one(
                {"email": inc_user.email})
            if cursor1:
                cursor3 = database.unverified_user.delete_one(
                    {"email": inc_user.email})

            res = database.unverified_user.insert_one(dict(Users))

            mailer.email(inc_user.email)

            if not res:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.post('/get_user_details',status_code=200)
def get_user_details(req:Search_User,current_user: User = Depends(oauth2.get_current_user)):
    try:
        if (current_user.email != req.email):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        cursor = database.user_col.find_one({"email":req.email})
        if(cursor):
            return User_data(**cursor)
    except:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.get("/verify/{email_token}", response_class=HTMLResponse)
def verify_user_email(email_token: str):
    try:
        payload = Token.decode_email_token(email_token)
        email:str = payload.get("sub")
        cursor = database.unverified_user.find_one({"email": email})
        isValid = Token.verify_email_token(email_token)
        if not cursor or not isValid:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

        User = User_data(
            user=cursor['user'],
            email=cursor['email'],
            password=cursor['password'],
            user_id=cursor['user_id']
        )
        res = database.user_col.insert_one(dict(User))

        if not res:
            return html_res.html_respose("Link Expired !")

        delete = database.unverified_user.delete_one({"email": cursor["email"]})
        if not delete:
            return html_res.html_respose("Something Went Wrong!")

        return html_res.html_respose("Verified !")
    except:
        return html_res.html_respose("Link Expired !")

# returns accesstoken
@router.post("/user_verification", status_code=200)
def verify_user_refresh_token(rtoken: IntervalToken_inc):
    try:

        token = Token.verify_refresh_token(rtoken.refresh_token)
        if token == None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        return IntervalToken_res(access_token=token)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.post("/search",status_code=200)
def search_user(req:Search_User,current_user: User = Depends(oauth2.get_current_user)):
    try:
        # regx = bson.regex.Regex('')
        cursor = database.user_col.find({'email':{'$regex':f'{req.email}'}})
        list_users = []
        if(cursor):
            for i in cursor:
                list_users.append(Res_Search_User(**i))
        return list_users    
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
