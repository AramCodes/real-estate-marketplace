import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

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

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <form>
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

                    <div className="signInBar">
                        <p className="signInText">Sign In</p>

                        <button className="signInButton">
                            <img src={arrowRightIcon} alt="sign-in button" />
                        </button>
                    </div>
                </form>

                <Link to="/signUp" className="registerLink">
                    Sign Up Instead
                </Link>
            </div>
        </>
    );
};

export default SignIn;
