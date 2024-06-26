import HTTP from "./httpService";

const apiEndpoint = "/users";

export async function registerUser(user) {
  const response = await HTTP.post(apiEndpoint, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    imgURL: "https://via.placeholder.com/150",
    googleId: "",
  });
  return response;
}
export async function getUsers() {
  const response = await HTTP.get(apiEndpoint);
  return response;
}
export function getUser(userId) {
  return HTTP.get(`${apiEndpoint}/${userId}`);
}
export function deleteUser(userId) {
  return HTTP.delete(`${apiEndpoint}/${userId}`);
}

export async function updateUser(userId, user) {
  const response = await HTTP.put(`${apiEndpoint}/${userId}`, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    imgURL: "https://via.placeholder.com/150",
    googleId: user.email,
  });
  return response;
}
