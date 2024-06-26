import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "./orderSlice";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  if (error) {
    return <h1> {error} </h1>;
  }
  if (loading) {
    return <h1> loading .....</h1>;
  }

  return(
    <Row>
      {data &&
        data.map((order) => (
          <Col key={order._id} className="d-flex">
            <Card style={{ width: "18rem" }} className="my-3">
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>{order._id}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Card.Text>Price: {order.quantity}</Card.Text>
                <Card.Text>Amount: {order.totalCost}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate(`/products/${order._id}`);
                  }}
                >
                  More info
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
    )
  
}
