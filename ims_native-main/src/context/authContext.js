import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serverUrl from '../api/urls';
import instance from "../api/axiosConfig";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState("godownhead");

  const getAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('auth')
      // await AsyncStorage.removeItem('auth');
      // await AsyncStorage.removeItem('user');
      // setAuth(false);

      if (token != null) {

        setAuth(true);
      }
    } catch (err) {
      console.error('Error getting auth state:', err);
    }
  };
  useEffect(() => {
    getAuthState();
  }, []);

  const handleLogin = async (authData, user) => {
    try {
      if (authData && authData.token) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('auth', authData.token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setRole(user.role === "admin" ? "admin" : "godownhead");

        setAuth(true);
      } else {
        console.error('Invalid auth data received from API');
      }
    } catch (error) {
      console.error('Failed to set auth data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await instance.post(serverUrl.logout);
      await AsyncStorage.removeItem('auth');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.clear();
      setAuth(false);
      return response;

    } catch (error) {
      console.error('Failed to remove auth data:', error);
    }
  };

  const loginWithOTP = async ( godownheadNo, otp) => {
    try {
      const response = await instance.post(serverUrl.loginWithOtp, { godownheadNo, otp });
      // Assuming the backend returns the authentication data and user details
      const authData = {
        token: response.data.cookie,
        username: response.data.username
    }

    const user = {
        username: response.data.username,
        godownHeadId: response.data.godownHeadId,
        godownId: response.data.godownId,
        role: response.data.role,
    }
      await AsyncStorage.clear();
      await AsyncStorage.setItem('auth', authData.token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setRole(user.role === "admin" ? "admin" : "godownhead");
      setAuth(true);
      return response.data.message;
    } catch (error) {
      // console.error('Failed to log in with OTP:', error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ auth, handleLogin, handleLogout, role,loginWithOTP}}>
      {children}
    </AuthContext.Provider>
  );
};
