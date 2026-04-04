import Tabs from "./components/Tabs";
import Login from "./pages/Login";
import ProfileForm from "./pages/Customer/ProfileForm";
import Register from "./pages/Register";
import RateAndReview from "./pages/Customer/Review/RateAndReview";
import FindTailor from "./pages/Customer/FindTailor";
import { Route, Routes } from "react-router-dom";
import CustomerHome from "./pages/Customer/CustomerHome";
import TailorDashboard from "./pages/Tailor/TailorDashboard";
// import Signup from "./pages/Signup"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/findTailor" element={<FindTailor />} />
                <Route path="/rate&review" element={<RateAndReview />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/customer" element={<CustomerHome />} />
                <Route path="/tailor" element={<TailorDashboard />} />
            </Routes>
        </>
    );
}

export default App;
