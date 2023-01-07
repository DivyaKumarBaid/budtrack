from jose import JWTError, jwt
from datetime import datetime, timedelta
import routes.login.models as schemas
import config.database as database
import os
from fastapi import Depends, HTTPException, status
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN_SECRET_KEY = os.getenv('ATOKEN')
REFRESH_TOKEN_SECRET_KEY = os.getenv('RTOKEN')
EMAIL_TOKEN_SECRET_KEY = os.getenv('ETOKEN')
ALGORITHM = os.getenv('ALGO')

# email token
def create_email_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=10)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, EMAIL_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# verify token at email returns false or true 
def verify_email_token(token: str):
    try:
        payload = jwt.decode(
            token, EMAIL_TOKEN_SECRET_KEY, algorithms=ALGORITHM)
        email: str = payload.get("sub")
        cursor = database.unverified_user.find_one({"email": email})
        if not cursor:
            return False
        return True
    except JWTError:
        return False

# creating access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#creating refresh token
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=20)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#verify user access token
def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(
            token, ACCESS_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")
        print(email)
        cursor = database.user_col.find_one({"email": email})

        if email is None or not cursor:
            raise credentials_exception

        return schemas.TokenData(email=email)

    except jwt.ExpiredSignatureError:
        raise credentials_exception

    except JWTError:
        raise credentials_exception

# verify refresh token and renew user access token
def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(
            token, REFRESH_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")

        cursor = database.user_col.find_one({"email": email})

        if not cursor:
            return None

        return create_access_token(data={"sub": email})

    except JWTError:
        return None

# decode to access token payload
def decode_email_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, EMAIL_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        print(payload)

        email: str = payload.get("sub")

        cursor = database.unverified_user.find_one({"email": email})

        if email is None or not cursor:
            raise credentials_exception

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except JWTError:
        raise credentials_exception

# decode to access token payload
def decode_access_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, ACCESS_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")

        cursor = database.user_col.find_one({"email": email})

        if email is None or not cursor:
            raise credentials_exception

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except JWTError:
        raise credentials_exception

# decode to get payload
def decode_refresh_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, REFRESH_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")

        cursor = database.user_col.find_one({"email": email})

        if email is None or not cursor:
            raise credentials_exception

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except JWTError:
        raise credentials_exception
