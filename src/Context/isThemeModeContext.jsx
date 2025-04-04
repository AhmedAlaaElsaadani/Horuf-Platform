import React, { createContext, useEffect, useState } from "react";

export const isThemeModeContext = createContext();

export default function IsThemeModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(null);

  /**
   * this function changes the theme mode in the DOM and local storage
   */
  const changeThemeMode = () => {
    if (isDarkMode === null) {
      return;
    }
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Check the theme mode from local storage or from the system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = localStorage.getItem("theme");

    if (theme) {
      // If a theme is saved in localStorage, use it
      setIsDarkMode(theme === "dark");
      // Otherwise, use the system preference
    } else setIsDarkMode(mediaQuery.matches);
      // console.log(mediaQuery.matches);
    // Listen for changes in system theme preference
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Apply the theme when `isDarkMode` changes
  useEffect(() => {
    changeThemeMode();
  }, [isDarkMode]);

  return (
    <isThemeModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </isThemeModeContext.Provider>
  );
}
