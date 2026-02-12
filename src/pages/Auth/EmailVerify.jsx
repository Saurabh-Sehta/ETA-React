import React, { useEffect, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosinstance';
import axios from 'axios';

const EmailVerify = () => {

    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [email, setEmail] = useState("");
    const inputRef = React.useRef([]);

    const navigate = useNavigate();

    axios.defaults.withCredentials = false;

    useEffect(() => {
        startTimer();
        setEmail(localStorage.getItem("verifyEmail") || "");
    }, []);

    const startTimer = () => {
        setTimeLeft(60);
        setCanResend(false);
    };

    // Countdown logic
    useEffect(() => {
        if (timeLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email not found");
            return;
        }
        try {
            // call resend OTP API here later
            setLoading(true);
            const response = await axiosInstance.post(`${API_PATHS.AUTH.SEND_OTP}?email=${email}`);
            if (response.status === 200) {
                toast.success("OTP has been resent successfully!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong!");
            console.log(error);
        } finally {
            setLoading(false);
            startTimer();
        }

    };

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
        paste.forEach((digit, i) => {
            if (inputRef.current[i]) {
                inputRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputRef.current[next].focus();
    }

    const handleVerifyOtp = async () => {
        const otp = inputRef.current.map(input => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter the complete OTP");
            return;
        }
        if (!email) {
            toast.error("Email not found");
            return;
        }
        console.log("Verifying OTP:", otp);
        try {
            setLoading(true);
            // API call to verify OTP goes here 
            const respense = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, { otp, email });
            if (respense.status === 200) {
                localStorage.setItem("emailVerified", "true");
                toast.success("Email verified successfully! Please continue to sign up.");
                navigate("/signup");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP verification failed!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <div className="min-h-[50vh] flex justify-center bg-slate-50 pt-28">
                {/* <!-- Card --> */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm px-6 py-8">

                    <h3 className="text-xl font-semibold text-black text-center">
                        Verify OTP
                    </h3>

                    <p className="text-xs text-slate-600 text-center mt-2 mb-6">
                        Enter the 6-digit code sent to your email
                    </p>

                    {/* <!-- OTP Input --> */}
                    <div className="flex justify-between gap-2 mb-6">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                ref={(el) => (inputRef.current[i] = el)}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-lg font-semibold
                         border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500 transition"
                            />
                        ))}
                    </div>

                    {/* <!-- Timer --> */}
                    <p className="text-xs text-slate-500 mb-4">
                        Resend OTP in{" "}
                        <span className="font-medium text-slate-700">
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </p>


                    {/* <!-- Verify Button --> */}
                    <button
                        type="button"
                        className="w-full bg-primary text-white py-2 rounded-md
             font-medium hover:bg-primary-dark transition mb-3"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    {/* <!-- Resend OTP --> */}
                    {/* Resend OTP */}
                    <button
                        type="button"
                        disabled={!canResend}
                        onClick={handleResendOtp}
                        className={`w-full text-sm font-medium text-primary
            ${!canResend
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:underline"}
          `}
                    >
                        Resend OTP
                    </button>

                </div>
            </div>
        </AuthLayout>

    )
}

export default EmailVerify