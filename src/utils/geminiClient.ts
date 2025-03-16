import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface Resource {
  name: string;
  link: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  resources: Resource[];
}

export interface RoadmapData {
  title?: string;
  steps: RoadmapStep[];
}

interface KeywordExtractionResult {
  keywords: string[];
  skills: string[];
  technologies: string[];
  analysis: string;
}

export const extractKeywords = async (jobDescription: string): Promise<KeywordExtractionResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this job description and extract important information. Return the response in this JSON format:
    {
      "keywords": ["list", "of", "important", "keywords"],
      "skills": ["required", "and", "preferred", "skills"],
      "technologies": ["specific", "technologies", "mentioned"],
      "analysis": "A brief analysis of the key requirements and qualifications"
    }

    Job Description:
    ${jobDescription}

    Important: Return only the JSON data without any markdown code blocks or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract only the JSON
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
    
    try {
      const extractionData = JSON.parse(cleanedText);
      return extractionData;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.log("Raw response:", text);
      throw new Error("Failed to parse the extracted keywords. Please try again.");
    }
  } catch (error) {
    console.error("Error extracting keywords with Gemini:", error);
    throw new Error("Failed to extract keywords. Please try again later.");
  }
};

export const generateRoadmapWithGemini = async (careerGoal: string): Promise<RoadmapData> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a detailed career roadmap for becoming a ${careerGoal}. 
    The response should be in JSON format with the following structure:
{
      "title": "Career Title",
      "steps": [
        {
          "title": "Step Title",
          "description": "Detailed description of what to learn/do in this step",
          "resources": [
            {
              "name": "Resource Name",
              "link": "Resource URL"
            }
          ]
        }
      ]
    }
    Include 6-8 steps with 2-3 relevant resources for each step. Make sure the steps are in logical order
    and the resources are real, high-quality learning materials (courses, documentation, tutorials, etc).
    Important: Return only the JSON data without any markdown code blocks or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to extract only the JSON
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
    
    try {
      const roadmapData = JSON.parse(cleanedText);
      return roadmapData;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.log("Raw response:", text);
      throw new Error("Failed to parse the generated roadmap. Please try again.");
    }
  } catch (error) {
    console.error("Error generating roadmap with Gemini:", error);
    throw new Error("Failed to generate roadmap. Please try again later.");
  }
}; 