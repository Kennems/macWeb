import React, { useState } from 'react';
import { WALLPAPER_URL } from '../../constants';
import { ArrowRight, User, Wifi } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-[90] bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Backdrop Blur */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 flex justify-end px-4 items-center text-white/80 z-10">
        <Wifi size={18} />
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-full bg-gray-200/20 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-2xl">
          <User size={48} className="text-white/90" />
        </div>
        
        <h2 className="text-white text-xl font-semibold mb-6 drop-shadow-md">Guest User</h2>

        <form onSubmit={handleLogin} className="relative w-48">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-1.5 pl-4 pr-10 text-white placeholder-white/50 text-sm outline-none focus:bg-white/30 transition-all shadow-lg"
            autoFocus
          />
          <button 
            type="submit"
            className={`absolute right-1 top-1 p-0.5 rounded-full bg-white/20 hover:bg-white/40 transition-all text-white ${!password ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin m-0.5" />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </form>
        
        <div className="mt-12 text-white/60 text-xs flex flex-col items-center gap-2">
          <span className="cursor-pointer hover:text-white">Sleep</span>
          <span className="cursor-pointer hover:text-white">Restart</span>
          <span className="cursor-pointer hover:text-white">Shut Down</span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;