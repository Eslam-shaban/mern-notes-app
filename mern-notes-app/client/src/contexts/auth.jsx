import { createContext, useContext, useState, useEffect } from "react";

import { toast } from 'react-toastify'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setUser(token)
        }
    }, []);

    // Function to handle user registration
    const registerUser = async (userData) => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Register failed");
        }

        const data = await res.json();

        if (data.success) {
            setUser(data.token);
            localStorage.setItem('token', data.token);
        }

        return data;
    };

    // Function to handle user login
    const loginUser = async (userData) => {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Login failed");
        }

        const data = await res.json();

        if (data.success) {
            setUser(data.token);
            localStorage.setItem('token', data.token);
        }

        return data;
    };


    // Function to handle user logout
    const logoutUser = async () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success("User logged out successfully")
    }
    // Context data to be provided to components
    const contextData = {
        user,
        loginUser,
        registerUser,
        logoutUser
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);