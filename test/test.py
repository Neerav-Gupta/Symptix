import google.generativeai as genai
import os

# Configure the API
genai.configure(api_key="AIzaSyDQIggpSBguWQKuqrVhTzGULW4d06nxB_4")

# Initialize the model
model = genai.GenerativeModel("gemini-1.0-pro")


def get_diagnosis(symptoms):
    """
    Sends the user's symptoms to the Gemini AI model and returns a response.
    """
    try:
        # Send the symptoms to the model for diagnosis
        response = model.generate_content(symptoms)
        return response.text
    except Exception as e:
        return f"An error occurred: {str(e)}"


def chatbot():
    print("Welcome to the Symptom Checker Chatbot. Please describe your symptoms.")

    setup = get_diagnosis(
        'You are going to be used as a chatbot which is going to have a back and forth conversation with a patient. The patient is either going to enter some symptoms they have, based on which you have to diagnose those symptoms, without the prompt explicity mentioning it, or they will have a medical related question which you have to answer. To start the conversation, start by saying "Hello, I am the Symptix AI assistant.\nPlease describe your sympoms for me diagnose you, or enter a health related question!".'
    )
    print(f"Chatbot: {setup}")

    while True:
        # Get input from the user
        user_input = input("You: ")

        if user_input.lower() in ["exit", "quit"]:
            print("Chatbot: Goodbye! Stay healthy!")
            break

        # Get diagnosis from the Gemini AI model
        diagnosis = get_diagnosis(user_input)

        # Display the diagnosis
        print(f"Chatbot: {diagnosis}")


if __name__ == "__main__":
    chatbot()
