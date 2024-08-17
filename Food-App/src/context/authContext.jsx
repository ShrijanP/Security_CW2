import axios from "../axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState();
  const [profileDetail, setProfileDetail] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(() => localStorage.getItem('_hw_userDetails') ? JSON.parse(localStorage.getItem('_hw_userDetails')) : "");

  const token = localStorage.getItem('_hw_token')

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem('_hw_userDetails')))
    if (token) {
      setIsAuthenticated(true)
    } else setIsAuthenticated(false)
  }, [localStorage.getItem('_hw_userDetails')])


  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        authUser,
        setAuthUser,
        userDetails,
        setUserDetails,
        // details,
        profileDetail,
        setProfileDetail
        // userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
