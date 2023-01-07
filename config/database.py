# mongoDB driver
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# connection between mongodb and database.py
client = MongoClient(os.getenv('MONGOURL'))

database = client.budtrack

user_col = database.users
unverified_user = database.unverified_user
groups = database.groups

# openssl rand -hex 32 to randomly generate JWT SECRET

