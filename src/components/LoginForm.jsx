import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext/AuthContext';
import { useActiveTab } from '../context/ActiveTab/ActiveTab';
import { usePasswordVisibility } from '../context/PasswordVisibilityContext/PasswordVisibilityContext';
import FormInput from './FormInput';
import axios from 'axios';
import { initializeSocket } from '../socket';

import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDialog } from '../context/DialogContext/DialogContext';

const LoginForm = () => {
  const { login } = useAuth();
  const { setActiveTab } = useActiveTab();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const { showDialog, hideDialog } = useDialog();

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showDialog({
        type: 'message',
        title: 'Error',
        message: 'Please fill in all fields.',
        actions: [{ label: 'Close', onClick: hideDialog }],
      });
      return;
    }

    try {
      showDialog({ type: 'loading', message: 'Logging in...' });

      const response = await axios.post(
        'http://192.168.1.238:3000/api/user/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      hideDialog(); // Hide loading dialog
      if (response.status === 200) {
        const { user, token } = response.data;

        login(user, token);
        initializeSocket();

        setActiveTab(user.role === 'admin' ? 'dashboard' : 'userDashboard');
        navigate(user.role === 'admin' ? '/dashboard' : '/userDashboard', { replace: true });
      } else {
        showDialog({
          type: 'message',
          title: 'Error',
          message: 'Invalid credentials.',
          actions: [{ label: 'Close', onClick: hideDialog }],
        });
      }
    } catch (error) {
      hideDialog(); // Hide loading dialog
      showDialog({
        type: 'message',
        title: 'Error',
        message: error.response?.data?.message || 'An unexpected error occurred.',
        actions: [{ label: 'Close', onClick: hideDialog }],
      });
    }
  };

  return (
    <div className='flex flex-col items-center bg-transparent md:w-full w-full justify-center min-h-screen '>


   
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hello Again!</h2>
      <p className="text-sm text-gray-600 mb-4">Welcome back! Please login to your account.</p>

      <form className="w-full max-w-sm px-4" autoComplete='off'>
        <FormInput type="email" autoComplete='off' label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} icon={faEnvelope} />
        
       
          <FormInput
            type={isPasswordVisible ? 'text' : 'password'}
            label="Password"
            autoComplete='off'
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={isPasswordVisible ? faEyeSlash : faEye}
            onIconClick={togglePasswordVisibility}
           
          />
           
        
        
        
        
        <button type="submit" onClick={handleLoginClick} className="w-full bg-blue-500 text-white font-semibold py-2 text-sm mt-4 rounded-lg hover:bg-blue-700 transition duration-300">
         
          Login
        </button>
        <div className="flex justify-end mt-2">
          <Link to="/" className="text-xs md:text-sm text-blue-500 md:text-white hover:underline font-medium ">Forgot Password?</Link>
        </div>
        
        
        {/* <SocialLoginButton type="google" label="Login with Google" /> */}
        <div className="flex flex-col gap-2 justify-center item-center ">
        <p className="text-center text-sm md:text-white ">or</p>
        <p className="text-xs md:text-sm text-center text-gray-600 md:text-gray-100  ">
          Don't have an account? <Link to="/signup" className="text-blue-500 text-xs md:text-sm md:text-white hover:underline font-medium">Sign up</Link>
        </p>
        </div>
      </form>


    </div>
  );
};

export default LoginForm;
