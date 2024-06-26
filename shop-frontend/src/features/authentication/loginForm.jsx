import React, { useState } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../../images/traditional-food-feat.jpg";
import shoplabel from "../../images/shop-label.png";
import { login } from "../../services/authService";
import { useDispatch } from "react-redux";
import { setUserData } from "./authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    login(email, password)
      .then((response) => {
        setLoading(false);

        //set the user data in the redux store
        dispatch(setUserData(response));

        // Redirect to the products page
        navigate("/");
      })
      .catch((err) => {
        console.log("error", err);
        setLoading(false);
        setError(err);
      });
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid g-0">
      <div className="row g-0">
        <div className="col-7 vh-100 thumbnail text-center">
          <img
            className="image-fluid"
            src={loginBg}
            alt=""
            width="100%"
            height="100%"
          />
          <h1 className="caption"> Online Cafetaria </h1>
          <img src={shoplabel} className="shop-label" alt="" height="100%" />
        </div>
        <div className="col-5 text-center">
          <h1 className="mt-5 mb-5">Login</h1>
          <div className="d-flex justify-content-center">
            <GoogleButton onClick={handleGoogleLogin} />
          </div>

          <div class="divider d-flex justify-content-center mt-5">
            <hr width="200px" />
            <p className=" fw-bold mx-3 mb-0 text-muted">OR</p>
            <hr width="200px" />
          </div>
          <form className="px-4 ml-4" onSubmit={handleSubmit}>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={handleEmailChange}
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group my-3">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
            </div>
            <button type="submit" class="btn btn-primary">
              Login
            </button>
          </form>
          <p className="mt-5">Don't have an account ?</p>
          <Link className="navbar-brand underline-text" to="/register">
            SIGN UP NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
