// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActiveTab } from '../ActiveTab/ActiveTab';
import { BrowserRouter as Router,useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const { setLoading } = useLoading(); // Import loading context'
  const navigate = useNavigate(); // To navigate programmatically
  const [user, setUser] = useState([]);
  const {setActiveTab} = useActiveTab();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null); // New state for token
  const [loading, setLoading] = useState(false); // Add loading state
  
  useEffect(() => {
    const fetchData = async () => {
     
      try {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const loggedIn = sessionStorage.getItem('logedIn') === 'true';
        const savedToken = sessionStorage.getItem('token');
        const tokenExpiry = sessionStorage.getItem('tokenExpiry'); // Stored token expiration time
        // if (loggedIn && userData) {
        //   setUser(userData);
        //   setIsLoggedIn(true);
        //   setToken(savedToken);
        
        // }
        if (loggedIn && userData && savedToken && tokenExpiry) {
          const currentTime = new Date().getTime();
          if (currentTime < tokenExpiry) {
            setUser(userData);
            setIsLoggedIn(true);
            setToken(savedToken);
          } else {
            // Token is expired, logout the user
            logout();
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
  
    fetchData();
  }, []);

  const login = (userData,userToken) => {
    setUser(userData);
    setIsLoggedIn(true);
    setToken(userToken);
    
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('logedIn', true);
    sessionStorage.setItem('token', userToken); // Save token in sessionStorage
        // Set token expiry time to 2 minutes from now
        const expiryTime = new Date().getTime() + 2 * 60 * 1000; // Token expires in 2 minutes
        sessionStorage.setItem('tokenExpiry', expiryTime); // Store token expiry time
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    setActiveTab('')
    sessionStorage.clear(); // Remove token from sessionStorage
    navigate('/',{replace:true});
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoggedIn,token,loading,setLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext); // Ensure this returns the context
};