
import { Category, NewsItem } from './types';

export const CATEGORIES: Category[] = ['All', 'Residential', 'Commercial', 'Policy', 'Economy', 'Infrastructure'];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Mumbai Luxury Housing Market Sees Record Surge in Q1 2024',
    excerpt: 'The luxury residential sector in Mumbai has outperformed expectations with a 40% increase in high-ticket transactions.',
    content: 'Mumbai continues to lead India\'s real estate recovery, particularly in the luxury segment. Developers are seeing unprecedented demand for premium sea-facing properties in areas like Worli and South Mumbai...',
    category: 'Residential',
    author: 'Rajesh Sharma',
    date: 'Oct 24, 2024',
    imageUrl: 'https://picsum.photos/seed/mumbai/800/600',
    readTime: '5 min'
  },
  {
    id: '2',
    title: 'New RERA Guidelines to Streamline Project Approvals in Karnataka',
    excerpt: 'The state government is introducing a digital-first approach to speed up regulatory clearances for housing projects.',
    content: 'In a move aimed at boosting developer confidence, the Karnataka government has announced new amendments to RERA rules that promise to cut down approval times by half...',
    category: 'Policy',
    author: 'Priya Iyer',
    date: 'Oct 23, 2024',
    imageUrl: 'https://picsum.photos/seed/karnataka/800/600',
    readTime: '4 min'
  },
  {
    id: '3',
    title: 'IT Hubs Drive Commercial Leasing in Hyderabad and Pune',
    excerpt: 'Flexible workspaces and traditional office leasing show strong growth as global firms expand their GCC footprint in India.',
    content: 'Hyderabad and Pune have emerged as the frontrunners in office space absorption for the current quarter, driven largely by Global Capability Centers (GCCs)...',
    category: 'Commercial',
    author: 'Amit Verma',
    date: 'Oct 22, 2024',
    imageUrl: 'https://picsum.photos/seed/office/800/600',
    readTime: '6 min'
  }
];
