import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import MyInput from '../../components/Inputs/MyInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return;
    }

    if (!password) {
      setError("Please enter the password")
      return;
    }

    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Welcome back!
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <MyInput value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text" />

          <MyInput value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password" />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary cursor-pointer'>
            LOGIN
          </button>

          <div className="flex items-center justify-between mt-4 text-sm">

            <Link
              to="/forgot-password"
              className="text-primary hover:text-primary/80 transition"
            >
              Forgot Password?
            </Link>

            <span className="text-slate-500">
              Don’t have an account?{" "}
              <Link
                to="/signUp"
                className="font-semibold text-primary hover:text-primary/80 transition"
              >
                Sign Up
              </Link>
            </span>

          </div>


        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
