import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from '../LoadingContext/LoadingContext';
const SendNotificationContext = createContext();
export const SendNotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize loading to false
  const [error, setError] = useState(null);
  const [customerIds, setCustomerIds] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const sendNotification = async () => {
    if (!customerIds.length || !title || !message) {
        toast.error('Please fill in all fields'); // Show an error toast for empty fields
      return;
    }

   
    try {
      setLoading(true);
      const response = await axios.post('http://192.168.1.238:3000/api/admin/send-notification', {
        customer_ids: customerIds,
        title: title,
        message: message
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.status === 200){
        toast.success('Notification sent successfully!'); // Show success toast
      console.log('Response:', response);}else{
        toast.error('Error sending notification');
        console.log('Response:', response);
      }
      
    } catch (error) {
      setError(error.message);
     
     
      toast.error('Failed to send notification: ' + error.message); // Show error toast
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <SendNotificationContext.Provider value={{
      sendNotification,
      customerIds,
      setCustomerIds,
      title,
      setTitle,
      message,
      setMessage,
      loading,
      error
    }}>
      {children}
    </SendNotificationContext.Provider>
  );
};

export const useSendNotification = () => {
  return useContext(SendNotificationContext);
};
