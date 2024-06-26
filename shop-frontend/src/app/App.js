import React, { Component, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginForm from "../features/authentication/loginForm";
import "react-toastify/dist/ReactToastify.css";
import Home from "../components/home";
import ProtectedRoute from "../components/protectedRoute";
import Products from "../features/products/products";
import NavBar from "../components/navBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Orders from "../features/orders/orders";
import Category from "../features/Category/category";
import Profile from "../features/authentication/profile";
import RegistrationForm from "../features/authentication/registrationForm";
import Product from "../features/products/product";
import UserList from "../features/users/userList";
import Unauthorized from "./../components/unauthorized/unauthorized";
import AuthorizedRoute from "../components/authorizedRoute";
import NotFound from "../components/notFound";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../features/authentication/authSlice";
import { fetchOrders } from "../features/orders/orderSlice";
import { fetchCategories } from "./../features/Category/categorySlice";
import Cart from "../features/cart/cart";
import ProductForm from "../features/products/productForm";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Cafeteria App";
    if (localStorage.getItem("token")) {
      dispatch(fetchUserData());
      dispatch(fetchOrders());
      dispatch(fetchCategories());
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <NavBar />
      <main className="container">
        <Routes>
          <Route element={<Home />} path="/" exact />
          <Route element={<Products />} path="/products" />
          <Route element={<ProtectedRoute />}>
            <Route element={<Cart />} path="/cart" />
            <Route element={<Orders />} path="/orders" />
            <Route element={<AuthorizedRoute />}>
              <Route element={<ProductForm />} path="/addproduct" />
              <Route element={<Category />} path="/categories" />
              <Route element={<UserList />} path="/users" />
            </Route>
            <Route element={<Product />} path="/products/:id" />
            <Route element={<Profile />} path="/profile" />
          </Route>
          <Route element={<LoginForm />} path="/login" />
          <Route element={<RegistrationForm />} path="/register" />
          <Route element={<Unauthorized />} path="/unauthorized" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
