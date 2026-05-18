import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setIsOpen(false); };

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-2 rounded-xl border transition-all duration-150 cursor-pointer
          ${isOpen ? 'bg-bg-elevated border-accent-dim shadow-[0_0_16px_var(--color-accent-subtle)]'  : 'bg-bg-raised border-border'}`}
      >

        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 bg-accent text-bg shadow-[0_0_10px_var(--color-accent-glow)]">
          {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-lg object-cover" />: getInitials(user?.name || 'U')}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold leading-none text-text-primary mb-1">{user?.name}</p>
          <p className="text-xs leading-none text-text-secondary">{user?.email}</p>
        </div>
      
        <ChevronDown size={15} className={`hidden sm:block transition-transform duration-200 text-text-secondary ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute -right-10 sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-64 rounded-2xl border border-border py-1.5 z-50 bg-bg-elevated shadow-[0_24px_60px_rgba(0,0,0,0.6)] animate:[ssfadeUp_0.15s_cubic-bezier(0.16,1,0.3,1)_both]">

          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-accent text-bg shadow-[0_0_16px_var(--color-accent-glow)]">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" /> : getInitials(user?.name || 'U') }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-text-primary">{user?.name}</p>
                <p className="text-xs mt-0.5 truncate text-text-secondary">{user?.email}</p>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-purple-bg border-purple-border">
                <Sparkles size={10} className="text-purple" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-purple">Admin</span>
              </div>
            )}
          </div>

          <div className="p-2">
            <Button variant="danger" fullWidth onClick={handleLogout} className="cursor-pointer justify-start gap-3 px-3" >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-error-bg"> <LogOut size={12} /> </div>
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;