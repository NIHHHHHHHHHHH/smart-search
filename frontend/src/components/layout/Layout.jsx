import React, { useState } from 'react';
import { Search, Upload, FileSearch, Menu, X } from 'lucide-react';
import UserMenu from '../layout/UserMenu';
import { Button } from '../ui';

const Layout = ({ children, view, onViewChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'search', label: 'Search', Icon: Search },
    { id: 'upload', label: 'Upload', Icon: Upload },
  ];

  const handleNavChange = (id) => {
    onViewChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">

      <div className="fixed -top-40 -left-20 w-[600px] h-[600px] rounded-full pointer-events-none z-0 bg-accent-subtle blur-[120px]" />
      <div className="fixed -bottom-20 -right-10 w-96 h-96 rounded-full pointer-events-none z-0 bg-purple-bg blur-[100px]" />

      <header className="border-b border-border sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,10,11,0.80)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-accent shadow-[0_0_20px_var(--color-accent-glow)]">
              <FileSearch size={15} color="#0a0a0b" strokeWidth={2.5} />
            </div>
            <h1 className="text-sm sm:text-base font-bold text-text-primary whitespace-nowrap">Smart Search </h1>
          </div>

          <nav className="hidden sm:flex gap-3 rounded-xl p-1">
            {navItems.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <Button  key={id}  variant={active ? 'primary' : 'secondary'}  size="md"  onClick={() => onViewChange(id)}  className="cursor-pointer">
                  <Icon size={14} className="text-inherit" />
                  <span className="text-base">{label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <UserMenu />

            <button
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-bg-raised text-text-secondary transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-bg-elevated px-4 py-3 flex flex-col gap-2 animate:[ssfadeUp_0.15s_cubic-bezier(0.16,1,0.3,1)_both]">
            {navItems.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <Button  key={id}  variant={active ? 'primary' : 'secondary'}  size="md"  fullWidth  onClick={() => handleNavChange(id)}  className="cursor-pointer justify-start">
                  <Icon size={15} className="text-inherit" />
                  <span className="text-sm">{label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex-1 w-full">
        {children}
      </main>

      <footer className="relative z-10 mt-auto py-5 sm:py-6 text-center border-t border-border px-4">
        <p className="text-sm text-text-secondary">© {new Date().getFullYear()} Smart Search. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;