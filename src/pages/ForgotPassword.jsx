import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcons.svg";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const onChange = (e) => {
        setEmail(e.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Email Was Sent");
        } catch (error) {
            toast.error("Failed to Send Email");
        }
    };

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Forgot Password</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        className="emailInput"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={onChange}
                    />
                    <Link className="forgotPasswordLink" to="/signin">
                        Sign In
                    </Link>

                    <div className="signInBar">
                        <div className="signInText">Send Reset Link</div>
                        <button className="signInButton">
                            <img src={ArrowRightIcon} alt="sign-in button" />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ForgotPassword;
