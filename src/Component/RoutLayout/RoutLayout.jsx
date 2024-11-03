import React, { lazy, useContext } from "react";
import { Outlet } from "react-router-dom";
const Navbar =lazy (()=>import( "../Navbar/Navbar"));
const Footer =lazy (()=>import( "../Footer/Footer"));
const MobileNav =lazy (()=>import(  "../../Mobile/MobileNav/MobileNav"));
import { IsMobileContext } from "../../Context/isMobileContext";
import Spinner from "../Ui/Spinner/Spinner";
export default function RoutLayout() {
  const { isMobile } = useContext(IsMobileContext);
  return (
    <>
      <React.Suspense fallback={<Spinner sectionFlag={false} />}>
        {!isMobile && <Navbar />}
      </React.Suspense>
      <React.Suspense fallback={<Spinner />}>
        <Outlet />
      </React.Suspense>
      <React.Suspense fallback={<Spinner sectionFlag={false} />}>
        {isMobile ? <MobileNav /> : <Footer />}
      </React.Suspense>
    </>
  );
}
