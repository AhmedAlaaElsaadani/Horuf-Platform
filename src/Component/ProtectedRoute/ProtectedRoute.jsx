import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/authContext";
// This component is used to protect the routes that should only be accessed by registered users
export default function ProtectedRoute(props) {
  const { isRegistered } = useContext(authContext);

  if (isRegistered) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}
