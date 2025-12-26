
import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem | Partial<NewsItem>;
  layout?: 'vertical' | 'horizontal';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, layout = 'vertical' }) => {
  const imageUrl = news.imageUrl || `https://picsum.photos/seed/${news.id || Math.random()}/800/600`;

  return (
    <div className="bg-white group cursor-pointer border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {news.imageUrl && (
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={imageUrl} 
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <span className="inline-block bg-[#cc0000] text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
            {news.category || 'Realty Trends'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors">
          {news.title}
        </h3>
        
        <div className="flex items-center text-[11px] text-slate-400 mb-4 gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="uppercase tracking-widest">{news.date || 'December 6, 2025'}</span>
        </div>
        
        <p className="text-slate-600 text-[13.5px] leading-relaxed mb-6 line-clamp-3">
          {news.excerpt}
        </p>
        
        <div className="mt-auto">
          <a href="#" className="text-[#cc0000] text-xs font-bold underline underline-offset-4 hover:text-indigo-600 transition-colors">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
