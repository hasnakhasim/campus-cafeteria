import React from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  try {
    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    return children;

  } catch (error) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }
}

export default AdminProtectedRoute;