import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import MobileNav from "../../Mobile/MobileNav/MobileNav";
import { IsMobileContext } from "../../Context/isMobileContext";
export default function RoutLayout() {
  const { isMobile } = useContext(IsMobileContext);
  return (
    <>
      {!isMobile&&<Navbar />}
      <Outlet />
      {isMobile ? <MobileNav /> : <Footer />}
    </>
  );
}
