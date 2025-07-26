const fs = require("fs");
const path = require("path");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Initialize with Google Gemini (more stable than OpenRouter)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 2048,
});

console.log("[LLM] Using Google Gemini API");
console.log("[LLM] API Key present:", (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) ? "✓ Yes" : "✗ No");

// Cache untuk mencegah repetitive API calls
const roadmapCache = new Map();
const pendingRequests = new Map();
const accessibilityCache = new Map();

function loadPrompt(filename, vars = {}) {
  let prompt = fs.readFileSync(path.join(__dirname, "prompts", filename), "utf-8");
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

// Simple function untuk generate accessibility guidance terpisah
async function generateAccessibilityGuidance(jobTitle, disabilities) {
  if (!disabilities || disabilities.length === 0) {
    return null;
  }

  const cacheKey = `accessibility_${jobTitle}_${disabilities}`;
  
  if (accessibilityCache.has(cacheKey)) {
    console.log("[Accessibility] Using cached guidance");
    return accessibilityCache.get(cacheKey);
  }

  try {
    console.log("[Accessibility] Generating guidance for:", jobTitle, "with disabilities:", disabilities);
    
    const simplePrompt = `Create detailed accessibility guidance for someone with ${disabilities} who wants to work as a ${jobTitle}.

Please provide practical, actionable advice covering:

1. **Workplace Accommodations**: Specific accommodations needed for this role
2. **Assistive Technologies**: Tools and software that can help
3. **Skill Development**: How to adapt learning and skill development
4. **Career Advancement**: Tips for professional growth and networking
5. **Industry Considerations**: Specific considerations for this field

Write in a supportive, empowering tone using markdown formatting. Focus on abilities and solutions, not limitations.

Generate the guidance now:`;

    const response = await llm.invoke(simplePrompt);
    const guidance = response.content.trim();
    
    console.log("[Accessibility] Generated guidance successfully");
    
    // Cache the result
    accessibilityCache.set(cacheKey, guidance);
    
    return guidance;
  } catch (error) {
    console.error("[Accessibility] Error generating guidance:", error);
    return "Accessibility guidance could not be generated at this time. Please try refreshing the page or contact support if the issue persists.";
  }
}

async function generateCompleteRoadmap(prompt, cacheKey) {
  // Check cache first
  if (roadmapCache.has(cacheKey)) {
    console.log("[Gemini] Using cached result for:", cacheKey);
    return roadmapCache.get(cacheKey);
  }

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    console.log("[Gemini] Waiting for pending request:", cacheKey);
    return await pendingRequests.get(cacheKey);
  }

  // Create new request
  const requestPromise = (async () => {
    try {
      console.log("[LLM] Making API request...");
      
      const response = await llm.invoke(prompt);
      const text = response.content.trim();

      console.log("[Gemini] Raw response:", text.slice(0, 300) + "...");

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
          console.log("[Gemini] Successfully parsed complete roadmap");
          // Cache the result
          roadmapCache.set(cacheKey, parsed);
          return parsed;
        } else {
          throw new Error("Invalid roadmap structure");
        }
      } catch (e) {
        console.error("[Gemini] JSON parsing failed:", e.message);
        console.error("[Gemini] Attempted to parse:", jsonText.slice(0, 500));

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

async function generateRoadmap(jobTitle, disabilities = null) {
  console.log(`[Roadmap Generator] Starting roadmap generation for: ${jobTitle}`, disabilities ? `with disabilities: ${disabilities}` : '');

  // Create cache key for main roadmap (without disabilities)
  const cacheKey = `roadmap_${jobTitle.toLowerCase().replace(/\s+/g, '_')}`;
  
  if (roadmapCache.has(cacheKey)) {
    console.log("[Roadmap Generator] Using cached roadmap for:", jobTitle);
    const cachedRoadmap = roadmapCache.get(cacheKey);
    
    // If we have disabilities, generate accessibility guidance separately
    if (disabilities && disabilities.length > 0) {
      console.log("[Roadmap Generator] Adding accessibility guidance...");
      const accessibilityGuidance = await generateAccessibilityGuidance(jobTitle, disabilities);
      return {
        ...cachedRoadmap,
        disabilityGuidance: accessibilityGuidance
      };
    }
    
    return cachedRoadmap;
  }

  // Generate main roadmap without disabilities
  console.log("[Roadmap Generator] Generating main roadmap...");

  const mainPrompt = `Generate a complete learning roadmap for "${jobTitle}" position.

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

  console.log("[Roadmap Generator] Main prompt:", mainPrompt);

  const result = await generateCompleteRoadmap(mainPrompt, cacheKey);
  
  // If we have disabilities, add accessibility guidance
  if (disabilities && disabilities.length > 0) {
    console.log("[Roadmap Generator] Adding accessibility guidance...");
    const accessibilityGuidance = await generateAccessibilityGuidance(jobTitle, disabilities);
    result.disabilityGuidance = accessibilityGuidance;
  }

  console.log("[Roadmap Generator] Complete roadmap generated successfully");
  return result;
}

module.exports = { generateRoadmap };
