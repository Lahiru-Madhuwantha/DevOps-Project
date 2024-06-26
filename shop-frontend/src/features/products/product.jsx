import React, { useState, useEffect } from "react";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    productName: "",
    unitPrice: 0,
    numberInStock: 0,
    categoryId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(true);
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.data);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setDisableUpdate(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(product)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Product updated successfully");
          navigate("/products");
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleDelete = () => {
    deleteProduct(product._id)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Product deleted successfully");
          navigate("/products");
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  //display product details
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

            <Button variant="primary" type="submit" disabled={disableUpdate}>
              Update
            </Button>
            <Button variant="danger" type="button" onClick={handleDelete}>
              Delete
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
