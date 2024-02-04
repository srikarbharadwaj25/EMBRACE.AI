from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load the pre-trained SVM model and TF-IDF vectorizer
model = joblib.load('svm_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

@app.route("/")
def home():
    return render_template("bot.html")

@app.route("/predict_intent", methods=["POST"])
def predict_intent():
    user_input = request.json["user_input"]

    # Vectorize the user input
    user_input_vec = vectorizer.transform([user_input])

    # Predict the intent
    intent = model.predict(user_input_vec)[0]

    # Generate response based on the predicted intent
    response = generate_response(intent)
    return jsonify({"response": response})
 
def generate_response(intent):
    # Implement your logic here to generate appropriate responses based on the predicted intents
    if intent == 'greeting':
        response = "Hello! How can I assist you today?"
    elif intent == 'farewell':
        response = "Goodbye! Take care."
    elif intent == 'question':
        response = "I'm sorry, I don't have the information you're looking for."
    else:
        response = "I'm here to help. Please let me know how I can assist you."
     

    return response

if __name__ == "__main__":
    app.run(debug=True)
