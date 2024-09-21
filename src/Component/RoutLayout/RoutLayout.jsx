import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/navbar";
export default function RoutLayout() {
  return (
    <>
      <Navbar  />
      <Outlet />
    </>
  );
}
