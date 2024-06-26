import React, { Component } from "react";
import _ from "lodash";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {getUsers,deleteUser} from "../services/userService"

class Users extends Component {
  state = {
    users: [],
    currentPage: 1,
    pageSize: 10,
  };

  handleDelete = async (user) => {
    //revert back to previous state
    const originalUsers = this.state.users;

    const users = originalUsers.filter((u) => u._id !== user._id);
    this.setState({ users });

    try {
      await deleteUser(user._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This user has already been removed.");

      this.setState({ users: originalUsers });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  async componentDidMount() {
    const { data } = await getUsers();
    this.setState({ users: data });
  }

  render() {
    const { pageSize, currentPage, users: allUsers } = this.state;

    if (allUsers.length === 0) return <p>There are no users in the database.</p>;
    const users = paginate(allUsers, currentPage, pageSize);
    return (
      <div className="row">
        <div className="col">
          <p className="mt-4">Showing {allUsers.length} users in the database.</p>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Registration ID</th>
                <th>Contact No.</th>
                <th>Admin Status</th>
                <th>imgURL</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <Link to={`/users/${user._id}`}>
                      {_.truncate(user.email, { length: 20 })}
                    </Link>
                  </td>
                  <td>{_.truncate(user.firstName, { length: 10 })}</td>
                  <td>{_.truncate(user.lastName, { length: 10 })}</td>
                  <td>{_.truncate(user.registrationID, { length: 10 })}</td>
                  <td>{_.truncate(user.contactNumber, { length: 10 })}</td>
                  <td>{user.isAdmin ? "Admin" : "Customer"}</td>
                  <td>{_.truncate(user.imgURL, { length: 20 })}</td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(user)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              itemsCount={allUsers.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
