import React, { useState, useEffect } from 'react';
import { FileSearch, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = ({ onSignIn, onGetStarted }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = ['Features', 'How it Works', 'Testimonials'];

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-colors duration-200 ${scrolled ? 'bg-bg/95' : 'bg-bg/80'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent shadow-[0_0_14px_var(--color-accent-glow)]">
              <FileSearch size={15} color="#0a0a0b" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight">Smart Search</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
             <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors" >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button className="text-text-secondary cursor-pointer" variant="secondary" size="md" onClick={onSignIn}>Sign in</Button>
            <Button className="cursor-pointer" variant="primary" size="md" onClick={onGetStarted}>Get started</Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute top-14 left-0 right-0 bg-bg border-b border-border px-4 py-4 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((item) => (
              <a key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMenuOpen(false)}
                className="text-base text-text-secondary hover:text-text-primary transition-colors px-2 py-2.5 rounded-md hover:bg-white/5"
              >
                {item}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-border">
              <Button className="cursor-pointer w-full" variant="primary" size="md" onClick={() => { setMenuOpen(false); onGetStarted?.(); }}>Get started</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;