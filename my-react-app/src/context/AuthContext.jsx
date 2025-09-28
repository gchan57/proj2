import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import * as api from '../api/index';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('gighub_user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const userData = await api.login(credentials);
        if (userData._id) {
            localStorage.setItem('gighub_user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } else {
            throw new Error(userData.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        const newUserData = await api.register(userData);
        if (newUserData._id) {
            localStorage.setItem('gighub_user', JSON.stringify(newUserData));
            setUser(newUserData);
            navigate(`/${newUserData.role}/dashboard`);
            return newUserData;
        } else {
            throw new Error(newUserData.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('gighub_user');
        setUser(null);
        navigate('/');
    };
    
    const value = { user, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};