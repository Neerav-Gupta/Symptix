import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDQIggpSBguWQKuqrVhTzGULW4d06nxB_4");
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

export async function setup() {
    const prompt = 'You are going to be used as a chatbot which is going to have a back and forth conversation with a patient. The patient is either going to enter some symptoms they have, based on which you have to diagnose those symptoms, without the prompt explicity mentioning it, or they will have a medical related question which you have to answer. Do not answer any question which is not medical related and if the user ask for something of the sort say "I am currently unable to answer that.". To start the conversation, start by saying "Hello, I am the Symptix AI assistant.\nPlease describe your sympoms for me to diagnose you, or enter a health related question!".'
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function ask(prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text();
}