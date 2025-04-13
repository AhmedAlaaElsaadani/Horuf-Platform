import React, { lazy, useContext } from "react";
import { Outlet } from "react-router-dom";
const Navbar = lazy(() => import("../Navbar/Navbar"));
const Footer = lazy(() => import("../Footer/Footer"));
const MobileNav = lazy(() => import("../../Mobile/MobileNav/MobileNav"));
const WhatsappComponent = lazy(() =>
  import("../Ui/WhatsappComponent/WhatsappComponent")
);
import { IsMobileContext } from "../../Context/isMobileContext";
import Spinner from "../Ui/Spinner/Spinner";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
export default function RoutLayout() {
  const { isMobile } = useContext(IsMobileContext);
  const { t } = useTranslation();
  

  return (
    <>
      <Helmet>
        <meta name="Keywords" content={t("home_keywords_for_meta")} />
        <meta name="description" content={t("home_desc_for_meta")} />
        <title>{t("home_title_for_meta")}</title>
      </Helmet>
      <React.Suspense fallback={<Spinner sectionFlag={false} />}>
        {!isMobile && (
          <>
            <Navbar />
            <WhatsappComponent />
          </>
        )}
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
