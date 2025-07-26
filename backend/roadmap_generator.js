const fs = require("fs");
const path = require("path");
const { ChatOpenAI } = require("@langchain/openai");

// Initialize LangChain with OpenRouter using Gemma model
const llm = new ChatOpenAI({
  model: "google/gemma-3n-e2b-it:free",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.7,
  maxTokens: 2048,
});

// Cache untuk mencegah repetitive API calls
const roadmapCache = new Map();
const pendingRequests = new Map();

function loadPrompt(filename, vars = {}) {
  let prompt = fs.readFileSync(path.join(__dirname, "prompts", filename), "utf-8");
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

async function generateCompleteRoadmap(prompt, cacheKey) {
  // Check cache first
  if (roadmapCache.has(cacheKey)) {
    console.log("[OpenRouter Gemma] Using cached result for:", cacheKey);
    return roadmapCache.get(cacheKey);
  }

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    console.log("[OpenRouter Gemma] Waiting for pending request:", cacheKey);
    return await pendingRequests.get(cacheKey);
  }

  // Create new request
  const requestPromise = (async () => {
    try {
      const response = await llm.invoke(prompt);
      const text = response.content.trim();

      console.log("[OpenRouter Gemma] Raw response:", text.slice(0, 300) + "...");

      // Extract JSON from markdown code blocks or raw text
      let jsonText = text;

      // Remove markdown code blocks (```json and ```)
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');

      // Try to find JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      // Clean up any extra characters
      jsonText = jsonText.trim();

      // Validate and parse JSON
      try {
        const parsed = JSON.parse(jsonText);
        if (parsed && typeof parsed === 'object' && parsed.basic && parsed.intermediate && parsed.advanced) {
          console.log("[OpenRouter Gemma] Successfully parsed complete roadmap");
          // Cache the result
          roadmapCache.set(cacheKey, parsed);
          return parsed;
        } else {
          throw new Error("Invalid roadmap structure");
        }
      } catch (e) {
        console.error("[OpenRouter Gemma] JSON parsing failed:", e.message);
        console.error("[OpenRouter Gemma] Attempted to parse:", jsonText.slice(0, 500));

        // Return a fallback roadmap structure
        const fallback = {
          basic: [{
            title: "Basic Skills",
            description: "Unable to parse roadmap from LLM response. Please try again."
          }],
          intermediate: [{
            title: "Intermediate Skills",
            description: "Unable to parse roadmap from LLM response. Please try again."
          }],
          advanced: [{
            title: "Advanced Skills",
            description: "Unable to parse roadmap from LLM response. Please try again."
          }]
        };
        roadmapCache.set(cacheKey, fallback);
        return fallback;
      }
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        console.error("Rate limit exceeded. Waiting 20 seconds...");
        await new Promise(resolve => setTimeout(resolve, 20000));
        // Retry sekali lagi
        return await generateCompleteRoadmap(prompt, cacheKey);
      }
      throw error;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store pending request
  pendingRequests.set(cacheKey, requestPromise);

  return await requestPromise;
}

async function generateRoadmap(jobTitle) {
  console.log(`[Roadmap Generator] Starting roadmap generation for: ${jobTitle}`);

  // Check if complete roadmap is already cached
  const cacheKey = `roadmap_${jobTitle.toLowerCase().replace(/\s+/g, '_')}`;
  if (roadmapCache.has(cacheKey)) {
    console.log("[Roadmap Generator] Using cached complete roadmap for:", jobTitle);
    return roadmapCache.get(cacheKey);
  }

  // Generate complete roadmap in single API call
  console.log("[Roadmap Generator] Generating complete roadmap...");

  const completePrompt = `Generate a complete learning roadmap for "${jobTitle}" position.

Please provide a comprehensive roadmap with three skill levels: Basic, Intermediate, and Advanced.

Return the response as a JSON object with this exact structure:
{
  "basic": [
    {"title": "Skill Name", "description": "Detailed description of what to learn and why it's important"}
  ],
  "intermediate": [
    {"title": "Skill Name", "description": "Detailed description of what to learn and why it's important"}
  ],
  "advanced": [
    {"title": "Skill Name", "description": "Detailed description of what to learn and why it's important"}
  ]
}

Guidelines:
- Basic: 5-7 fundamental skills every beginner should master first
- Intermediate: 5-7 skills to build upon the basics, more specialized knowledge
- Advanced: 5-7 expert-level skills for senior positions and specialization
- Each description should be practical and actionable
- Focus on skills most relevant to ${jobTitle} role
- Include both technical and soft skills where appropriate

Generate the complete roadmap now:`;

  const result = await generateCompleteRoadmap(completePrompt, cacheKey);

  console.log("[Roadmap Generator] Complete roadmap generated successfully");
  return result;
}

module.exports = { generateRoadmap };
