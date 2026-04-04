import { useState } from "react";
import PersonalDetails from "../pages/Tailor/ProfileForm/PersonalDetails";
import ProfessionalDetails from "../pages/Tailor/ProfileForm/ProfessionalDetails";
import { UserCircle, Briefcase } from "lucide-react"; // Modern icons

function Tabs() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-5xl mx-auto pt-10 px-6">
                {/* Simplified Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        My Account
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Manage your profile and business settings
                    </p>
                </div>

                {/* Tab Switcher - Floating Style */}
                <div className="flex justify-start mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab(1)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                            activeTab === 1
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <UserCircle size={18} />
                        Personal Details
                        {activeTab === 1 && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab(2)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                            activeTab === 2
                                ? "text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Briefcase size={18} />
                        Professional Details
                        {activeTab === 2 && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                        )}
                    </button>
                </div>

                {/* Dynamic Content Area - No more nested gray boxes */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {activeTab === 1 ? (
                        <PersonalDetails />
                    ) : (
                        <ProfessionalDetails />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tabs;
