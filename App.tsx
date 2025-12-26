
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import { CATEGORIES, MOCK_NEWS } from './constants';
import { Category, NewsItem, GroundingSource, View } from './types';
import { fetchLiveNews } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [liveNews, setLiveNews] = useState<Partial<NewsItem>[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLiveUpdates = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchLiveNews(searchQuery || undefined);
    setLiveNews(result.articles);
    setSources(result.sources);
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    loadLiveUpdates();
  }, []);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Ad Banner */}
      <section className="w-full">
        <div className="bg-[#1a1a1a] w-full min-h-[220px] rounded-sm overflow-hidden relative flex flex-col md:flex-row items-center justify-between shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-1000" 
            alt="Luxury Real Estate"
          />
          <div className="relative z-20 p-8 md:p-12 text-white flex-1">
            <div className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 inline-block mb-3 uppercase tracking-[0.2em] animate-pulse">Live Listing</div>
            <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight uppercase">Skyscrapers of Mumbai</h2>
            <p className="text-xl text-amber-400 font-bold mb-1 uppercase tracking-tighter">New Launches starting Dec 2025</p>
            <p className="text-sm opacity-80 italic font-light">Exclusive Pre-Launch Access for IRT Members</p>
          </div>
          <div className="relative z-20 p-8 md:p-12">
            <button className="bg-amber-500 text-black font-black px-10 py-4 rounded-sm hover:bg-amber-400 transition-all uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transform active:scale-95">
              Get Invite
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-9 space-y-8">
          {/* Search & Status Bar */}
          <div className="bg-white p-5 border border-slate-200 flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
             <div className="flex gap-3 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search Live Indian Markets..."
                className="w-full text-xs border border-slate-200 py-3 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadLiveUpdates()}
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Real-Time Live Feed Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                Real-Time Market Pulse
              </h2>
              <button 
                onClick={loadLiveUpdates}
                disabled={isLoading}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Syncing...' : 'Sync Live Data'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* If syncing, show skeleton loaders */}
              {isLoading && [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-[400px] animate-pulse border border-slate-200 p-6 space-y-4">
                  <div className="bg-slate-100 h-48 w-full"></div>
                  <div className="bg-slate-100 h-6 w-3/4"></div>
                  <div className="bg-slate-100 h-20 w-full"></div>
                </div>
              ))}

              {/* Show Live News First */}
              {!isLoading && liveNews.map((item, idx) => (
                <NewsCard key={`live-${idx}`} news={item} />
              ))}

              {/* Show Mock News if no live news or to supplement */}
              {!isLoading && MOCK_NEWS.filter(n => activeCategory === 'All' || n.category === activeCategory).map(item => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>

          {/* Verification Footnote */}
          {sources.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Grounded Verification Sources</h4>
              <div className="flex flex-wrap gap-3">
                {sources.map((src, i) => (
                  <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 underline underline-offset-4 decoration-slate-300">
                    {src.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-3 space-y-8">
          {renderSidebarAds()}
        </aside>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      <div className="text-center py-16 bg-white border border-slate-100 shadow-sm px-6">
        <div className="text-[#cc0000] text-[11px] font-black uppercase tracking-[0.4em] mb-4">The Realty Journal</div>
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">Expert Perspectives</h2>
        <div className="w-20 h-1 bg-[#cc0000] mx-auto mb-8"></div>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed font-light italic">Deep insights into policy, urban development, and investment cycles.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[...liveNews, ...MOCK_NEWS].slice(0, 4).map((news, i) => (
          <div key={i} className="group cursor-pointer bg-white border border-slate-100 p-2 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden mb-6">
              <img src={news.imageUrl || `https://loremflickr.com/800/600/india,city,${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="" />
            </div>
            <div className="px-4 pb-6">
              <span className="text-[#cc0000] text-[10px] font-black uppercase tracking-[0.2em]">{news.category || 'Opinion'}</span>
              <h3 className="text-2xl font-bold mt-2 mb-4 group-hover:text-indigo-700 transition-colors leading-tight">{news.title}</h3>
              <p className="text-slate-500 text-[13px] leading-loose line-clamp-3 mb-6 font-light">{news.excerpt}</p>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-50">
                <span>By {news.author || 'IRT Editorial'}</span>
                <span className="text-indigo-600">Read Essay →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-12 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Rental Momentum', val: '+5.8%', color: 'text-green-600', desc: 'MoM increase in IT-hub residential leasing.' },
          { label: 'Interest Rate', val: '6.50%', color: 'text-slate-900', desc: 'RBI Repo rate holding steady for the quarter.' },
          { label: 'Commercial Absorption', val: '12M SqFt', color: 'text-indigo-600', desc: 'Net absorption across top 7 cities in Q3 2024.' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 border border-slate-200 text-center shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">{stat.label}</h4>
            <div className={`text-6xl font-black mb-6 tracking-tighter ${stat.color}`}>{stat.val}</div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1a] p-12 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[#cc0000] text-[10px] font-black uppercase tracking-[0.5em] mb-2 block">Data Analytics</span>
            <h2 className="text-4xl font-serif italic">Sector Outlook (2025-26)</h2>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Market Confidence Score: 8.4/10</div>
        </div>
        <div className="space-y-10">
          {[
            { name: 'Co-Living & Student Housing', growth: 85 },
            { name: 'Tier 2 Industrial Warehousing', growth: 72 },
            { name: 'Ultra-Luxury Gated Villas', growth: 94 },
            { name: 'Data Center Infrastructure', growth: 88 }
          ].map((sector) => (
            <div key={sector.name} className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span>{sector.name}</span>
                <span className="text-amber-500">{sector.growth}% Confidence</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: `${sector.growth}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCityGuides = () => (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Regional Portfolios</h2>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b-2 border-slate-200 pb-1">Filter by Tier</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { city: 'Mumbai', zones: 'Worli, BKC, Prabhadevi', price: '₹45k-1L /sqft', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=800&auto=format&fit=crop' },
          { city: 'Delhi-NCR', zones: 'Noida Exp, Gurugram Sec 103', price: '₹12k-25k /sqft', img: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=800&auto=format&fit=crop' },
          { city: 'Bangalore', zones: 'Sarjapur, Hebbal, Indiranagar', price: '₹9k-18k /sqft', img: 'https://images.unsplash.com/photo-1596422846543-b5c65171e939?q=80&w=800&auto=format&fit=crop' },
          { city: 'Pune', zones: 'Hinjewadi, Baner, Boat Club Road', price: '₹8k-15k /sqft', img: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?q=80&w=800&auto=format&fit=crop' },
          { city: 'Hyderabad', zones: 'Gachibowli, Tellapur, Jubilee Hills', price: '₹7k-14k /sqft', img: 'https://images.unsplash.com/photo-1605649433289-4034870512f4?q=80&w=800&auto=format&fit=crop' },
          { city: 'Ahmedabad', zones: 'SG Highway, GIFT City, Science City', price: '₹5k-10k /sqft', img: 'https://images.unsplash.com/photo-1626084287283-3397c84a424a?q=80&w=800&auto=format&fit=crop' }
        ].map((item) => (
          <div key={item.city} className="bg-white group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100">
            <div className="h-72 overflow-hidden relative">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{item.city}</h3>
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">{item.price}</span>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Growth Corridors</p>
              <p className="text-sm font-bold text-slate-800 mb-6">{item.zones}</p>
              <button className="w-full py-3 bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">Download Quarterly Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn py-10">
      <div className="bg-white border border-slate-200 p-16 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#cc0000]"></div>
        <div className="w-40 h-40 bg-slate-50 rounded-full mx-auto mb-10 flex items-center justify-center overflow-hidden border-8 border-white shadow-lg">
           {/* Dynamic image of the developer */}
           <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              alt="Pratik Raval" 
           />
        </div>
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-3 tracking-tight">Pratik Raval</h2>
        <p className="text-[#cc0000] font-black uppercase tracking-[0.5em] text-[11px] mb-10">Lead Software Architect</p>
        
        <div className="prose prose-slate max-w-2xl mx-auto text-slate-600 text-sm leading-relaxed font-light mb-12 space-y-6">
          <p>
            India Realty Trend represents a fusion of <strong>Real-Time Information Retrieval</strong> and <strong>Modern Aesthetic Design</strong>. 
            Developed by Pratik Raval, this platform utilizes Google's Gemini 3 Flash model to deliver grounded news insights that are accurate and current.
          </p>
          <p>
            Pratik's portfolio is defined by the creation of intelligent, data-driven interfaces that solve real-world complexities. 
            He believes that high-quality engineering should always be accompanied by uncompromising design excellence.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://ravalpratik.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-slate-900 text-white px-10 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-[#cc0000] transition-all flex items-center gap-3 shadow-xl hover:scale-105"
          >
            Explore Portfolio
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <a 
            href="mailto:ravalpratik1@gmail.com" 
            className="group border-2 border-slate-900 text-slate-900 px-10 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-md"
          >
            Contact Developer
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { label: 'Engineering', val: 'TypeScript / React 19', icon: '⚡' },
          { label: 'Intelligence', val: 'Gemini Search Grounding', icon: '🧠' },
          { label: 'Aesthetics', val: 'Tailwind / Typography', icon: '✨' }
        ].map(item => (
          <div key={item.label} className="bg-white p-8 border border-slate-100 shadow-sm">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</h4>
            <p className="text-xs font-bold text-slate-800">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSidebarAds = () => (
    <>
      <div className="bg-white p-5 border border-slate-200 flex flex-col items-center shadow-sm">
        <span className="text-[8px] text-slate-400 uppercase tracking-widest mb-4 font-black">Advertisement</span>
        <div className="bg-slate-900 w-full aspect-square relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="Ad" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
            <p className="text-amber-400 font-black text-xl mb-2 leading-tight uppercase tracking-tight shadow-sm">Smart City GIFT City</p>
            <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-80 mb-6">India's First Global Fin-Tech Hub</p>
            <button className="bg-white text-black text-[9px] font-black py-3 px-8 uppercase tracking-widest hover:bg-amber-400 transition-colors">Apply for Allotment</button>
          </div>
        </div>
      </div>
      
      <div className="bg-[#cc0000] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Market Pulse</h3>
        <p className="text-xs opacity-90 mb-8 leading-relaxed font-light relative z-10">Real-time alerts on policy changes and RERA filings delivered to your inbox.</p>
        <div className="space-y-4 relative z-10">
          <input type="email" placeholder="professional@email.com" className="w-full bg-white text-slate-900 rounded-sm py-3 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none" />
          <button className="w-full bg-slate-900 text-white font-black py-3 rounded-sm hover:bg-white hover:text-[#cc0000] transition-all text-[10px] uppercase tracking-widest shadow-lg">Subscribe Free</button>
        </div>
      </div>

      <div className="bg-white p-6 border border-slate-200">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-50">Local Trends</h3>
        <div className="space-y-5">
          {[
            { city: 'GIFT City', val: '+22.4%', up: true },
            { city: 'Navi Mumbai', val: '+12.1%', up: true },
            { city: 'Noida Exp.', val: '+8.9%', up: true },
            { city: 'Whitefield', val: '+14.5%', up: true }
          ].map(c => (
            <div key={c.city} className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">{c.city}</span>
              <span className={`text-[10px] font-black ${c.up ? 'text-green-600' : 'text-red-600'}`}>
                {c.up ? '↑' : '↓'} {c.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-[#f8f8f8] min-h-screen selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'home' && renderHome()}
        {currentView === 'blog' && renderBlog()}
        {currentView === 'trends' && renderTrends()}
        {currentView === 'city-guides' && renderCityGuides()}
        {currentView === 'about' && renderAbout()}
      </div>

      <footer className="bg-[#1a1a1a] text-white py-20 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-serif italic mb-8 border-l-4 border-[#cc0000] pl-6">India Realty Trend</h4>
              <p className="text-slate-400 text-xs leading-loose max-w-sm mb-8 font-light">
                Redefining the standard for property intelligence in the Indian market. Utilizing advanced generative AI to provide a clear, grounded perspective on investment opportunities.
              </p>
              <div className="flex gap-4">
                <a href="https://ravalpratik.vercel.app/" target="_blank" rel="noopener" className="bg-white/5 hover:bg-white/10 p-3 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-widest mb-8 text-[#cc0000]">Navigation</h5>
              <ul className="space-y-5 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                <li onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer transition-colors">Global Home</li>
                <li onClick={() => navigateTo('blog')} className="hover:text-white cursor-pointer transition-colors">Research Journal</li>
                <li onClick={() => navigateTo('trends')} className="hover:text-white cursor-pointer transition-colors">Trend Matrix</li>
                <li onClick={() => navigateTo('city-guides')} className="hover:text-white cursor-pointer transition-colors">Zone Analysis</li>
                <li onClick={() => navigateTo('about')} className="hover:text-white cursor-pointer transition-colors">Architect Info</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-widest mb-8 text-slate-500">Legal & Press</h5>
              <ul className="space-y-5 text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Framework</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Engagement</li>
                <li className="hover:text-white cursor-pointer transition-colors">Brand Assets</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 text-[10px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-medium">© 2025 INDIA REALTY TREND. ARCHITECTED BY <a href="https://ravalpratik.vercel.app/" target="_blank" className="text-white hover:text-[#cc0000] border-b border-white/10 transition-all">PRATIK RAVAL</a>.</p>
            <div className="flex gap-8 uppercase tracking-[0.3em] font-black opacity-40">
              <span>BOM</span>
              <span>DEL</span>
              <span>BLR</span>
              <span>HYD</span>
              <span>AMD</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
