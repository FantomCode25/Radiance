from pymongo import MongoClient
import os

# MongoDB connection URI from environment variable or Hugging Face secret
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# ✅ Use your actual database
db = client["mental-oasis-db"]

# ✅ Use your correct collection name
therapists_collection = db["therapists"]

# Function to get therapists by specialization
def get_therapists_by_specialization(specialization, limit=5):
    return list(therapists_collection.find({"specialization": specialization}).limit(limit))
