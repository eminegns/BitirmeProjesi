import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-100 text-emerald-900 py-3 border-t border-emerald-300 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
        
        <div className="flex items-center space-x-2">
          
          <span className="text-emerald-600/50 hidden md:inline">|</span>
          <span className="text-[10px] font-medium opacity-80 hidden md:inline">
            Dijital Bitki Arşivi
          </span>
        </div>
<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-mono text-stone-500">
          <p>
            © {currentYear} Tüm Hakları Saklıdır.
          </p>
      
        </div>
        
      </div>
    </footer>
  );
}