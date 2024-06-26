import HTTP from "./httpService";

const apiEndpoint = "/orders";

export function getOrders() {
  const response = HTTP.get(apiEndpoint);
  return response;
}

export function getorder(orderId) {
  return HTTP.get(`${apiEndpoint}/${orderId}`);
}

export async function saveOrder(order) {
  const response = await HTTP.post(apiEndpoint, order);
  return response;
}

export function deleteOrder(orderId) {
  return HTTP.delete(`${apiEndpoint}/${orderId}`);
}
