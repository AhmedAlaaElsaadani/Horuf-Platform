import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import MobileNav from "../../Mobile/MobileNav";
export default function RoutLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
      <MobileNav/>
    </>
  );
}
