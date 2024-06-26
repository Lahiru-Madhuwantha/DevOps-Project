import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useNavigate } from "react-router-dom";
import Placeholder from "react-bootstrap/Placeholder";
import { addProduct } from "../cart/cartSlice";
import Dropdown from "react-bootstrap/Dropdown";

export default function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState({
    id: "All",
    name: "All",
  });
  const { data, loading, error } = useSelector((state) => state.product);
  const searchText = useSelector((state) => state.common.searchItem);
  const categories = useSelector((state) => state.category.data);
  const user = useSelector((state) => state.auth.data);

  const dispatch = useDispatch();

  const handleAddToCart = (id) => {
    //dispatch addProduct action

    dispatch(addProduct({ id: id, quantity: 1 }));
  };

  const fillteredData = useMemo(() => {
    let tempData = data;
    if (selectedCategory.name !== "All") {
      tempData = tempData.filter(
        (product) => product.categoryId === selectedCategory.id
      );
    }
    if (searchText) {
      tempData = tempData.filter((product) =>
        product.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return tempData;
  }, [data, searchText, selectedCategory]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  if (loading)
    return (
      //return 10 no of placeholders
      <Row>
        {[...Array(20)].map((_, index) => (
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder.Button variant="primary" xs={6} />
            </Card.Body>
          </Card>
        ))}
      </Row>
    );
  if (error) return <h1>{error}</h1>;

  if (fillteredData.length === 0) {
    return (
      <>
        <h2>Sort by: </h2>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedCategory.name}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setSelectedCategory({ id: "All", name: "All" });
              }}
            >
              All
            </Dropdown.Item>
            {categories.map((category) => (
              <Dropdown.Item
                key={category._id}
                onClick={() => {
                  setSelectedCategory({
                    id: category._id,
                    name: category.name,
                  });
                }}
              >
                {category.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <h1>No products found</h1>;
      </>
    );
  }

  return (
    <Row>
      <Row>
        <Col>
          <h2>Sort by: </h2>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedCategory.name}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setSelectedCategory({ id: "All", name: "All" });
                }}
              >
                All
              </Dropdown.Item>
              {categories.map((category) => (
                <Dropdown.Item
                  key={category._id}
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                >
                  {category.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          {user.isAdmin && (
            <Button variant="primary" onClick={() => navigate("/addproduct")}>
              Add new product
            </Button>
          )}
        </Col>
      </Row>
      {fillteredData.length < data.length && (
        <h1>Showing results for {searchText}</h1>
      )}
      {fillteredData &&
        fillteredData.map((product) => (
          <Col key={product._id} className="d-flex">
            <Card style={{ width: "18rem" }} className="my-3">
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Card.Text>Price: {product.unitPrice}</Card.Text>
                <Card.Text>Amount: {product.numberInStock}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    navigate(`/products/${product._id}`);
                  }}
                >
                  More info
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleAddToCart(product._id);
                  }}
                >
                  Add to cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
  );
}
