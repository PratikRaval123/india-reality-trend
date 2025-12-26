
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems: { label: string; value: View }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Blog', value: 'blog' },
    { label: 'Trends', value: 'trends' },
    { label: 'City Guides', value: 'city-guides' },
    { label: 'About', value: 'about' },
  ];

  return (
    <header className="bg-white">
      {/* Logo Area */}
      <div className="flex justify-center py-6 border-b border-slate-100 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="bg-slate-200 px-8 py-3 rounded-sm text-center">
          <h1 className="text-3xl font-serif text-slate-800 tracking-tight font-bold">
            India <span className="text-slate-600 font-light italic">Realty</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 -mt-1 font-medium">Trends</p>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav className="bg-[#1a1a1a] text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-center items-center h-12 space-x-8 md:space-x-12 text-[10px] md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
            {navItems.map((item) => (
              <li key={item.value}>
                <button 
                  onClick={() => onNavigate(item.value)}
                  className={`hover:text-indigo-400 transition-all pb-1 ${
                    currentView === item.value 
                    ? 'text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
