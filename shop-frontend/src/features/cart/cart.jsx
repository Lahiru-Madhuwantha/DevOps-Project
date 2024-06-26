import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "./cartSlice";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { incrementQuantity, decrementQuantity, clearCart } from "./cartSlice";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { saveOrder } from "../../services/orderService";
import { toast } from 'react-toastify';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = React.useState(0);
  const cart = useSelector((state) => state.cart.data);
  const user = useSelector((state) => state.auth.data);
  const products = useSelector((state) => state.product.data);

  useEffect(() => {
    let total = 0;
    cart.forEach((cartItem) => {
      const product = products.find((product) => product._id === cartItem.id);
      total += product.unitPrice * cartItem.quantity;
    });
    setTotalPrice(total);
  }, [cart]);

  const handlePlaceOrder = () => {
    const order = {
      userId: user._id,
      products: cart.map((cartItem) => ({
        productId: cartItem.id,
        quantity: cartItem.quantity,
      })),
      totalCost: totalPrice,
    };
    saveOrder(order)
      .then((response) => {
        if (response.status === 201) {
          // clear the cart
          dispatch(clearCart());
          toast.success("Order placed successfully");
          navigate("/orders");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveFromCart = (product) => {
    //dispatch removeProduct action

    dispatch(removeProduct(product));
  };

  const handleQuantityIncrement = (cartItem) => {
    //check available quantity is greater than cartItem.quantity
    if (
      products.find((product) => product._id === cartItem.id).numberInStock >
      cartItem.quantity
    ) {
      //dispatch incrementQuantity action
      dispatch(incrementQuantity({ id: cartItem.id }));
    }
  };

  return (
    <Container>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <Row>
          {cart.map((cartItem) => {
            const product = products.find(
              (product) => product._id === cartItem.id
            );
            return (
              <Col key={cartItem.id}>
                <Card style={{ width: "18rem" }} className="my-3">
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text>
                      Price: {product.unitPrice}
                      <br />
                      Available: {product.numberInStock}
                      <br />
                      Quantity: {cartItem.quantity}
                    </Card.Text>

                    <Button
                      variant="primary"
                      onClick={() => {
                        //incrementQuantity
                        handleQuantityIncrement(cartItem);
                      }}
                    >
                      +
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        //decrementQuantity
                        dispatch(decrementQuantity({ id: cartItem.id }));
                      }}
                    >
                      -
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveFromCart(cartItem)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          <h2>Total: ${totalPrice}</h2>
          <br />
          <br />

          <br />
          <br />
          <h2>Shipping Details</h2>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="Phone Number" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Address" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control as="select">
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Paypal</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Row>
      )}
    </Container>
  );
}
