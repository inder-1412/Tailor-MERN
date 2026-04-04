import React, { useState } from "react";
import {
    UserCircle,
    Search,
    Star,
    LogOut,
    ChevronRight,
    Settings,
} from "lucide-react";
import ProfileForm from "./ProfileForm";
import FindTailor from "./FindTailor";
import RateAndReview from "./Review/RateAndReview";
import LogoutModal from "./components/LogoutModal";

const CustomerHome = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutConfirm = () => {
        console.log("User logged out");
        // Add your actual logout logic here (e.g., localStorage.clear())
        setIsLogoutModalOpen(false);
          localStorage.clear();
          window.location.href = "/login"; // Redirect to login page after logout
    };

    const menuItems = [
        {
            id: "profile",
            label: "Profile Form",
            icon: <UserCircle size={22} />,
        },
        { id: "find", label: "Find Tailor", icon: <Search size={22} /> },
        { id: "rate", label: "Rate Tailor", icon: <Star size={22} /> },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* --- PREMIUM NAVBAR --- */}
            <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {/* The Icon Container */}
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center">
                        {/* Replace with your new SVG or Image */}
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    {/* The Text - Using your current brand font weight */}
                    <span className="text-2xl font-black tracking-tight text-slate-800">
                        Tailor<span className="text-blue-600">Flow</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Text Info */}
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800 leading-tight">
                            Customer Portal
                        </span>
                        <span className="text-xs text-slate-500">
                            Welcome back!
                        </span>
                    </div>

                    {/* User Avatar Circle */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm ring-1 ring-slate-200">
                        <span className="text-sm font-bold text-indigo-700 uppercase">
                            {/* Extract first letter of name */}I
                        </span>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7c1c1c] text-white hover:bg-red-800 transition-all px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-md ml-2"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 p-4 lg:p-6 gap-6">
                {/* --- SLEEK SIDEBAR --- */}
                <aside className="w-72 hidden lg:flex flex-col gap-2">
                    <div className="bg-[#0F172A] rounded-3xl p-4 shadow-sm border border-slate-100 h-full">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                            Main Menu
                        </p>
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-200 group ${
                                        activeTab === item.id
                                            ? "bg-blue-50 text-blue-600 shadow-sm"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`${activeTab === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className="font-bold">
                                            {item.label}
                                        </span>
                                    </div>
                                    {activeTab === item.id && (
                                        <ChevronRight size={18} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT CARD --- */}
                <main className="flex-1">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
                        {/* Content Header */}
                        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30">
                            <h2 className="text-3xl font-extrabold text-slate-800">
                                {
                                    menuItems.find((i) => i.id === activeTab)
                                        ?.label
                                }
                            </h2>
                            <p className="text-slate-500 mt-1">
                                Manage your account and preferences
                            </p>
                        </div>

                        {/* Dynamic Form Area */}
                        <div className="flex-1 p-1 overflow-y-auto">
                            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {activeTab === "profile" && (
                                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                                        <ProfileForm />
                                    </div>
                                )}

                                {activeTab === "find" && (
                                    <div className="bg-white rounded-2xl p-8 border pt-[-60px] border-slate-100 shadow-sm">
                                        <FindTailor />
                                    </div>
                                )}

                                {activeTab === "rate" && (
                                    <div className=" bg-slate-50 rounded-3xl  border border-slate-200/50 pt-[-60px] shadow-sm">
                                        <RateAndReview />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogoutConfirm} 
            />
        </div>
    );
};

export default CustomerHome;
