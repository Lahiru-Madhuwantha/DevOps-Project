import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { saveProduct } from "../../services/productService";
import { fetchProducts } from "./productSlice";

export default function ProductForm() {
  const [product, setProduct] = useState({
    productName: "",
    unitPrice: 0,
    categoryId: "",
    numberInStock: 0,
  });
  const categories = useSelector((state) => state.category.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct(product).then((response) => {
      if (response.status === 201) {
        setProduct({
          productName: "",
          unitPrice: 0,
          categoryId: "",
          numberInStock: 0,
        });
        dispatch(fetchProducts());
        navigate("/products");
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                name="productName"
                value={product.productName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                name="unitPrice"
                value={product.unitPrice}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                name="numberInStock"
                value={product.numberInStock}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
              >
                <option>Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
