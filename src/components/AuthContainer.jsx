import React from 'react';
import {useAuth} from '../context/AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import SidePanel from './SidePanel';
import Signup from './Signup';
import OTPInput from './Otp';
import { SignupProvider } from '../context/SignupContext/SignupContext';
import {OtpProvider} from '../context/OtpContext/OtpContext';
import ParticleBackground from './ParticleBackground';
import Loader from './Loader';
const AuthContainer = () => {
  const {isLoggedIn,login,user} = useAuth();
  const location = useLocation();
  console.log('isLoggedIn:', isLoggedIn);
  console.log('user:', user);
  return (
    <div className="h-screen relative">
      {/* <SidePanel /> */}
      <ParticleBackground />
      <div className="absolute inset-0 flex justify-center items-center">
      {location.pathname === '/signup' ? (
          <SignupProvider>      
            <Signup />   
          </SignupProvider>
        ) : location.pathname === '/otp' ? (
          <SignupProvider>
          <OtpProvider>
          <OTPInput />
          </OtpProvider>
          </SignupProvider>
        ) : (
          <LoginForm />
        )}
      </div>
     
    </div>
  );
};

export default AuthContainer;
