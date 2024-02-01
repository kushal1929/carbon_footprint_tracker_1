// node --version # Should be >= 18
// npm install @google/generative-ai
import {geminiAPIkey} from "../APIkeys";

export function prompt1send(prompt1string){
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
    console.log(prompt1string);
    const parts = [
      {text: "The input is a user's monthly Information about their flights and the number of days in a week for which the user eats meat/veg is also given.As an environmentalist, compare the values with the recommended values and create a personalized action plan the user can take to reduce their carbon footprint based on this data.Some recommended values:flightHours:<5 hoursflightClass:\"economy\"total non-veg eating days <5Don't give steps for values within the recommended values. For example, if the user is already flying economy, do not recommend taking economy again.Do not mention any absolute numeric value. "},
      {text: "input: flightClass:\"economy\"\nflightHours:20\n\nfishEater:0 \nhighMeatEater:0 \nlowMeatEater:0 \nmediumMeatEater:0 \nvegan:0 \nvegetarian:7"},
      {text: "output: 1.Reduce the number of flights you take each month.\n2.Consider taking the train or bus instead of flying for short distances.\n3.Pack light to reduce the weight of your luggage.\n4.Buy local and organic food whenever possible.\n5.Take direct flights instead of connecting flights, as takeoffs and landings contribute significantly to carbon emissions."},
      {text: "input: flightClass:\"business\"\nflightHours:15\n\nfishEater:2\nhighMeatEater:3\nlowMeatEater:0\nmediumMeatEater:0 \nvegan:0 \nvegetarian:2"},
      {text: "output: 1.Opt for economy class rather than business or first class when flying.\n2.Decrease the frequency of your monthly flights.\n3.Travel with lighter luggage to minimize the weight and, consequently, the carbon footprint.\n4.Select nonstop flights over connecting flights,since takeoffs and landings significantly contribute to carbon emissions.\n5.Reduce the number of days you eat meat each week.\n6.Incorporate more plant-based options into your diet, including fruits, vegetables, and whole grains.\n7.Choose sustainably-sourced meat and fish."},
      {text: "input: flightClass:\"economy\"\nflightHours:2\n\nfishEater:0\nhighMeatEater:0\nlowMeatEater:0\nmediumMeatEater:0 \nvegan:0 \nvegetarian:7"},
      {text: "output: 1.You are already flying economy class, which is good.\n2.Consider taking the train or bus instead of flying for short distances.\n3.Travel with lighter luggage to cut down on the overall weight.\n4.Whenever feasible, choose local and organic food purchases.\n5.Take direct flights instead of connecting flights, as takeoffs and landings contribute significantly to carbon emissions."},
      {text: `input:${prompt1string} `},
      {text: "output: "},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
    return(response.text());
  }
  
  const response = run();
  return(response);
}