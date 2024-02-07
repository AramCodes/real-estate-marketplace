import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

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

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <form>
                    <input
                        type="text"
                        className="nameInput"
                        placeholder="Name"
                        id="name"
                        value={name}
                        onChange={handleChange}
                        name="name"
                    />
                    <input
                        type="email"
                        className="emailInput"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        name="email"
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
                        />

                        <img
                            className="showPassword"
                            src={visibilityIcon}
                            alt="hide/show password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <Link to="/forgotPassword" className="forgotPasswordLink">
                        Forgot Password
                    </Link>

                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>

                        <button className="signUpButton">
                            <img src={arrowRightIcon} alt="sign-up button" />
                        </button>
                    </div>
                </form>

                <Link to="/signin" className="signupLink">
                    Sign In Instead
                </Link>
            </div>
        </>
    );
};

export default SignUp;
