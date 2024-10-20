# Symptix

**Symptix** is a comprehensive healthcare platform designed to assist patients in managing their health through the use of AI technology. The platform offers two core functionalities:

1. **Symptom Diagnosis**: Symptix uses advanced AI models to diagnose patients based on their symptoms. By inputting symptoms into the system, users receive potential diagnoses and insights on possible medical conditions. This feature aims to help patients make informed decisions before seeking medical consultation.

2. **Community Forum**: Symptix includes a forum where users can ask health-related questions, share experiences, and provide support for one another. Patients can post questions about symptoms, treatments, and conditions, with the ability to receive replies, likes, and dislikes. The forum fosters a supportive environment for shared learning.

## Features

### Symptom Diagnosis with AI

- **User-Friendly Interface**: Enter symptoms in a search bar and receive a list of potential diagnoses.
- **Accurate AI Predictions**: Leverages medical data to provide a probability-based diagnosis.
- **Fast Results**: Get your potential diagnosis quickly with insights on medical conditions.

### Community Forum

- **Post Questions**: Ask questions related to symptoms, treatments, and health advice.
- **Reply & Interact**: Respond to other users' questions, provide feedback, and share experiences.
- **Likes & Dislikes**: Engage with the community through likes and dislikes on posts.

## Technologies Used

- **Frontend**: Svelte
- **Backend**: Firebase
- **AI Models**: Gemini 1.0 Pro
- **API Integration**: Endless Medical API for symptom analysis

## How it Works

1. **Signup**: Users create an account on the platform.
2. **Symptom Input**: Users input their symptoms in the diagnosis section.
3. **AI Diagnosis**: The AI analyzes the symptoms and presents a list of possible diagnoses with probabilities.
4. **Engage in Forum**: Users can participate in community discussions to gain more insights or share their own experiences.

## Future Plans

- **Real-Time Chat with Doctors**: Integrate a feature to chat with medical professionals.
- **Health Tracking**: Enable users to track symptoms over time for better diagnosis.

## Design & Color Theme

- **Primary Colors**: #16423C, #6A9C89, #C4DAD2, #E9EFEC
- **Design Layout**: Modern, responsive design with a clean interface.

## Getting Started

To start using Symptix, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/symptix.git
   ```
2. Install the dependencies:
   ```bash
   cd symptix
   npm install
   ```
3. Update the API Key for AI usage and Firebase information for live forum support, which is found in `/src/lib/Chatbot/chatbot.js` and `console.log("Hello, world!");``/src/lib/API/Firbase.js`, respectively.
4. Run the app:
   ```bash
   npm run dev
   ```
