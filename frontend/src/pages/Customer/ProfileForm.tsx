import axios from "axios";
import { useEffect, useState } from "react";
import { profileSchema } from "../../validation/ProfileSchema";
import { Camera, ChevronRight, UserCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface ProfileFormState {
    email: string;
    name: string;
    address: string;
    city: string;
    state: string;
    gender: string;
    profilepic: File | null; // BECAUSE NULL AND ANY FILE CAN BE ASSIGNED TO THIS PROPERTY
}

const INITAL_STATE: ProfileFormState = {
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    gender: "",
    profilepic: null,
};

function ProfileForm() {
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [form, setForm] = useState<ProfileFormState>(INITAL_STATE);
    const [prev, setPrev] = useState<string | null>(null);
    // Any field name (string) can have a string error message.......
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const email = localStorage.getItem("emailId");
        if (email) {
            setForm((prev) => ({
                ...prev,
                email: email,
            }));
        }
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
        console.log("h");

        // check form follows validations rules or not...
        const { error } = profileSchema.validate(form, {
            abortEarly: false, // default behav. of joi is to stop at first error so with this it check all fields and give all err.
        });

        if (error) {
            const validationErrors: Record<string, string> = {};
            error.details.forEach(({ path, message }) => {
                validationErrors[path[0] as string] = message;
            });

            setErrors(validationErrors);
            return;
        }

        setErrors({}); // clear all error's there..

        const url = "http://localhost:5002/user/customerProfile";

        const formData = new FormData();
        formData.append("email", form.email);
        formData.append("name", form.name);
        formData.append("address", form.address);
        formData.append("city", form.city);
        formData.append("state", form.state);
        formData.append("gender", form.gender);

        if (form.profilepic) formData.append("profilepic", form.profilepic);

        const resp = await axios.post(url, formData);
        if(resp.data.status)
        {
            toast.success("Profile created successfully 🎉");
        } else {
            toast.error("Failed to create profile");
        }
    };

    const fetchCustomer = async () => {
        let url = "http://localhost:5002/user/fetchCustomerProf";

        let obj = {
            email: form.email,
        };

        let resp = await axios.post(url, obj, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const user = resp.data.doc;

        if (user.profilepic) {
            setPrev(`http://localhost:5002/uploads/${user.profilepic}`);
        }

        setForm((prev) => ({
            ...prev,
            email: user.email,
            name: user.name,
            address: user.address,
            city: user.city,
            state: user.state,
            gender: user.gender,
            profilepic: user.profilepic,
        }));
        if (resp.data.status) {
            setIsFirstVisit(false);
            toast.success("Profile data fetched successfully 👌");
        }else
        toast.error("Failed to fetch profile data");
    };

    const handleUpdate = async () => {
        let url = "http://localhost:5002/user/customerProfUpdate";

        const formData = new FormData();
        formData.append("email", form.email);
        formData.append("name", form.name);
        formData.append("address", form.address);
        formData.append("city", form.city);
        formData.append("state", form.state);
        formData.append("gender", form.gender);

        if (form.profilepic) formData.append("profilepic", form.profilepic);

        console.log(formData);

        let resp = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if(resp.data.status)
        {
            toast.success("Profile updated successfully 🎉");
        } else {
            toast.error("Failed to update profile");
        }

    };

    const updatePicAndSetPreview = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            //  ADD THE IMAGE NAME IN FORM
            setForm((obj) => ({ ...obj, ["profilepic"]: file }));

            // TO SHOW IMAGE
            const prevObj = URL.createObjectURL(file);
            setPrev(prevObj);
        } else {
            setForm((obj) => ({ ...obj, ["profilepic"]: null }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
      <p className="text-slate-500">Update your personal information and profile picture.</p>
    </div> */}

            <form onSubmit={handleSubmit} className="space-y-8 mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-5 ">
                    {/* --- LEFT COLUMN: Form Fields --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Email Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Email Address
                            </label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full bg-slate-50 border ${errors.email ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchCustomer}
                                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95"
                                >
                                    Search
                                </button>
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full bg-slate-50 border ${errors.name ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Address Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Street Address
                            </label>
                            <textarea
                                name="address"
                                placeholder="Enter your complete home address"
                                rows={3}
                                value={form.address}
                                onChange={handleChange}
                                className={`w-full bg-slate-50 border ${errors.address ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none`}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* City & State Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={form.city}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50 border ${errors.city ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-xs font-medium ml-1">
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={form.state}
                                    onChange={handleChange}
                                    className={`w-full bg-slate-50 border ${errors.state ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-xs font-medium ml-1">
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Gender Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={`w-full bg-slate-50 border ${errors.gender ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer ${form.gender ? "text-slate-800" : "text-slate-400"}`}
                            >
                                <option value="" disabled hidden>
                                    Select Gender
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Profile Picture --- */}
                    <div className="flex flex-col items-center">
                        <div className="sticky top-24 space-y-6 w-full max-w-[240px]">
                            {/* Label with better spacing */}
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] text-center block w-full">
                                Profile Photo
                            </label>

                            <div className="relative group mx-auto w-44 h-44">
                                {/* Outer Glow/Ring */}
                                <div className="absolute inset-0 rounded-full bg-blue-500/5 scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Main Container */}
                                <div className="relative w-full h-full rounded-full border-[6px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden bg-slate-50 flex items-center justify-center transition-all duration-300 group-hover:shadow-blue-200/50 group-hover:scale-[1.03]">
                                    {form.profilepic && prev ? (
                                        <>
                                            <img
                                                src={prev}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Camera
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center flex flex-col items-center">
                                            <div className="p-4 bg-slate-100 rounded-full mb-2">
                                                <UserCircle
                                                    size={40}
                                                    className="text-slate-300"
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Upload
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Trigger Button */}
                                <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white">
                                    <Camera size={18} />
                                    <input
                                        type="file"
                                        name="profilepic"
                                        onChange={updatePicAndSetPreview}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Refined Helper Text */}
                            <div className="text-center">
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Maximum file size{" "}
                                    <span className="text-slate-600">
                                        800 KB
                                    </span>
                                </p>
                                <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tighter">
                                    JPG, PNG, WEBP
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- FORM ACTIONS --- */}
                    <div className="pt-8 border-t border-slate-100 flex">
                        {isFirstVisit ? (
                            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 font-semibold text-white transition-all duration-200 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95">
                                <span>Create Profile</span>
                                <ChevronRight
                                    size={18}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />

                                {/* Subtle Top Light Reflection */}
                                <div className="absolute inset-x-0 top-0 h-px bg-white/20 rounded-t-xl" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="group flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                            >
                                Update Profile
                                <ChevronRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </form>
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
    );
}

export default ProfileForm;
