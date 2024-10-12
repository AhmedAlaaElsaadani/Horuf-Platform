import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/authContext";
// This component is used to protect the routes that should only be accessed by unregistered users
export default function InverseProtectedRoute(props) {
  const { isRegistered } = useContext(authContext);
  if (isRegistered) {
    return <Navigate to="/" />;
  } else {
    return props.children;
  }
}
