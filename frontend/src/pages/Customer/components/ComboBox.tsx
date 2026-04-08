import { useEffect, useState } from "react";
import axios from "axios";

// 1. Define the shape of your props
interface ComboBoxProps {
  city: string;
  setCity: (value: string) => void;
}

// 2. Apply the interface to the component
export default function ComboBox({ 
    city = "", 
    setCity 
}: ComboBoxProps) {
    
    // 3. Define the type for your state (assuming cities is an array of strings)
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        const fetchCities = async () => {
            const url = "https://tailor-mern-bcknd.vercel.app/user/cities";
            try {
                const resp = await axios.post(url, {}, {
                    headers: { "Content-Type": "application/json" },
                });

                // 4. Ensure the data matches your expected type before setting state
                if (resp.data.status && Array.isArray(resp.data.data)) {
                    setCities(resp.data.data);
                }
            } catch (err) {
                console.error("City API error:", err);
            }
        };

        fetchCities();
    }, []);

    return (
        <div className="mb-5">
            <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select City</option>
                {cities.map((c, index) => (
                    <option key={index} value={c}>
                        {c}
                    </option>
                ))}
            </select>
        </div>
    );
}