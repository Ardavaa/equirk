const fs = require("fs");
const path = require("path");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Initialize with Google Gemini (more stable than OpenRouter)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  temperature: 0.1, // Lower temperature for more consistent JSON output
  maxOutputTokens: 3000, // Increased for disability guidance
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

      // If response contains markdown headers, it's not following JSON format
      if (jsonText.includes('##') || jsonText.includes('**') || jsonText.includes('###')) {
        console.error("[Gemini] Response is markdown instead of JSON, forcing fallback");
        throw new Error("LLM returned markdown instead of JSON");
      }

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
          // Ensure arrays are properly formatted
          if (Array.isArray(parsed.basic) && Array.isArray(parsed.intermediate) && Array.isArray(parsed.advanced)) {
            // If disabilityGuidance exists, ensure it's also an array
            if (parsed.disabilityGuidance && !Array.isArray(parsed.disabilityGuidance)) {
              console.warn("[Gemini] disabilityGuidance is not an array, converting...");
              parsed.disabilityGuidance = [];
            }
            // Cache the result
            roadmapCache.set(cacheKey, parsed);
            return parsed;
          } else {
            throw new Error("Skills sections are not arrays");
          }
        } else {
          throw new Error("Invalid roadmap structure - missing required sections");
        }
      } catch (e) {
        console.error("[Gemini] JSON parsing failed:", e.message);

        // Check if response contains markdown instead of JSON
        if (jsonText.includes('##') || jsonText.includes('**') || jsonText.includes('###')) {
          console.error("[Gemini] Response appears to be markdown instead of JSON");
        }

        // Return a fallback roadmap structure
        const fallback = {
          basic: [{
            title: "Basic Skills",
            description: "Unable to parse roadmap from LLM response. Please regenerate the roadmap."
          }],
          intermediate: [{
            title: "Intermediate Skills",
            description: "Unable to parse roadmap from LLM response. Please regenerate the roadmap."
          }],
          advanced: [{
            title: "Advanced Skills",
            description: "Unable to parse roadmap from LLM response. Please regenerate the roadmap."
          }]
        };

        // Add disability guidance fallback if needed
        if (cacheKey.includes('_')) { // Has disabilities in cache key
          fallback.disabilityGuidance = [{
            title: "Accessibility Guidance",
            description: "LLM failed to generate proper accessibility guidance. Please try regenerating the roadmap."
          }];
        }

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

  // Create cache key including disabilities for proper caching
  const cacheKey = `roadmap_${jobTitle.toLowerCase().replace(/\s+/g, '_')}${disabilities ? `_${disabilities.replace(/\s+/g, '_')}` : ''}`;

  if (roadmapCache.has(cacheKey)) {
    console.log("[Roadmap Generator] Using cached roadmap for:", jobTitle);
    return roadmapCache.get(cacheKey);
  }

  // Generate complete roadmap including disabilities if present
  console.log("[Roadmap Generator] Generating complete roadmap...");

  const hasDisabilities = disabilities && disabilities.length > 0;

  const mainPrompt = `JSON ONLY. No markdown. No explanations. No text outside JSON. No emojis.

Generate roadmap for ${jobTitle}${hasDisabilities ? ` with accessibility guidance for ${disabilities}` : ''}.

{
  "basic": [
    {"title": "Skill Name", "description": "Brief description (max 5 sentences)"}
  ],
  "intermediate": [
    {"title": "Skill Name", "description": "Brief description (max 5 sentences)"}
  ],
  "advanced": [
    {"title": "Skill Name", "description": "Brief description (max 5 sentences)"}
  ]${hasDisabilities ? `,
  "disabilityGuidance": [
    {"title": "Workplace Accommodations", "description": "Detailed explanation of specific tools, workplace modifications, and environmental adjustments for ${disabilities} in ${jobTitle} role. Include concrete examples and implementation strategies."},
    {"title": "Technology Recommendations", "description": "Comprehensive list of assistive technologies, software, hardware, and digital tools that enhance productivity for ${disabilities} in ${jobTitle}."},
    {"title": "Skill Adaptation Strategies", "description": "Detailed methods for adapting learning paths and skill development processes for ${disabilities}. Include alternative learning approaches and techniques."},
    {"title": "Career Advancement Tips", "description": "Specific strategies for professional growth, networking, self-advocacy, and building successful career while managing ${disabilities}."},
    {"title": "Industry Considerations", "description": "Unique challenges, opportunities, and best practices specific to ${jobTitle} field for individuals with ${disabilities}. Include companies known for inclusive practices."},
    {"title": "Communication Strategies", "description": "Effective workplace communication methods and protocols for ${disabilities}. Include tools and techniques for clear professional interaction."},
    {"title": "Community & Resources", "description": "Professional organizations, support networks, mentorship programs, and communities specifically for people with ${disabilities} in ${jobTitle} field."}
  ]` : ''}
}

Return valid JSON only:`;

  console.log("[Roadmap Generator] Main prompt:", mainPrompt);

  const result = await generateCompleteRoadmap(mainPrompt, cacheKey);

  console.log("[Roadmap Generator] Complete roadmap generated successfully");
  return result;
}

module.exports = { generateRoadmap };
