import HTTP from "./httpService";
import { toast } from "react-toastify";

const apiEndpoint = "/auth";

export async function login(email, password) {
  try {
    const response = await HTTP.post(`${apiEndpoint}/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      const { data } = response;
      // Store the token in the local storage
      localStorage.setItem("token", response.headers["authorization"]);
      return data;
    } else if (response.status === 400) {
      toast.error(response.data.message);
      return false;
    }
  } catch (err) {
    toast.error(err.response.data.message);
    return false;
  }
}

export async function loginWithGmail() {
  const { data } = await HTTP.get(`${apiEndpoint}/google/login`);
  return data;
}

export async function logout() {
  await HTTP.post(`${apiEndpoint}/logout`);
}

export async function getCurrentUser() {
  // Get the token from the local storage
  const token = localStorage.getItem("token");

  // If the token is not present, return null
  if (!token) {
    return null;
  } else {
    const response = await HTTP.get(`${apiEndpoint}/me`);
    return response.data;
  }
}
