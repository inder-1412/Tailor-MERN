import { useState, useEffect } from "react";
import { personalSchema } from "../../../validation/Tailor/TailorPersonalDSchema";
import axios from "axios";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Fingerprint,
    Upload,
    Eye,
} from "lucide-react";

interface PersonalFormState {
    email: string;
    name: string;
    contact: string;
    dob: string;
    gender: string;
    aadharNumber: string;
}

const INITIAL_STATE: PersonalFormState = {
    email: "",
    name: "",
    contact: "",
    dob: "",
    gender: "",
    aadharNumber: "",
};

function PersonalDetails() {
    const [form, setForm] = useState<PersonalFormState>(INITIAL_STATE);
    const [errors, setErrors] = useState<Partial<PersonalFormState>>({});
    const [ocrLoading, setOcrLoading] = useState(false);

    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const emailFromStorage = localStorage.getItem("emailId");

        if (emailFromStorage) {
            setForm((prev) => ({
                ...prev,
                email: emailFromStorage,
            }));
        }

        axios
            .post("http://localhost:5002/tailor/fetchPersonalInfo", {
                email: emailFromStorage,
            })
            .then((res) => {
                if (res.data.status && res.data.doc) {
                    const user = res.data.doc;

                    let formattedDob = "";
                    if (user.dob) {
                        formattedDob = user.dob.split("T")[0];
                    }

                    setForm({
                        email: user.email || "",
                        name: user.name || "",
                        contact: user.contact || "",
                        dob: formattedDob,
                        gender: user.gender || "",
                        aadharNumber: user.aadharNumber || "",
                    });

                    if (user.profilepic) {
                        setProfileImageUrl(
                            `http://localhost:5002/uploads/${user.profilepic}`,
                        );
                    }
                }
            })
            .catch(() => {
                console.log("No existing personal info");
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

        const { error } = personalSchema.validate(form, {
            abortEarly: false,
        });

        if (error) {
            const validationErrors: Partial<PersonalFormState> = {};

            error.details.forEach((item) => {
                const key = item.path[0] as keyof PersonalFormState;
                validationErrors[key] = item.message;
            });

            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const formData = new FormData();

            formData.append("email", form.email);
            formData.append("name", form.name);
            formData.append("contact", form.contact);
            formData.append("dob", form.dob);
            formData.append("gender", form.gender);
            formData.append("aadharNumber", form.aadharNumber);

            if (profileImage) {
                formData.append("profilepic", profileImage);
            }

            const userId = localStorage.getItem("userId");
            if (userId) {
                formData.append("userId", userId);
            }

            const resp = await axios.post(
                "http://localhost:5002/tailor/personalInfo",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            alert(resp.data.msg);
            console.log("Saved Data:", resp.data);
        } catch (err: any) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    const handleAadharUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAadharFile(file);
        setOcrLoading(true);

        setForm((prev) => ({
            ...prev,
            aadharNumber: "",
            dob: "",
            gender: "",
        }));

        const formData = new FormData();
        formData.append("aadharFile", file);

        try {
            const res = await axios.post(
                "http://localhost:5002/tailor/extract-aadhar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            let formattedDob = "";

            if (res.data.dob) {
                const parts = res.data.dob.split(/[\/-]/);
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    formattedDob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
            }

            // Auto-fill extracted fields
            setForm((prev) => ({
                ...prev,
                aadharNumber: res.data.aadharNumber || "",
                dob: formattedDob,
                gender: res.data.gender || "",
            }));

            setOcrLoading(false);

            e.target.value = "";
        } catch (error) {
            console.error(error);
            e.target.value = "";

            alert("OCR extraction failed");
            setOcrLoading(false);
        }
    };
    return (
        <>
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Main Container Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">
                            Account Profile
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage your personal information and verification
                            documents.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                                    {profileImage || profileImageUrl ? (
                                        <img
                                            src={
                                                profileImage
                                                    ? URL.createObjectURL(
                                                          profileImage,
                                                      )
                                                    : profileImageUrl!
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User
                                            size={48}
                                            className="text-slate-300"
                                        />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all group-hover:scale-110">
                                    <Upload size={18} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            setProfileImage(
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <span className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Profile Photo
                            </span>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Email (Disabled) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        disabled
                                        value={form.email}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Contact Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="number"
                                        name="contact"
                                        value={form.contact}
                                        onChange={handleChange}
                                        placeholder="Mobile number"
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Aadhaar Upload - Integrated into Grid */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Aadhaar Card (Verification)
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="file"
                                            onChange={handleAadharUpload}
                                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl py-1.5 px-2"
                                        />
                                    </div>
                                    {aadharFile && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    URL.createObjectURL(
                                                        aadharFile,
                                                    ),
                                                )
                                            }
                                            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Aadhaar Number (Conditionally Shown with Animation) */}
                            {form.aadharNumber && (
                                <div className="space-y-1.5 md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <label className="text-sm font-semibold text-blue-800 ml-1">
                                        Extracted Aadhaar Number
                                    </label>
                                    <div className="relative">
                                        <Fingerprint
                                            className="absolute left-3 top-3 text-blue-400"
                                            size={18}
                                        />
                                        <input
                                            name="aadharNumber"
                                            value={form.aadharNumber}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono tracking-widest"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* DOB */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <Calendar
                                        className="absolute left-3 top-3 text-slate-400"
                                        size={18}
                                    />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={form.dob}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none bg-white"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* OCR Loading Indicator */}
                        {ocrLoading && (
                            <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-600 text-sm font-medium animate-pulse">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Processing Aadhaar via OCR...
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-10 pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PersonalDetails;
