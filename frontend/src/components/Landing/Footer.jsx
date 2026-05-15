import React from 'react';
import { FileSearch } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-accent">
             <FileSearch size={15} color="#0a0a0b" strokeWidth={2.5} />
          </div>
            <span className="text-base font-bold tracking-tight">Smart Search</span>
        </div>
        <p className="text-sm text-text-tertiary">© {new Date().getFullYear()} Smart Search. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;