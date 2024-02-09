import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();

            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (userCredentials.user) {
                navigate("/");
            }
        } catch (error) {
            toast.error("Invalid Credentials");
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

                    <Link to="/forgot-password" className="forgotPasswordLink">
                        Forgot Password
                    </Link>

                    <div className="signInBar">
                        <p className="signInText">Sign In</p>

                        <button className="signInButton">
                            <img src={arrowRightIcon} alt="sign-in button" />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/signUp" className="registerLink">
                    Sign Up Instead
                </Link>
            </div>
        </>
    );
};

export default SignIn;
