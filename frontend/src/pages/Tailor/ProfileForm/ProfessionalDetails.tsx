import React, { useEffect, useState } from "react";
import { professionalSchema } from "../../../validation/Tailor/TailorProfessionalSchema";
import axios from "axios";
import {
    Scissors,
    Award,
    Globe,
    Calendar,
    MapPin,
    Building,
    Info,
    ChevronDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProfessionalFormState {
    category: string;
    speciality: string;
    socialLink: string;
    workingSince: string;
    workType: string;
    shopAddress: string;
    shopCity: string;
    otherInfo: string;
}

const INITIAL_STATE: ProfessionalFormState = {
    category: "",
    speciality: "",
    socialLink: "",
    workingSince: "",
    workType: "",
    shopAddress: "",
    shopCity: "",
    otherInfo: "",
};

function ProfessionalDetails() {
    const [form, setForm] = useState<ProfessionalFormState>(INITIAL_STATE);
    const [errors, setErrors] = useState<Partial<ProfessionalFormState>>({});

    useEffect(() => {
        const email = localStorage.getItem("emailId");

        if (!email) {
            return;
        }

        axios
            .post("https://tailor-mern-bcknd.vercel.app/tailor/fetchProfessionalInfo", {
                email: email,
            })
            .then((res) => {
                if (res.data.status && res.data.doc) {
                    const user = res.data.doc;

                    setForm({
                        category: user.category || "",
                        speciality: user.speciality || "",
                        socialLink: user.socialLink || "",
                        workingSince: user.workingSince || "",
                        workType: user.workType || "",
                        shopAddress: user.shopAddress || "",
                        shopCity: user.shopCity || "",
                        otherInfo: user.otherInfo || "",
                    });

                }
            })
            .catch(() => {
                console.log("No professional info found");
                toast.error("No professional info found");
            });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);

        const { error } = professionalSchema.validate(form, {
            abortEarly: false,
        });
        

        if (error) {
            const validationErrors: Partial<ProfessionalFormState> = {};
            error.details.forEach((item) => {
                const key = item.path[0] as keyof ProfessionalFormState;
                validationErrors[key] = item.message;
            });
            setErrors(validationErrors);
            return;
        }

        setErrors({});


        let url = "https://tailor-mern-bcknd.vercel.app/tailor/professionalInfo";

        let email = localStorage.getItem("emailId");

        const payload = {
            category: form.category,
            speciality: form.speciality,
            socialLink: form.socialLink,
            workingSince: form.workingSince,
            workType: form.workType,
            shopAddress: form.shopAddress,
            shopCity: form.shopCity,
            otherInfo: form.otherInfo,
            email: email,
        };

        let resp = await axios.post(url, payload, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (resp.data.msg == "Professional Record saved.")
            toast.success("Professional Record saved successfully");
        else toast.error("Failed to save professional record");
    };
    return (
        <>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-2xl shadow-sm  overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Professional Profile
                            </h2>
                            <p className="text-sm text-slate-500">
                                Showcase your expertise and business location to
                                customers.
                            </p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <Scissors size={24} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Category Selection */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Service Category
                                </label>
                                <div className="relative">
                                    <Scissors
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="men">
                                            Men's Tailoring
                                        </option>
                                        <option value="women">
                                            Women's Tailoring
                                        </option>
                                        <option value="children">
                                            Children's Wear
                                        </option>
                                        
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                                        size={18}
                                    />
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Speciality */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Speciality
                                </label>
                                <div className="relative">
                                    <Award
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        name="speciality"
                                        value={form.speciality}
                                        onChange={handleChange}
                                        placeholder="e.g. Bridal Wear, Suits"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                                {errors.speciality && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.speciality}
                                    </p>
                                )}
                            </div>

                            {/* Social Link */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Portfolio / Social Media Link
                                </label>
                                <div className="relative">
                                    <Globe
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        name="socialLink"
                                        value={form.socialLink}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/yourshop"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Working Since */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Experience (Working Since)
                                </label>
                                <div className="relative">
                                    <Calendar
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="number"
                                        name="workingSince"
                                        value={form.workingSince}
                                        onChange={handleChange}
                                        placeholder="YYYY"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Work Type */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Work Setup
                                </label>
                                <div className="relative">
                                    <Building
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <select
                                        name="workType"
                                        value={form.workType}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="home">
                                            Home-based Boutique
                                        </option>
                                        <option value="shop">
                                            Commercial Shop
                                        </option>
                                        <option value="both">
                                            Both (Workshop & Store)
                                        </option>
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-3 text-slate-400 pointer-events-none"
                                        size={18}
                                    />
                                </div>
                            </div>

                            {/* Shop Address */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Full Shop Address
                                </label>
                                <div className="relative">
                                    <MapPin
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        name="shopAddress"
                                        value={form.shopAddress}
                                        onChange={handleChange}
                                        placeholder="Building, Street Name..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Shop City */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    City
                                </label>
                                <div className="relative">
                                    <Building
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        name="shopCity"
                                        value={form.shopCity}
                                        onChange={handleChange}
                                        placeholder="City Name"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Other Info */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Business Description / Other Info
                                </label>
                                <div className="relative">
                                    <Info
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <textarea
                                        name="otherInfo"
                                        value={form.otherInfo}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Describe your shop timings, delivery policies, or any other details..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-10 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Save Professional Record
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            </div>
            
        </>
    );
}

export default ProfessionalDetails;
