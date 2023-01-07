from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.group import (Group)
# from routes.doctor import Appointments
# from routes.doctor import Doc
from routes.login import Login
from routes.user import Users

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(Login.router)
app.include_router(Users.router)
app.include_router(Group.router)
# app.include_router(Appointments.router)
# app.include_router(Docroute.router)
# app.include_router(Code.router)
