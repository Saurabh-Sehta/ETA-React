import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {

  const [profileData, setProfileData] = useState([]);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef([]);

  const { user } = useContext(UserContext);

  useUserAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData(user);
      if (user?.email) {
        setEmail(user.email);
      }
      console.log("Profile Data:", user);
    }
  }, [user]);

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${API_PATHS.SETTINGS.SEND_RESET_OTP}?email=` + email);
      if (response.status === 200) {
        toast.success("OTP sent to your email");
        setLoading(true);
        setIsEmailSent(true);
      } else {
        toast.error("Unable to send OTP. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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

    setOtp(otp);
    setIsOtpSubmitted(true);

    if (!email) {
            toast.error("Email not found");
            return;
        }
        console.log("Verifying OTP:", otp);
        try {
            setLoading(true);
            // API call to verify OTP goes here 
            const respense = await axiosInstance.post(API_PATHS.SETTINGS.VERIFY_RESET_OTP, { email, otp});
            if (respense.status === 200) {
                localStorage.setItem("emailVerified", "true");
                toast.success("Email verified successfully! Please continue to reset your password.");
                setIsOtpVerified(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP verification failed!");
        } finally {
            setLoading(false);
        }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      toast.error("Please verify your email first");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${API_PATHS.SETTINGS.RESET_PASSWORD}`, {email, newPassword});
      if (response.status === 200) {
        toast.success("Password reset successful. Please login with your new password.");
        navigate("/settings");
      } else {
        toast.error("Unable to reset password. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <DashboardLayout activeMenu="Settings">
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

          {/* STEP 1: EMAIL */}
          {!isEmailSent && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Reset Password
              </h2>
              <p className="text-sm text-gray-500 text-center mt-2 mb-6">
                Confirm your registered email address
              </p>

              <form onSubmit={onEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <strong>Email Address Confirmation</strong>
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-violet-600 text-white py-2.5
                       font-medium hover:bg-violet-500 transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {isEmailSent && !isOtpSubmitted && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Verify Email
              </h2>
              <p className="text-sm text-gray-500 text-center mt-2 mb-6">
                Enter the 6-digit OTP sent to your email
              </p>

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

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full rounded-lg bg-violet-600 text-white py-2.5
                     font-medium hover:bg-violet-500 transition
                     disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {isEmailSent && isOtpSubmitted && isOtpVerified && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Set New Password
              </h2>
              <p className="text-sm text-gray-500 text-center mt-2 mb-6">
                Enter your new password below
              </p>

              <form onSubmit={onSubmitNewPassword} className="space-y-4">
                <div>
                  <div className="space-y-4">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={`w-full rounded-lg px-4 py-2.5 transition
        border ${newPassword && newPassword.length < 8
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          }
        focus:outline-none focus:ring-2`}
                      />

                      {newPassword && newPassword.length < 8 && (
                        <p className="text-sm text-red-500 mt-1">
                          Password must be at least 8 characters
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`w-full rounded-lg px-4 py-2.5 transition
        border ${confirmPassword && confirmPassword !== newPassword
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          }
        focus:outline-none focus:ring-2`}
                      />

                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-sm text-red-500 mt-1">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-violet-600 text-white py-2.5
                       font-medium hover:bg-violet-500 transition
                       disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Update Password"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResetPassword