
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as a named parameter in the initialization object.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrainingPlan = async (intern: { course: string; company: string; department: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 12-week OJT training plan for a student taking ${intern.course} interning at ${intern.company} in the ${intern.department} department. Format as a JSON array of weekly modules.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              week: { type: Type.NUMBER },
              topic: { type: Type.STRING },
              objectives: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["week", "topic", "objectives"]
          }
        }
      }
    });
    
    // Correctly extract text using the .text property (not a method).
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating training plan:", error);
    return null;
  }
};

export const analyzeProgress = async (logs: any[], internName: string) => {
  try {
    const logSummary = logs.map(l => `${l.date}: ${l.taskDescription}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these internship logs for ${internName}:\n${logSummary}\n\nProvide a professional summary of key achievements, identified skills, and suggestions for areas to focus on next. Return plain text summary.`,
    });
    
    // Correctly extract text using the .text property (not a method).
    return response.text;
  } catch (error) {
    console.error("Error analyzing progress:", error);
    return "Analysis currently unavailable.";
  }
};
//new