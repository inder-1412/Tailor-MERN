import axios from "axios";
import { useState } from "react";
import { userSchema } from "../validation/SignupSchema";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

interface FormData {
    email: string;
    pwd: string;
    userType: string;
}

function Register() {
    const [formDt, setFormData] = useState<FormData>({
        email: "",
        pwd: "",
        userType: "",
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formDt, [name]: value });

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = userSchema.validate(formDt, {
            abortEarly: false,
        });

        if (error) {
            const validationErrors: Partial<FormData> = {};
            error.details.forEach((item) => {
                const key = item.path[0] as keyof FormData;
                validationErrors[key] = item.message;
            });
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const url = "http://localhost:5002/user/signUp";

        const payload = {
            email: formDt.email,
            pwd: formDt.pwd,
            userType: formDt.userType,
        };

        const resp = await axios.post(url, payload, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (resp.data.msg == "Signup successful")
            toast.success("Registered successfully ✅");
        else toast.error("Failed to register user.");
    };

    return (
        <div className="min-h-screen flex w-full">
            <div className="hidden md:block md:w-2/2 h-screen">
                <img
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80"
                    alt="leftSideImage"
                />
            </div>

            <div className="w-full flex flex-col items-center justify-center">
                <form
                    className="md:w-96 w-80 flex flex-col items-center justify-center"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-4xl mb-7 text-gray-900 font-medium">
                        Sign Up
                    </h2>

                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            width="16"
                            height="11"
                            viewBox="0 0 16 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                                fill="#6B7280"
                            />
                        </svg>
                        <input
                            type="email"
                            name="email"
                            value={formDt.email}
                            onChange={handleChange}
                            placeholder="Email id"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>
                    <div className="ml-[-269px]">
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 text-left">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg
                            width="13"
                            height="17"
                            viewBox="0 0 13 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                                fill="#6B7280"
                            />
                        </svg>
                        <input
                            type="password"
                            name="pwd"
                            value={formDt.pwd}
                            onChange={handleChange}
                            placeholder="Password"
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>
                    <div className="ml-[-169px]">
                        {errors.pwd && (
                            <p className="text-red-500 text-xs mt-1 ">
                                {errors.pwd}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path
                                d="M6 9L12 15L18 9"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: "darkgrey" }}
                            />
                        </svg>

                        <select
                            name="userType"
                            value={formDt.userType}
                            onChange={handleChange}
                            className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                        >
                            <option value="">Select Type</option>
                            <option value="user">User</option>
                            <option value="tailor">Tailor</option>
                        </select>
                    </div>
                    <div className="ml-[-269px]">
                        {errors.userType && (
                            <p className="text-red-500 text-xs mt-1 ">
                                {errors.userType}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-8 w-full h-11 rounded-full text-white bg-black hover:bg-gray-900 transition-opacity po"
                    >
                        Sign up
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">
                        Already have an account?{" "}
                        <Link className="text-indigo-400 hover:underline" to="/login">
                            Login
                        </Link>
                    </p>
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
    );
}

export default Register;
