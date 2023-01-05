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

docs = database.docs
unverified_doc = database.unverified_doc
unverified_offline_doc = database.unverified_offline_doc

admin = database.admin


# openssl rand -hex 32 to randomly generate JWT SECRET

