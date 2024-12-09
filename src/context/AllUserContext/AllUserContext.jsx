// context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLoading } from '../LoadingContext/LoadingContext';
// Create a Context for the user data
const UserContext = createContext();

// UserContext Provider Component
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Replace `{{base_url}}` with your actual base URL
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://192.168.1.238:3000/api/user/get-user');
                console.log('response:', response);
                const data = await response.json();
                setUsers(data.users); // Assuming the API returns a field `users` containing an array of user objects
               
            } catch (err) {
                setError('Error fetching users');
                
            }finally{
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUsers = () => useContext(UserContext);
