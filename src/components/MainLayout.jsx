import React, { Suspense, lazy,useEffect,useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { useSidebarToggle } from '../context/SidebarToggle/SidebarToggleContext';
import { DropdownProvider } from "../context/DropDownContext/DropdownContext";
import { UserPlantProvider } from "../context/UserPlantContext/UserPlantContext";
import { UserProvider } from "../context/AllUserContext/AllUserContext";
import { NotificationProvider } from "../context/NotificationContext";
import { SendNotificationProvider } from '../context/SendNotificationContext/SendNotificationContext';
import { ToastContainer } from 'react-toastify';
import { useAuth } from "../context/AuthContext/AuthContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
// Lazily load components
const Sidebar = lazy(() => import("../components/Sidebar"));
const Dashboard = lazy(() => import('../components/Dashboard'));
const Settings = lazy(() => import('../components/Settings'));
const Profile = lazy(() => import('../components/Profile'));
const UserDashBoard = lazy(() => import("../components/UserDashboard"));
const Sendnotification = lazy(() => import("../components/Notifications"));
const UserNotification = lazy(() => import("../components/UserNotification"));
const Tables = lazy(() => import("../components/Table"));
const Loader = lazy(() => import("../components/Loader"));
const AuthContainer = lazy(() => import("../components/AuthContainer"));

export const MainLayout = () => {
  const { isSidebarOpen } = useSidebarToggle();
  const isLogedIn = sessionStorage.getItem('logedIn'); // Check login status
  if (!isLogedIn ) {
    return <AuthContainer />;
  }

  return (
    <div className="flex h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <DropdownProvider>
        {/* Lazy load Sidebar if not open */}
        {/* <Suspense fallback={<Loader />}> */}
          {!isSidebarOpen && <Sidebar />}
        {/* </Suspense> */}

        <div className="w-full overflow-y-auto">
          {/* Wrap Routes with Suspense for lazy-loaded components */}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <UserPlantProvider>
                    <Dashboard />
                  </UserPlantProvider>
                }
              />
              <Route
                path="/users"
                element={
                  <UserPlantProvider>
                    <Tables showMobNavBar={true} />
                  </UserPlantProvider>
                }
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/userDashboard" element={<UserDashBoard />} />
              <Route
                path="/sendnotification"
                element={
                  <UserProvider>
                    <SendNotificationProvider>
                      <Sendnotification />
                    </SendNotificationProvider>
                  </UserProvider>
                }
              />
              <Route
                path="notifications"
                element={
                  <NotificationProvider>
                    <UserNotification />
                  </NotificationProvider>
                }
              />
              <Route path="support" element={<UserDashBoard />} />
              <Route path="/" element={<AuthContainer />} /> {/* Default route */}
            </Routes>
          </Suspense>
        </div>
       
      </DropdownProvider>
    </div>
  );
};
