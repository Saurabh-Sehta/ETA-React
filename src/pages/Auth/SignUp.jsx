import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/layouts/AuthLayout';
import MyInput from '../../components/Inputs/MyInput';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import axios from 'axios';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_pics");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dnzmxvfq1/image/upload",
      formData
    );

    return response.data.secure_url;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }

    if (!fullName || !email || !password) {
      setError("Please fill all the fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError(""); // clear any previous error

    // Signup API call
    try {

      setLoading(true);

      // Upload image if present
      let profileImageUrl = "";
      if (profilePic) {
        profileImageUrl = await uploadToCloudinary(profilePic);
      }

      if (isVerified) {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          fullName,
          email,
          password,
          profileUrl: profileImageUrl,
        });

        if (response.status === 201) {
          localStorage.removeItem("verifyEmail");
          localStorage.removeItem("name");
          localStorage.removeItem("emailVerified");
          toast.success("Registration successful! Please log in.");
          navigate("/login");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }


    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
        console.log(err.response.data);
      } else {
        console.log(err);
        setError("Signup failed. Try again.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  const handleVerify = async (email) => {

    if (loading) {
      return; // Prevent multiple clicks while loading
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Please enter your full name first");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem("verifyEmail", email);
      localStorage.setItem("name", fullName);
      localStorage.setItem("emailVerified", "false");
      const response = await axiosInstance.post(`${API_PATHS.AUTH.SEND_OTP}?email=${email}`);
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully!")
      } else {
        toast.error("Unable to send OTP!")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const verified = localStorage.getItem("emailVerified");
    if (verified === "true") {
      setIsVerified(true);
      setEmail(localStorage.getItem("verifyEmail") || "");
      setFullName(localStorage.getItem("name") || "");
    }
  }, []);

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyInput
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />

            <div className="w-full">
              <div className="relative">
                <label className="text-[13px] text-slate-800">Email Addresss</label>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="john@example.com"
                    className={`w-full bg-transparent outline-none pr-28`}
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    disabled={isVerified}
                  />
                </div>
                <button
                  type="button"
                  className={`absolute right-2 top-15 -translate-y-1/2 px-4 py-1.5 text-sm 
                 font-medium bg-primary text-white rounded-md 
                 hover:bg-primary-dark transition
                 hover:bg-primary-dark transition ${(isVerified || loading || !validateEmail(email)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={loading || isVerified || !validateEmail(email)}
                  onClick={() => { handleVerify(email) }}
                >
                  {isVerified ? "Verified" : loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>

            <MyInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className={`btn-primary mt-4 ${(!isVerified || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={!isVerified}>
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-500 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

