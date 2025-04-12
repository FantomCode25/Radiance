---

title: AI Therapy Matcher

emoji: 🧠

colorFrom: blue

colorTo: indigo

sdk: gradio

sdk_version: 5.24.0

app_file: app.py

pinned: false

---

</br>

## 🧠 AI Therapy Matcher

An AI-powered mental health app that matches users to suitable therapists using an ML model.

- ✅ PHQ-9 and GAD-7 style quiz
- ✅ Therapist recommendations from MongoDB
- ✅ Secure response logging using MongoDB

---

### 💡 How it works

1. User answers 10 mental health questions
2. Responses are scored using a trained ML model
3. Therapist recommendation is retrieved from MongoDB

---

### 📁 Files Included

- `app.py`: Gradio interface logic
- `mongo_helper.py`: Fetches therapist data
- `mongo_logger.py`: Logs user responses
- `rebuild_model.py`: Trains and saves the ML model
- `quiz_dataset.csv`: Dataset for model training
- `requirements.txt`: All dependencies

---

### 🌐 Deployment Notes

Set the following secret on Hugging Face Spaces:

- `MONGO_URI`: your MongoDB connection URI