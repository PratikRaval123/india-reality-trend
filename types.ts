
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  sourceUrl?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export type Category = 'All' | 'Residential' | 'Commercial' | 'Policy' | 'Economy' | 'Infrastructure';

export type View = 'home' | 'blog' | 'trends' | 'city-guides' | 'about';
