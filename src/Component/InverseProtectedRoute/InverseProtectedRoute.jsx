import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/authContext";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
// This component is used to protect the routes that should only be accessed by unregistered users
export default function InverseProtectedRoute(props) {
  const { isRegistered } = useContext(authContext);
  const {t} = useTranslation();
  if (isRegistered) {
    return <Navigate to="/" />;
  } else {
    return <>
    {/* i put helmet here to affect all forms component like Login Register */}
    <Helmet>
      <title>{t("forms_meta_title")}</title>
    </Helmet>
    {props.children}</>;
  }
}
