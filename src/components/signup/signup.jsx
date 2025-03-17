import { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./signup.scss";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export default function Signup() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        otp: ""
    });

    const [confirmationResult, setConfirmationResult] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // ✅ useRef instead of window
    const recaptchaVerifier = useRef(null);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Setup RecaptchaVerifier once
    useEffect(() => {
        if (!recaptchaVerifier.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        console.log("reCAPTCHA resolved");
                    },
                    'expired-callback': () => {
                        console.warn("reCAPTCHA expired, generating new one...");
                        recaptchaVerifier.current.clear();
                        recaptchaVerifier.current = null;
                    }
                },
                auth
            );
            recaptchaVerifier.current.render();
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (userData.phone.length < 10) {
            alert("Please enter a valid phone number");
            return;
        }

        try {
            const appVerifier = recaptchaVerifier.current;
            const result = await signInWithPhoneNumber(auth, `+91${userData.phone}`, appVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
            alert("OTP sent to your phone!");
        } catch (error) {
            console.log(error);
            alert("Failed to send OTP: " + error.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (confirmationResult && userData.otp) {
            try {
                const result = await confirmationResult.confirm(userData.otp);
                alert("Phone number verified successfully!");
                setIsVerified(true);
                console.log("User verified:", result.user);
            } catch (err) {
                console.log(err);
                alert("Invalid OTP");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert("Please verify your phone number first.");
            return;
        }
        // Here you can now create user in your DB
        console.log("User registered:", userData);
        alert("User registered successfully!");
    };

    return (
        <div className="Signup">
            <div className="signup-box">
                <h1>Sign up</h1>
                <form>
                    <input type="text" onChange={handleChangeInput} value={userData.firstName} name="firstName" placeholder="First name" />
                    <input type="text" onChange={handleChangeInput} value={userData.lastName} name="lastName" placeholder="Last name" />
                    <input type="email" onChange={handleChangeInput} value={userData.email} name="email" placeholder="Email" />
                    <input type="number" onChange={handleChangeInput} value={userData.phone} name="phone" placeholder="Phone number" />

                    {!otpSent && (
                        <button onClick={handleSendOtp} className="otp-btn" type="button">
                            Send OTP
                        </button>
                    )}

                    {otpSent && !isVerified && (
                        <>
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={userData.otp}
                                onChange={handleChangeInput}
                            />
                            <button onClick={handleVerifyOtp} className="verify-btn" type="button">
                                Verify OTP
                            </button>
                        </>
                    )}

                    {isVerified && (
                        <>
                            <input
                                type="password"
                                onChange={handleChangeInput}
                                value={userData.password}
                                name="password"
                                placeholder="Password"
                            />
                            <button type="submit" onClick={handleSubmit}>
                                Sign up
                            </button>
                        </>
                    )}
                </form>
                {/* Recaptcha container */}
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
}
