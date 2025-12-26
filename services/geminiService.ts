
import { GoogleGenAI } from "@google/genai";
import { NewsItem, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Fetches real-time real estate data from India using Gemini Search Grounding.
 * Prioritizes actual market moves, policy changes, and infrastructure developments.
 */
export async function fetchLiveNews(query: string = "current real estate market trends India Oct 2024"): Promise<{ articles: Partial<NewsItem>[], sources: GroundingSource[] }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a deep search for the most recent and critical real estate, economy, and infrastructure news in India.
      Find exactly 6 distinct and verifiable stories. 
      For each story, provide the data in this EXACT format:
      
      TITLE: [Specific Headline]
      EXCERPT: [Professional 2-sentence summary including specific data points if available]
      CATEGORY: [Choose ONE: Residential, Commercial, Policy, Economy, Infrastructure]
      IMAGE_PROMPT: [3 specific visual keywords for architectural photography, e.g., 'mumbai high-rise', 'bangalore office park', 'delhi metro construction']
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

    const articles: Partial<NewsItem>[] = [];
    const sections = text.split('---');

    sections.forEach((section) => {
      const title = section.match(/TITLE:\s*(.*)/i)?.[1]?.trim();
      const excerpt = section.match(/EXCERPT:\s*(.*)/i)?.[1]?.trim();
      const category = section.match(/CATEGORY:\s*(.*)/i)?.[1]?.trim();
      const imagePrompt = section.match(/IMAGE_PROMPT:\s*(.*)/i)?.[1]?.trim() || 'indian architecture';

      if (title && excerpt) {
        articles.push({
          id: `live-${Math.random().toString(36).substr(2, 5)}`,
          title,
          excerpt,
          category: category || 'Market Update',
          // Using keywords for high-quality contextual images
          imageUrl: `https://loremflickr.com/800/600/architecture,india,building,${imagePrompt.replace(/\s+/g, ',')}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          author: 'IRT Analytics',
          readTime: '3 min'
        });
      }
    });

    return { 
      articles: articles.slice(0, 6), 
      sources 
    };
  } catch (error) {
    console.error("Critical error in Live News Service:", error);
    return { articles: [], sources: [] };
  }
}
