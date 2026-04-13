import { useState } from "react";
import axios from "axios";
import React from "react";
import {
    Star,
    Send,
    CheckCircle2,
    XCircle,
    Phone,
    MessageSquare,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ReviewForm {
    mobile: string;
    star: number;
    review: string;
}

function RateAndReview() {
    const [form, setForm] = useState<ReviewForm>({
        mobile: "",
        star: 0,
        review: "",
    });

    const [tailorName, setTailorName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMobileBlur = async () => {
        if (!form.mobile) return;
        try {
            const res = await axios.post(
                "https://tailor-mern-backend.vercel.app/user/getByMobile",
                {
                    mobile: form.mobile,
                },
            );
            if (res.data.status) {
                setTailorName(res.data.name);
            } else {
                setTailorName("Tailor not found");
            }
        } catch (err) {
            setTailorName("Tailor not found");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.mobile || !form.star || !form.review) {
            toast.error("Please complete all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "https://tailor-mern-backend.vercel.app/user/addReview",
                form,
            );
            if (res.data.status) {
                toast.success("Review submitted successfully 🎉");
                setForm({ mobile: "", star: 0, review: "" });
                setTailorName("");
            } else {
                toast.error("Failed to submit review");
            }
        } catch (err) {
            toast.error("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-8 px-4">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                        <Star size={28} fill="currentColor" className="mb-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-5">
                            Tailor Experience
                        </h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mobile Input */}
                    <div className="space-y-2 group">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Tailor's Mobile Number
                        </label>
                        <div className="relative">
                            <Phone
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                                size={18}
                            />
                            <input
                                type="text"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                onBlur={handleMobileBlur}
                                placeholder="Enter 10-digit mobile"
                                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                            />
                        </div>

                        {tailorName && (
                            <div
                                className={`flex items-center gap-2 mt-2 px-2 animate-in fade-in slide-in-from-top-1 duration-300`}
                            >
                                {tailorName === "Tailor not found" ? (
                                    <>
                                        <XCircle
                                            size={14}
                                            className="text-red-500"
                                        />
                                        <span className="text-xs font-bold text-red-500">
                                            Not Found
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={14}
                                            className="text-emerald-500"
                                        />
                                        <span className="text-xs font-bold text-emerald-500">
                                            Verified: {tailorName}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Service Rating
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 w-fit">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({ ...prev, star }))
                                    }
                                    className="transition-transform active:scale-90 hover:scale-110"
                                >
                                    <Star
                                        size={32}
                                        strokeWidth={1.5}
                                        className={`transition-colors duration-200 ${
                                            star <= form.star
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-slate-300"
                                        }`}
                                    />
                                </button>
                            ))}
                            {form.star > 0 && (
                                <span className="text-xs font-black text-slate-500 ml-2 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                    {form.star}.0
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2 group">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Detailed Experience
                        </label>
                        <div className="relative">
                            <MessageSquare
                                className="absolute left-4 top-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                                size={18}
                            />
                            <textarea
                                name="review"
                                value={form.review}
                                onChange={handleChange}
                                rows={4}
                                placeholder="What stood out about their work? (Quality, Speed, Price)"
                                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl shadow-emerald-100 ${
                            loading
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Publish Review</span>
                                <Send
                                    size={18}
                                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={true}
                theme="dark"
            />
        </div>
    );
}

export default RateAndReview;
