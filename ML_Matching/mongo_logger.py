from pymongo import MongoClient
import os
from datetime import datetime

# MongoDB connection URI (loaded from secret or environment variable)
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# ✅ Make sure this is the same DB you're using for therapists
db = client["mental-oasis-db"]

# This collection stores the logs
logs_collection = db["user_logs"]

def save_user_response(email, answers, prediction):
    data = {
        "email": email,
        "answers": answers,
        "prediction": prediction,
        "timestamp": datetime.utcnow()
    }
    logs_collection.insert_one(data)
    print("✅ User response saved to MongoDB")
