
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

  const loadLiveUpdates = useCallback(async (query?: string) => {
    setIsLoading(true);
    const result = await fetchLiveNews(query || undefined);
    setLiveNews(result.articles);
    setSources(result.sources);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLiveUpdates();
  }, [loadLiveUpdates]);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Views ---

  const renderHome = () => (
    <div className="space-y-12 animate-fade-in">
      {/* Premium Hero Banner */}
      <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-brand-dark/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000 scale-105 group-hover:scale-100" 
          alt="Luxury Real Estate"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 text-white">
          <div className="flex items-center gap-3 mb-6">
             <span className="bg-brand-red text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.3em] animate-pulse">Live</span>
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Market Insight Report • 2025</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-4 uppercase tracking-tighter leading-[0.9]">The Indian <br/><span className="text-brand-accent italic font-light serif lowercase">Realty</span> Resurgence</h2>
          <p className="max-w-2xl text-sm md:text-lg text-slate-300 font-light mb-8 leading-relaxed">
            Real-time grounded intelligence on India's most dynamic property corridors. Tracking over ₹50,000 Cr in active infrastructure developments.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigateTo('trends')} className="bg-brand-red px-8 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-red transition-all">View Trends</button>
            <button className="border border-white/30 px-8 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Investor Portal</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <main className="lg:col-span-9 space-y-12">
          {/* Market Status Filter */}
          <div className="sticky top-[48px] z-30 bg-[#F8F8F8]/90 backdrop-blur-sm py-4 border-b border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                      activeCategory === cat ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Filter News..."
                  className="w-full text-[11px] border border-slate-200 py-2.5 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-brand-dark"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadLiveUpdates(searchQuery)}
                />
                <svg className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-[400px] animate-pulse-slow border border-slate-100 p-6 space-y-4">
                  <div className="bg-slate-100 h-48 w-full"></div>
                  <div className="bg-slate-100 h-6 w-3/4"></div>
                  <div className="bg-slate-100 h-20 w-full"></div>
                </div>
              ))
            ) : (
              <>
                {liveNews.map((news, idx) => <NewsCard key={`live-${idx}`} news={news} />)}
                {MOCK_NEWS.filter(n => activeCategory === 'All' || n.category === activeCategory).map(news => <NewsCard key={news.id} news={news} />)}
              </>
            )}
          </div>
        </main>

        <aside className="lg:col-span-3 space-y-10">
          {renderSidebarAds()}
        </aside>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-16 py-12">
      <div className="text-center border-b border-brand-dark pb-16">
        <span className="text-brand-red text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">Archive & Essays</span>
        <h2 className="text-6xl font-black uppercase tracking-tighter text-brand-dark mb-4">Market <span className="italic serif font-light text-slate-400">Journal</span></h2>
        <p className="text-slate-500 font-light text-lg">Detailed analysis of the socio-economic factors driving Indian real estate.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {[...liveNews, ...MOCK_NEWS].slice(0, 4).map((news, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[16/10] overflow-hidden mb-8 bg-slate-100">
               <img src={news.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-brand-red text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">{news.category}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{news.date}</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight text-brand-dark mb-4 group-hover:text-brand-red transition-colors leading-none">{news.title}</h3>
            <p className="text-slate-600 font-light leading-relaxed mb-8">{news.excerpt}</p>
            <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-brand-dark pb-1 group-hover:text-brand-red group-hover:border-brand-red transition-all">Read Full Essay</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="animate-fade-in space-y-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Yield Growth', val: '+4.8%', icon: '📈' },
          { label: 'Mortgage Rate', val: '8.4%', icon: '🏦' },
          { label: 'NRIs Investment', val: '+18%', icon: '🌎' },
          { label: 'Smart City Index', val: '82/100', icon: '🏙️' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 border border-slate-200 text-center hover:shadow-xl transition-shadow group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="text-4xl font-black text-brand-dark">{stat.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-brand-dark p-16 text-white text-center">
        <h2 className="text-4xl font-serif italic mb-6">Real-Time Data Matrix</h2>
        <p className="max-w-xl mx-auto text-sm text-slate-400 font-light mb-12 uppercase tracking-widest">Tracking the velocity of demand across 8 major metropolitan clusters.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
           {[
             { name: 'Luxury Villas', demand: 92 },
             { name: 'Managed Workspaces', demand: 78 },
             { name: 'Retail Corridors', demand: 65 },
             { name: 'Eco-Housing', demand: 88 }
           ].map(item => (
             <div key={item.name} className="space-y-4">
               <div className="flex justify-between items-end">
                 <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                 <span className="text-brand-accent font-bold text-xs">{item.demand}% Velocity</span>
               </div>
               <div className="h-0.5 w-full bg-white/10">
                 <div className="h-full bg-brand-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${item.demand}%` }}></div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderCityGuides = () => (
    <div className="animate-fade-in space-y-12 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-brand-dark">Investment Maps</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">6 Cities Active</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { city: 'GIFT City', focus: 'Fintech Hub', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop' },
          { city: 'Navi Mumbai', focus: 'New Airport Cluster', img: 'https://images.unsplash.com/photo-1570160897040-30430ed22114?q=80&w=800&auto=format&fit=crop' },
          { city: 'Whitefield', focus: 'Tech-Hub Expansion', img: 'https://images.unsplash.com/photo-1596422846543-b5c65171e939?q=80&w=800&auto=format&fit=crop' }
        ].map((guide, i) => (
          <div key={i} className="group relative h-[500px] overflow-hidden shadow-xl border border-slate-100">
             <img src={guide.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
             <div className="absolute bottom-10 left-10 right-10 text-white">
                <span className="text-brand-accent text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">{guide.focus}</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none">{guide.city}</h3>
                <button className="w-full py-4 bg-white text-brand-dark text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all">Deep Dive Guide</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-20 py-20">
      <div className="bg-white border border-slate-100 p-20 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-4 h-full bg-brand-red"></div>
        <div className="w-48 h-48 bg-slate-50 rounded-full mx-auto mb-10 overflow-hidden border-4 border-slate-100 p-2 shadow-inner">
           <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-full" 
              alt="Pratik Raval" 
           />
        </div>
        <h2 className="text-6xl font-black uppercase tracking-tighter text-brand-dark mb-4">Pratik Raval</h2>
        <div className="text-brand-red text-[12px] font-black uppercase tracking-[0.5em] mb-12">Lead Software Engineer</div>
        
        <div className="prose prose-slate max-w-2xl mx-auto text-slate-500 text-base leading-relaxed font-light mb-12 space-y-6">
          <p>
            India Realty Trend is the culmination of high-end software engineering and deep domain expertise in Indian real estate markets. 
            Developed by <strong>Pratik Raval</strong>, this platform bridges the gap between raw data and actionable investment intelligence.
          </p>
          <p>
            Leveraging <strong>Google's Gemini 3 Flash-Preview</strong>, the system autonomously researches, validates, and visualizes market movements across the subcontinent with sub-second latency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a 
            href="https://ravalpratik.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-brand-dark text-white px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-brand-red transition-all shadow-xl hover:scale-105"
          >
            Developer Portfolio
          </a>
          <a 
            href="mailto:ravalpratik1@gmail.com" 
            className="border-2 border-brand-dark text-brand-dark px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-brand-dark hover:text-white transition-all"
          >
            Collaborate
          </a>
        </div>
      </div>
    </div>
  );

  const renderSidebarAds = () => (
    <>
      <div className="bg-white p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
        <span className="text-[9px] text-slate-400 uppercase tracking-widest mb-6 block font-black">Advertisement</span>
        <div className="bg-brand-dark aspect-square relative overflow-hidden">
           <img src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-1000" alt="Ad"/>
           <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">Prime Offices <br/>in BKC</h4>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-accent mb-6">Starting ₹42,000 /mo</p>
              <button className="w-full py-3 bg-white text-brand-dark text-[9px] font-black uppercase tracking-widest hover:bg-brand-accent transition-colors">Enquire Now</button>
           </div>
        </div>
      </div>
      <div className="bg-brand-red p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">IRT Insider</h3>
        <p className="text-xs font-light leading-relaxed mb-8 relative z-10 opacity-80 italic">Be the first to receive RERA alerts and bulk-deal news.</p>
        <div className="space-y-4 relative z-10">
          <input type="email" placeholder="professional@email.com" className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white/20 transition-all" />
          <button className="w-full bg-brand-dark text-white font-black py-4 rounded-sm hover:bg-white hover:text-brand-red transition-all text-[10px] uppercase tracking-widest">Activate Access</button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'home' && renderHome()}
        {currentView === 'blog' && renderBlog()}
        {currentView === 'trends' && renderTrends()}
        {currentView === 'city-guides' && renderCityGuides()}
        {currentView === 'about' && renderAbout()}
      </div>

      <footer className="bg-brand-dark text-white pt-24 pb-12 mt-32">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="md:col-span-2 space-y-8">
              <h4 className="text-3xl font-serif italic border-l-4 border-brand-red pl-8">India Realty Trend</h4>
              <p className="text-slate-500 text-sm leading-loose max-w-sm font-light">
                Redefining the standard for property intelligence in the Indian market. Architected by <strong>Pratik Raval</strong> using next-gen generative AI pipelines.
              </p>
              <div className="flex gap-4">
                <a href="https://ravalpratik.vercel.app/" target="_blank" className="p-3 bg-white/5 rounded-full hover:bg-brand-red transition-all group">
                   <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 text-brand-red">Network</h5>
              <ul className="space-y-6 text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                <li onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer transition-colors">Global Home</li>
                <li onClick={() => navigateTo('blog')} className="hover:text-white cursor-pointer transition-colors">Research Journal</li>
                <li onClick={() => navigateTo('trends')} className="hover:text-white cursor-pointer transition-colors">Trend Matrix</li>
                <li onClick={() => navigateTo('about')} className="hover:text-white cursor-pointer transition-colors">Developer Portal</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 text-slate-700">Governance</h5>
              <ul className="space-y-6 text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">Data Privacy</li>
                <li className="hover:text-white cursor-pointer transition-colors">API Compliance</li>
                <li className="hover:text-white cursor-pointer transition-colors">IRT Foundation</li>
                <li className="hover:text-white cursor-pointer transition-colors">Investor Relations</li>
              </ul>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               © 2025 India Realty Trend. Engineered by <a href="https://ravalpratik.vercel.app/" target="_blank" className="text-brand-red hover:text-white transition-colors">Pratik Raval</a>.
             </p>
             <div className="flex gap-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
               <span>BOM</span>
               <span>DEL</span>
               <span>BLR</span>
               <span>HYD</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
