import whisper
import tempfile

from pymongo import MongoClient
import gridfs
from bson.objectid import ObjectId

# ========== ⚙️ CONFIGURATION ========== #
from dotenv import load_dotenv
import os
# Replace with your MongoDB URI (use Atlas or localhost)
MONGO_URI = os.getenv("MONGO_DB_URI")
DATABASE_NAME = "mental-oasis-db"

AUDIO_COLLECTION = "fs"  # GridFS default files collection

# ========== 📡 CONNECT TO MONGODB ========== #
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
fs = gridfs.GridFS(db)
files_collection = db["fs.files"]

# ========== 🧠 LOAD WHISPER MODEL ========== #
model = whisper.load_model("base")

# ========== 🔄 PROCESS LOOP ========== #
# Find audio files without transcript
audio_files = files_collection.find({
    "metadata.transcribed": {"$ne": True}
})

for audio_doc in audio_files:
    file_id = audio_doc["_id"]
    filename = audio_doc["filename"]
    print(f"\n🎧 Processing file: {filename}")

    # Step 1: Get audio binary from GridFS
    try:
        grid_out = fs.get(file_id)
    except:
        print("❌ Failed to fetch audio from GridFS.")
        continue

    # Step 2: Save audio as temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(grid_out.read())
        temp_audio_path = temp_audio.name

    # Step 3: Transcribe using Whisper
    try:
        result = model.transcribe(temp_audio_path)
        transcript_text = result["text"]
        print(f"📝 Transcript: {transcript_text[:100]}...")
    except Exception as e:
        print(f"❌ Transcription failed: {e}")
        os.remove(temp_audio_path)
        continue

    # Step 4: Save transcript back to MongoDB
    update_result = files_collection.update_one(
        {"_id": file_id},
        {
            "$set": {
                "metadata.transcript": transcript_text,
                "metadata.transcribed": True
            }
        }
    )

    print("✅ Transcript saved to MongoDB.")
    os.remove(temp_audio_path)

print("\n🎉 Done transcribing all pending audio files.")

