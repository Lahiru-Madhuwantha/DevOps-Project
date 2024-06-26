import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { registerUser } from "../../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "./authSlice";

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await registerUser({
        email,
        password,
        firstName,
        lastName,
      });
      console.log(response);
      if (response.status === 201) {
        //store the token in local storage
        localStorage.setItem("token", response.headers["authorization"]);
        toast.success("User registered successfully");
        dispatch(setUserData(response.data));
        navigate("/");
      } else {
        toast.error("User registration failed");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" disabled={loading}>
        Register
      </Button>
    </form>
  );
}
