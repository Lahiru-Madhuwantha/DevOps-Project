import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthorizedRoute() {
  const admin = useSelector((state) => state.auth.data.isAdmin);
  return admin ? <Outlet /> : <Navigate to="/unauthorized" />;
}
