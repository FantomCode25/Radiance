import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv("quiz_dataset.csv")
X = df[[f"Q{i}" for i in range(1, 11)]]
y = df["specialization"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)

joblib.dump(model, "model.pkl")
print("Model rebuilt successfully and file model.pkl is created")