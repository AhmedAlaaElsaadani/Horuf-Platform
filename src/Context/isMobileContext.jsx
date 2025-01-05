import React, { createContext, useEffect, useState } from "react";
export const IsMobileContext = createContext();
export default function IsMobileProvider({ children }) {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width:768px)").matches
  );

  const checkMobile = (e) => {
    setIsMobile(e.matches);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:768px)");
    mediaQuery.addEventListener("change", checkMobile);
    setIsMobile(window.matchMedia("(max-width:768px)").matches);
    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  return (
    <IsMobileContext.Provider value={{ isMobile }}>
      {children}
    </IsMobileContext.Provider>
  );
}
