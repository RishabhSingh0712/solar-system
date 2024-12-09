import React,{useState,useEffect} from "react";
import { BrowserRouter as Router,useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext/AuthContext';
import { ActiveTabProvider } from './context/ActiveTab/ActiveTab';
import {SidebarToggleProvider} from './context/SidebarToggle/SidebarToggleContext';
import AuthContainer from "./components/AuthContainer";
import 'react-notifications-component/dist/theme.css'; // Make sure this is in your App.js
import { MainLayout } from "./components/MainLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import Loader from "./components/Loader";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useActiveTab } from "./context/ActiveTab/ActiveTab";
const App = () => {
  const {loading,logout } = useAuth();
const {setActiveTab} = useActiveTab();
const navigate = useNavigate(); // To navigate programmatically
const isLogedIn = sessionStorage.getItem('logedIn');
const tokenExpiryTime = sessionStorage.getItem('tokenExpiry'); // Get stored token expiry time
const currentTime = new Date().getTime();
const isTokenExpired = tokenExpiryTime && currentTime > tokenExpiryTime;
const [openDialog, setOpenDialog] = useState(false); // For managing dialog visibility

useEffect(() => {
  if (isTokenExpired) {
    // Show dialog and logout the user
    setOpenDialog(true);
    logout(); // Log out the user immediately
setActiveTab('')
    // Clear session storage to remove token data
    sessionStorage.clear();
    // navigate('/'); // Redirect to the login screen
  }
}, [isTokenExpired, logout, navigate, setActiveTab]);

const handleCloseDialog = () => {
  setOpenDialog(false);
  // window.location.href = "/"; // Redirect to AuthContainer when dialog is closed
};

  return (
    <SidebarToggleProvider>
      {/* <ActiveTabProvider> */}
        {/* <Router> */}
          <div className={`h-screen `}>
            {(!isLogedIn || isTokenExpired )? <AuthContainer /> : <MainLayout />}
          </div>
          {/* Dialog Box for Session Expiry */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="session-expired-dialog"
            aria-describedby="session-expired-message"
          >
            <DialogTitle>Session Expired</DialogTitle>
            <DialogContent>
              <p className="text-xs text-gray-400">Your session has expired. Please log in again.</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
          {/* Always present ToastContainer */}
          <ToastContainer 
            position="bottom-center"
           
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />
        {/* </Router> */}
      {/* </ActiveTabProvider> */}
    </SidebarToggleProvider>
  );
};

export default App;
