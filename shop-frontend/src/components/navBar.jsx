import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../features/authentication/authSlice";
import Badge from "react-bootstrap/Badge";
import { setSearchItem } from "../features/common/commonSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.data);
  const cart = useSelector((state) => state.cart.data);

  //if token is available in the local storage, then the user is logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      //dispatch the fetchUserData action
      dispatch(fetchUserData());
    }
  }, []);

  return (
    <Navbar bg="dark" sticky="top" data-bs-theme="dark">
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigate("/");
          }}
        >
          Cafeteria
        </Navbar.Brand>
        {isUserLoggedIn && (
          <Nav>
            <Nav.Link
              onClick={() => {
                navigate("/products");
              }}
            >
              Products
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                navigate("/orders");
              }}
            >
              Orders
            </Nav.Link>
            {user.isAdmin && (
              <Nav>
                <Nav.Link
                  onClick={() => {
                    navigate("/categories");
                  }}
                >
                  Categories
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/users");
                  }}
                >
                  Users
                </Nav.Link>
              </Nav>
            )}
          </Nav>
        )}
        <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
                onChange={(e) => {
                  dispatch(setSearchItem(e.target.value));
                }}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/cart");
                }}
              >
                Cart <Badge bg="secondary">{cart.length}</Badge>
              </Button>
            </Col>
            <Col className="mx-5" xs="auto">
              {isUserLoggedIn ? (
                <Navbar.Text
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Signed in as: <a>{user.firstName}</a>
                </Navbar.Text>
              ) : (
                <Nav>
                  <Nav.Link
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Signup
                  </Nav.Link>
                </Nav>
              )}
            </Col>
            <Col xs="auto">
              {isUserLoggedIn && (
                <Nav>
                  <Nav.Link
                    href="/"
                    onClick={() => {
                      //logout the user
                      localStorage.removeItem("token");
                    }}
                  >
                    Logout
                  </Nav.Link>
                </Nav>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </Navbar>
  );
}
