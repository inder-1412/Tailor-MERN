import { useState } from "react";
import ComboBox from "./components/ComboBox";
import axios from "axios";

export default function FindTailor() {
    const [city, setCity] = useState("");
    const [category, setCategory] = useState("");
    const [dressTypes, setDressTypes] = useState<string[]>([]);
    const [selectedDress, setSelectedDress] = useState("");

    const [tailorss, setTailors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [hasSearched, setHasSearched] = useState(false);

    // 1. Function to fetch tailors based on current filters
    const handleFetchTailors = async () => {
        setLoading(true);
        setHasSearched(true);
        // Using the same API calling logic pattern you used for dressTypes
        let url = "https://tailor-mern-bcknd.vercel.app/user/searchTailors";
        const payload = {
            city,
            category,
            dressType: selectedDress,
        };

        let resp = await axios.post(url, payload);

        if (resp.data.status) {
            setTailors(resp.data.data);
        }
        setLoading(false);
    };

    const handleCategoryChange = async (cat: string) => {
        setCategory(cat);
        setSelectedDress("");

        let url = "https://tailor-mern-bcknd.vercel.app/user/dressTypes";
        const payload = { category: cat };

        let resp = await axios.post(url, payload);

        if (resp.data.status) {
            const rawString = resp.data.data.join(",");
            const cleanArray = rawString
                .split(",")
                .map((s: string) => s.trim());
            setDressTypes(cleanArray);
        }
    };

    // const tailors = [1, 2, 3, 4, 5, 6];

    return (
        // Changed bg-gray-100 to bg-slate-50 for a cleaner look
        <div className=" p-4 md:p-10 font-sans ">
            <div className=" mx-auto flex flex-col lg:flex-row gap-10">
                {/* LEFT FILTER PANEL */}
                <aside className="w-full lg:w-80 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 h-fit lg:sticky lg:top-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Refine Search
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Find artisans near you
                        </p>
                    </div>

                    {/* City Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">
                            Location
                        </label>
                        <div className="w-full">
                            <ComboBox city={city} setCity={setCity} />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-4">
                            Target Audience
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {["men", "women", "children"].map((cat) => (
                                <label
                                    key={cat}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                        category === cat
                                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                                            : "border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="cat"
                                        value={cat}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleCategoryChange(e.target.value)
                                        }
                                    />
                                    <span className="text-sm font-bold capitalize">
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dress Type Selection */}
                    <div className="mb-10">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">
                            Specialization
                        </label>
                        <select
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                            onChange={(e) => setSelectedDress(e.target.value)}
                            value={selectedDress}
                        >
                            <option value="">All Dress Types</option>
                            {dressTypes.map((d, i) => (
                                <option key={i} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleFetchTailors}
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
                    >
                        {loading ? "Finding Artisans..." : "Apply Filters"}
                    </button>
                </aside>

                {/* RIGHT RESULTS SECTION */}
                <main className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-3xl p-6 space-y-4 animate-pulse"
                                >
                                    <div className="h-56 bg-slate-100 rounded-2xl w-full"></div>
                                    <div className="h-5 bg-slate-100 rounded-full w-2/3"></div>
                                    <div className="h-4 bg-slate-50 rounded-full w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : !hasSearched ? (
                        <div className="flex flex-col items-center justify-center min-h-[600px] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-12 h-12"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800">
                                Find Your Master Tailor
                            </h3>
                            <p className="text-slate-400 mt-3 max-w-sm text-lg">
                                Set your location and style preference to see
                                our curated list of experts.
                            </p>
                        </div>
                    ) : tailorss.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                            {tailorss.map((t, i) => (
                                <div
                                    key={t._id || i}
                                    className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="h-60 bg-slate-200 relative overflow-hidden">
                                        <img
                                            src={
                                                t.profilepic
                                                    ? `https://tailor-mern-bcknd.vercel.app/uploads/${t.profilepic}`
                                                    : "/placeholder-tailor.jpg"
                                            }
                                            alt={t.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
                                                {t.shopCity}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl">
                                            <span className="text-xs">⭐</span>
                                            <span className="text-xs font-black">
                                                {t.rating || "4.8"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-black text-xl text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                            {t.name}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-4">
                                            Professional Tailoring Services
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {t.speciality
                                                ?.split(",")
                                                .map(
                                                    (
                                                        item: string,
                                                        idx: number,
                                                    ) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100"
                                                        >
                                                            {item.trim()}
                                                        </span>
                                                    ),
                                                )}
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                                                    Experience
                                                </span>
                                                <span className="text-xl font-black text-slate-900">
                                                    {t.workingSince
                                                        ? new Date().getFullYear() -
                                                          t.workingSince
                                                        : "5+"}{" "}
                                                    <span className="text-sm font-medium text-slate-500">
                                                        Yrs
                                                    </span>
                                                </span>
                                            </div>
                                            <button className="bg-slate-900 text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2.5"
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-50 rounded-[2.5rem] border border-slate-200 p-12 text-center">
                            <span className="text-6xl mb-6">🔍</span>
                            <h3 className="text-2xl font-black text-slate-800">
                                No results match your criteria
                            </h3>
                            <p className="text-slate-400 mt-2 text-lg">
                                Try widening your search or adjusting the dress
                                type.
                            </p>
                            <button
                                onClick={() => {
                                    setCity("");
                                    setCategory("");
                                    setTailors([]);
                                    setHasSearched(false);
                                }}
                                className="mt-8 px-8 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
