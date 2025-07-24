const fs = require("fs");
const path = require("path");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Initialize LangChain with Google GenAI - specify Flash model explicitly
const llm = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 2048,
});

function loadPrompt(filename, vars = {}) {
  let prompt = fs.readFileSync(path.join(__dirname, "prompts", filename), "utf-8");
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

async function generateGemini(prompt) {
  try {
    const response = await llm.invoke(prompt);
    const text = response.content.trim();
    
    console.log("[LangChain Gemini] Raw response:", text.slice(0, 300) + "...");
    
    // Extract JSON from markdown code blocks or raw text
    let jsonText = text;
    
    // Remove markdown code blocks (```json and ```)
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Try to find JSON array in the response
    const jsonMatch = jsonText.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    // Clean up any extra characters
    jsonText = jsonText.trim();
    
    // Validate and parse JSON
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        console.log("[LangChain Gemini] Successfully parsed JSON array with", parsed.length, "items");
        return parsed; // Return the parsed array directly
      } else {
        throw new Error("Not an array");
      }
    } catch (e) {
      console.error("[LangChain Gemini] JSON parsing failed:", e.message);
      console.error("[LangChain Gemini] Attempted to parse:", jsonText.slice(0, 500));
      
      // Return a fallback JSON array
      return [{
        title: "Skills for this level",
        description: "Unable to parse skills from LLM response. Please try again."
      }];
    }
  } catch (error) {
    if (error.message.includes('429') || error.message.includes('quota')) {
      console.error("Rate limit exceeded. Waiting 20 seconds...");
      await new Promise(resolve => setTimeout(resolve, 20000));
      // Retry sekali lagi
      return await generateGemini(prompt);
    }
    throw error;
  }
}

async function generateRoadmap(jobTitle) {
  console.log(`[Roadmap Generator] Starting roadmap generation for: ${jobTitle}`);
  
  // 1. Basic
  console.log("[Roadmap Generator] Generating Basic skills...");
  const promptBasic = loadPrompt("prompt_beginner.md", { jobTitle });
  const basicSkills = await generateGemini(promptBasic);
  console.log("[Roadmap Generator] Basic skills received:", basicSkills);

  // 2. Intermediate
  console.log("[Roadmap Generator] Generating Intermediate skills...");
  const promptIntermediate = loadPrompt("prompt_intermediate.md", {
    jobTitle,
    basicSkills: JSON.stringify(basicSkills, null, 2)
  });
  const intermediateSkills = await generateGemini(promptIntermediate);
  console.log("[Roadmap Generator] Intermediate skills received:", intermediateSkills);

  // 3. Advanced
  console.log("[Roadmap Generator] Generating Advanced skills...");
  const promptAdvanced = loadPrompt("prompt_advanced.md", {
    jobTitle,
    basicSkills: JSON.stringify(basicSkills, null, 2),
    intermediateSkills: JSON.stringify(intermediateSkills, null, 2)
  });
  const advancedSkills = await generateGemini(promptAdvanced);
  console.log("[Roadmap Generator] Advanced skills received:", advancedSkills);

  const result = {
    basic: basicSkills,
    intermediate: intermediateSkills,
    advanced: advancedSkills
  };
  
  console.log("[Roadmap Generator] Final result:", JSON.stringify(result, null, 2));
  return result;
}

module.exports = { generateRoadmap };
