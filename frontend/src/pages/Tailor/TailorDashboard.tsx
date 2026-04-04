import { useState, useRef, useEffect } from 'react';
import { User, Scissors, LogOut, ChevronDown, Settings, AlertCircle } from 'lucide-react';
import Tabs from '../../components/Tabs';

const TailorDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for Modal
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Scissors className="text-amber-400" />
          <span className="text-xl font-serif font-bold tracking-tight">TailorFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-amber-500 text-white shadow-lg">
            <User size={20} /> Personal Details
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-40">
          <h2 className="text-lg font-semibold text-slate-800">My Account</h2>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">Welcome, Alessandro</span>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold border-2 border-white shadow-sm">
                  A
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Settings</p>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left">
                    <Settings size={16} /> Settings
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Opens Modal instead of logging out immediately */}
                  <button 
                    onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <Tabs />
          </div>
        </div>

        {/* --- LOGOUT MODAL OVERLAY --- */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Logout</h3>
                <p className="text-slate-500 mb-6">Are you sure you want to sign out of your account?</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TailorDashboard;