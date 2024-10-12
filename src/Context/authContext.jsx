import { createContext, useEffect, useState } from "react";
import ApiManager from "../Utilies/ApiManager";
export const authContext = createContext();
export default function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState(null);
  /**
   * this function check if the session is still valid or not
   * @returns {void}
   */
  const checkSession = async () => {
    setIsRegistered(await checkIfSessionEnd(token));
  };
  /**
   * this function get Current User Data
   * @param {string} token
   * @returns {void}
   */
  const getCurrentUserData = async (token) => {
    try {
      const { data } = await ApiManager.getProfile(token);
      if (data.code == 200) {
        setUser(data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    //get token from local storage to handle refresh
    let tokenFromLocalStorage = localStorage.getItem("token");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      checkSession();
    }
  }, []);
  useEffect(() => {
    if (token) checkSession();
    else {
      setIsRegistered(false);
      endACurrentSession();
    }
  }, [token]);
  useEffect(() => {
    if (isRegistered) {
      getCurrentUserData(token);
    }
  }, [isRegistered]);
  return (
    <authContext.Provider
      value={{
        token,
        setToken,
        isRegistered,
        user,
        setUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

//==============Authorization Functions=============
export function startANewSession() {
  const currentDate = new Date();
  localStorage.setItem("startDateSession", currentDate);
  currentDate.setMinutes(currentDate.getMinutes() + 60);
  localStorage.setItem("endDateSession", currentDate);
  localStorage.setItem("sessionFlag", "true");
}
export function endACurrentSession() {
  localStorage.setItem("sessionFlag", "false");
  localStorage.removeItem("endDateSession");
  localStorage.removeItem("startDateSession");
  localStorage.removeItem("token");
}
async function isUserSession(token) {
  if (token) {
    const { data } = await ApiManager.checkIfSessionEnd(token);
    if (data.code === 200) {
      localStorage.setItem("token", token);
      startANewSession();
      return true;
    } else if (data.code === 202) {
      localStorage.setItem("token", data.message);
      startANewSession();
      return true;
    } else {
      endACurrentSession();
      return false;
    }
  } else {
    return false;
  }
}
async function checkIfSessionEnd(token) {
  const now = new Date();
  const endDateSessionFromLocalStorage = localStorage.getItem("endDateSession");
  if (token && endDateSessionFromLocalStorage) {
    const endDateSession = new Date(endDateSessionFromLocalStorage);
    if (now <= endDateSession) {
      localStorage.setItem("token", token);
      localStorage.setItem("sessionFlag", "true");
      return true;
    } else {
      return await isUserSession(token);
    }
  } else {
    return await isUserSession(token);
  }
}
