import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getUser, saveUser } from "../services/userService";

class UserForm extends Form {
  state = {
    data: {
      _id: "",
      firstName: "",
      lastName: "",
      registrationID: "",
      contactNumber: "",
      email: "",
      imgURL: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string().optional(),
    firstName: Joi.string().min(2).max(50).required().label("First Name"),
    lastName: Joi.string().min(2).max(50).required().label("Last Name"),
    registrationID: Joi.string().min(2).max(50).required().label("Reg ID"),
    contactNumber: Joi.string()
      .min(8)
      .max(50)
      .required()
      .label("Contact Number"),
    email: Joi.string().min(5).max(255).required().email().label("Email"),
    imgURL: Joi.string().min(5).max(1024).required(),
    password: Joi.string().min(5).max(50).label("Password").required(),
  };

  doSubmit = async () => {
    console.log("do submit hittt");
    await saveUser(this.state.data);
    this.props.history.push("/users");
  };

  async componentDidMount() {
    try {
      const userId = this.props.match.params.id;
      const { data: user } = await getUser(userId);
      const data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        registrationID: user.registrationID,
        contactNumber: user.contactNumber,
        email: user.email,
        imgURL: user.imgURL,
        password: user.password,
      };
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  render() {
    return (
      <div>
        <h1>Update User Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("firstName", "First Name")}
          {this.renderInput("lastName", "Last Name")}
          {this.renderInput("registrationID", "Registration ID")}
          {this.renderInput("contactNumber", "Contact Number")}
          {this.renderInput("email", "Email")}
          {this.renderInput("imgURL", "Profile Picture")}
          {this.renderInput("password", "New Password", "password")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default UserForm;
