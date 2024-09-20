import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Heading1 from "../Heading1/Heading1";
import Heading2 from "../Heading2/Heading2";
import img from "../../assets/Images/Heading2/1.jpeg";
import img1 from "../../assets/Images/Heading2/2.jpeg";
export default function RoutLayout() {
  return (
    <>
      <Navbar  />
      {/* <Heading1 headingText={"حساب الطالب"} />
      <Heading2 headingText={"حساب الطالب"} img={img1} /> */}

      <Outlet />
    </>
  );
}
