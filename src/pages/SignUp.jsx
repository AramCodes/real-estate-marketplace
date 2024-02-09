import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name,
            });

            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, "users", user.uid), formDataCopy);

            navigate("/");
        } catch (error) {
            toast.error("Failed to Sign Up");
        }
    };

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="nameInput"
                        placeholder="Name"
                        id="name"
                        value={name}
                        onChange={handleChange}
                        name="name"
                        required
                    />
                    <input
                        type="email"
                        className="emailInput"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        name="email"
                        required
                    />
                    <div className="passwordInputDiv">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            placeholder="Password"
                            id="password"
                            value={password}
                            onChange={handleChange}
                            name="password"
                            required
                        />

                        <img
                            className="showPassword"
                            src={visibilityIcon}
                            alt="hide/show password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>

                        <button className="signUpButton">
                            <img src={arrowRightIcon} alt="sign-up button" />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/signin" className="signupLink">
                    Sign In Instead
                </Link>
            </div>
        </>
    );
};

export default SignUp;
