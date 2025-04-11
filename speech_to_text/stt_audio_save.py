from pymongo import MongoClient
import gridfs
from dotenv import load_dotenv
import os
# Replace with your MongoDB URI (use Atlas or localhost)
MONGO_URI = os.getenv("MONGO_DB_URI")
DATABASE_NAME = "mental-oasis-db"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
fs = gridfs.GridFS(db)

# ==== CHANGE THIS ====
audio_file_path = "ttsMP3.com_VoiceText_2025-4-11_11-46-31.mp3"  # Local audio file to upload
filename = audio_file_path         # Name to show in MongoDB
interviewer = "Alice"
interviewee = "Bob"

# Open and upload file with metadata
with open(audio_file_path, "rb") as f:
    file_id = fs.put(
        f,
        filename=filename,
        metadata={
            "interviewer": interviewer,
            "interviewee": interviewee,
            "transcribed": False  # Set to False for future processing
        }
    )

print(f"✅ Audio file uploaded with _id: {file_id}")

