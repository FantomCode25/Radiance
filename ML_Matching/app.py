import gradio as gr
import pandas as pd
import numpy as np
import joblib
from mongo_logger import save_user_response
from mongo_helper import get_therapists_by_specialization

# Load model
model = joblib.load("model.pkl")

# Quiz setup
questions = [
    "I often feel hopeless",
    "I avoid public places due to fear",
    "I feel anxious for no reason",
    "I can't control my worries",
    "I have experienced trauma",
    "I have trouble sleeping",
    "I feel tired most days",
    "I avoid conversations",
    "I prefer isolation",
    "I get nervous in social settings"
]

options = ["Disagree", "Neutral", "Slightly Agree", "Strongly Agree"]
option_map = {opt: i for i, opt in enumerate(options)}

# Matching function
def match(email, *responses):
    numeric_responses = [option_map[resp] for resp in responses]
    prediction = model.predict([numeric_responses])[0]

    # Save to MongoDB
    full_input = {f"Q{i+1}": val for i, val in enumerate(numeric_responses)}
    save_user_response(email, full_input, prediction)

    if prediction == "No Need For Therapy":
        return {
            "specialization": prediction,
            "message": "✅ No therapy required based on your responses.",
            "therapists": []
        }

    matched_therapists = get_therapists_by_specialization(prediction)

    therapists = [
        {
            "id": t["id"],
            "name": t["name"],
            "age": t["age"],
            "image": t["image"],
            "rating": t["rating"],
            "education": t["education"],
            "languages": ', '.join(t["languages"]),
            "experience": t["experience"],
            "pricePerSession": t["pricePerSession"],
            "availability": t["availability"],
            "specialization": t["specialization"]
        }
        for t in matched_therapists
    ]

    return {
        "specialization": prediction,
        "message": f"🧠 Recommended Specialization: {prediction}",
        "therapists": therapists
    }

# Gradio UI
inputs = [gr.Textbox(label="Email")] + [
    gr.Radio(label=q, choices=options, type="value") for q in questions
]

demo = gr.Interface(
    fn=match,
    inputs=inputs,
    outputs="json",
    title="Therapy Matcher",
    description="Answer 10 questions and get matched with the right therapist."
)

demo.launch(share=True)