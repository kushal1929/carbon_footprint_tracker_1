// node --version # Should be >= 18
// npm install @google/generative-ai
import geminiAPIkey from "../GeminiAPIkey";

export function prompt1send(){
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-pro";
  const API_KEY = geminiAPIkey;
  
  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1024,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const parts = [
      {text: "The input is a user's monthly Information about their flights and the number of days in a week for which the user eats meat/veg is also given.As an environmentalist, compare the values with the recommended values and create a personalized action plan the user can take to reduce their carbon footprint based on this data.Some recommended values:flightHours:<5 hoursflightClass:\"economy\"total non-veg eating days <5Don't give steps for values within the recommended values.. For example, if the user is already flying economy, do not recommend taking economy again.Do not mention any absolute numeric value. "},
      {text: "input: flightCarbonFootprint:1800\nflightClass:\"economy\"\nflightHours:20\n\nfoodCarbonFootprint:162\nfishEater:0 \nhighMeatEater:0 \nlowMeatEater:0 \nmediumMeatEater:0 \nvegan:0 \nvegetarian:7"},
      {text: "output: 1.Reduce the number of flights you take each month.\n2.Consider taking the train or bus instead of flying for short distances.\n3.Pack light to reduce the weight of your luggage.\n4.Buy local and organic food whenever possible.\n5.Take direct flights instead of connecting flights, as takeoffs and landings contribute significantly to carbon emissions."},
      {text: "input: flightCarbonFootprint:3000\nflightClass:\"business\"\nflightHours:15\n\nfoodCarbonFootprint:300\nfishEater:2\nhighMeatEater:3\nlowMeatEater:0\nmediumMeatEater:0 \nvegan:0 \nvegetarian:2"},
      {text: "output: "},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
  }
  
  run();
}