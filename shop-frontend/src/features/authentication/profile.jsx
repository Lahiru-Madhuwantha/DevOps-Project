import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateUser } from "../../services/userService";
import Spinner from "react-bootstrap/Spinner";
import { fetchUserData } from "./authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.data);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if any field is empty
    if (!firstName || !lastName || !email) {
      setError("All fields are required");
      return;
    }

    // chack the updated values are same as the old values
    if (
      firstName === user.firstName &&
      lastName === user.lastName &&
      email === user.email
    ) {
      setError("No changes made");
      return;
    }

    // Update the user data
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(user._id, {
        firstName,
        lastName,
        email,
      });
      setLoading(false);
      if (response.status === 200) {
        toast.success("User updated successfully");

        // update the user data in redux store
        dispatch(fetchUserData());

        setDisabled(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  if (error) {
    toast.error(error);
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3 mt-5">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setDisabled(false);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setDisabled(false);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setDisabled(false);
          }}
        />
      </Form.Group>
      <Form.Group className="position-relative mb-3">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control type="file" required name="file" />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isDisabled}>
        Update
      </Button>

      {loading && <Spinner animation="border" role="status" />}
    </Form>
  );
}
