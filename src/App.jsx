import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import Home from './pages/Dashboard/Home';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/UserContext';
import Income from './pages/Dashboard/Income';
import {Toaster } from "react-hot-toast";
import ProfileSettings from './pages/Dashboard/ProfileSettings';
import ResetPassword from './pages/Dashboard/ResetPassword';
import EmailVerify from './pages/Auth/EmailVerify';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Summary from './pages/Dashboard/Summary';

const App = () => {
  return (
    
    <UserProvider>
      <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/email-verify" exact element={<EmailVerify />} />
          <Route path="/forgot-password" exact element={<ForgotPassword />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/summary" exact element={<Summary />} />
          <Route path="/settings" exact element={<ProfileSettings />} />
          <Route path="/reset-password" exact element={<ResetPassword />} />
        </Routes>
      </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize:'13px'
          },
        }}
      />
    </UserProvider>
    
  )
}

export default App

const Root = () =>{
  // checks if token exists in localStorage
  const isAuthenticaed = !!localStorage.getItem("token");

  // redirect to dashboard if authenticated , otherwise login
  return isAuthenticaed ? (<Navigate to = "/dashboard" />) : (<Navigate to = "/login" />) ; 
}
