
import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function fetchLiveNews(query: string = "latest breaking real estate news India today"): Promise<{ articles: Partial<NewsItem>[], sources: GroundingSource[] }> {
  try {
    // We use gemini-3-flash-preview for high speed and search grounding capability.
    // Note: responseMimeType: "application/json" is NOT compatible with googleSearch grounding.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find the most recent (last 48 hours) real estate and infrastructure news in India.
      For each of the top 5 distinct stories, provide the following structure:
      TITLE: [The headline]
      EXCERPT: [A concise 2-sentence summary]
      CATEGORY: [One of: Residential, Commercial, Policy, Economy, Infrastructure]
      IMAGE_KEY: [2-3 very specific keywords for a high-quality property photo, e.g., 'mumbai skyscrapers', 'modern office bangalore', 'indian highway construction']
      ---`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    // Robust parsing of the text response
    const articles: Partial<NewsItem>[] = [];
    const sections = text.split('---');

    sections.forEach((section) => {
      const titleMatch = section.match(/TITLE:\s*(.*)/i);
      const excerptMatch = section.match(/EXCERPT:\s*(.*)/i);
      const categoryMatch = section.match(/CATEGORY:\s*(.*)/i);
      const imageKeyMatch = section.match(/IMAGE_KEY:\s*(.*)/i);

      if (titleMatch && excerptMatch) {
        const keyword = (imageKeyMatch?.[1] || 'real estate india').trim().replace(/\s+/g, ',');
        articles.push({
          id: Math.random().toString(36).substr(2, 9),
          title: titleMatch[1].trim(),
          excerpt: excerptMatch[1].trim(),
          category: (categoryMatch?.[1] || 'General').trim(),
          // Using a high-quality keyword-based image provider to match real-time news context
          imageUrl: `https://loremflickr.com/800/600/architecture,building,${keyword}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          author: 'IRT Intelligence',
          readTime: '4 min'
        });
      }
    });

    return { 
      articles: articles.length > 0 ? articles : [], 
      sources 
    };
  } catch (error) {
    console.error("Error fetching live news:", error);
    return { articles: [], sources: [] };
  }
}
