import React, { createContext, useContext,useState,useEffect } from 'react';
import { Store } from 'react-notifications-component';
import { useAuth } from './AuthContext/AuthContext';
import { initializeSocket, getSocket } from '../socket';
import { format } from 'date-fns';
const NotificationContext = createContext();
import axios from 'axios';
import { useLoading } from './LoadingContext/LoadingContext';
export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {

  const { user, setUser, isLoggedIn ,token,login} = useAuth(); // Access user and setUser from AuthContext
  console.log('On user notification page token:', token);
  console.log('On user notification page user:', user._id);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isFilterApplied, setIsFilterApplied] = useState(false); // New state to track filter application
  const [showDateRange, setShowDateRange] = useState(false);
  
  const [dateRange, setDateRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }]);

  const limit = 10; // Records per page
  const API_URL = "http://192.168.1.238:3000/api/admin/get-notification";
  const fetchNotifications = async (stDate = "", enDate = "") => {
    try {
      setLoading(true);
  
      if (token) {
      
       
  
        const requestBody = {
          stDate, 
        enDate, 
        };
  console.log('Request Body:', requestBody);
        const response = await axios.post(
          API_URL, // Endpoint
          requestBody, // Request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page, // Query parameters
              limit,
            },
          }
        );
  
        console.log('API Response:', response.data);
  
        // Ensure the response contains the expected structure
        if (response.status === 200) {
         
          setNotifications(response.data.data); // Set notifications
          setTotalPages(response.data.totalPages); // Set total pages
        } else {
          console.error('Unexpected response structure:', response.data);
         
        }
      }
  
      
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
      
    }finally{
      setLoading(false);
    }
  };
  const fetchNotificationsOnChange = async () => {
    if (token) {
      // Fetch notifications after login if token is available
      if (isFilterApplied) {
        await fetchNotifications(format(dateRange[0].startDate,'yyyy-MM-dd'), format(dateRange[0].endDate,'yyyy-MM-dd'));
      } else {
        await fetchNotifications();
      }
    }
  };
  useEffect(() => {
    fetchNotificationsOnChange(); // Call fetch function on token or filter change
    // Initialize socket
    if (!getSocket()) {
      initializeSocket();
    }
    const socket = getSocket();

    // Handle real-time notifications
    const handleNotification = (data) => {
      if (data.customer_id === user?._id) {
        console.log('Received notification:', data);
        setNotifications((prev) => [...prev, data]); // Add new notification to the top
     
      }
    };

    // Listen for notifications
    if (socket) {
      socket.on('admin-send-notification', handleNotification);
    }

    return () => {
      if (socket) {
        socket.off('admin-send-notification', handleNotification);
      }
    };
    
  }, [token,user,page,isFilterApplied,dateRange]);
 

  const handleNextPage = (newPage) => {
    console.log('totalPages:', totalPages);
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage); 
    }
     
  };
  
  

  const handleFilterBtnClick = ()=>{
     
      setPage(1);
      setTotalPages(0);
    
    setShowDateRange(!showDateRange);
    setDateRange([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }])
    setIsFilterApplied(false); // Reset filter application when opening date range
  }

  const handleApplyFilter =async () => {
    const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd'); 
    const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    setIsFilterApplied(true);
    await fetchNotificationsOnChange();
    
    setShowDateRange(false); // Date Range Picker को बंद करना
    
  };
  return (
    <NotificationContext.Provider value={{ notifications, setNotifications ,page, setPage, totalPages, setTotalPages, loading, setLoading, handleNextPage, handleFilterBtnClick, handleApplyFilter, showDateRange, setShowDateRange, dateRange, setDateRange}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const userNotification = () => useContext(NotificationContext);