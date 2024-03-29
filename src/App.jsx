import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Category from "./pages/Category";
import Navbar from "./components/Navbar";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/PrivateRoute";
import EditListing from "./pages/EditListing";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route
                        path="/category/:categoryName"
                        element={<Category />}
                    />

                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route
                        path="/edit-listing/:listingId"
                        element={<EditListing />}
                    />
                    <Route
                        path="/category/:categoryName/:listingId"
                        element={<Listing />}
                    />
                    <Route path="/contact/:landlordId" element={<Contact />} />
                </Routes>
                <Navbar />
            </Router>
            <ToastContainer autoClose={3000} />
        </>
    );
}

export default App;
