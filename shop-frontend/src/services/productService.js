import HTTP from "./httpService";

export async function getProducts() {
  return await HTTP.get("/products");
}

export async function getProduct(productId) {
  const response = await HTTP.get(`/products/?id=${productId}`);
  return response;
}

export async function saveProduct(product) {
  const response = await HTTP.post("/products", product);
  return response;
}

export async function deleteProduct(productId) {
  const response = await HTTP.delete(`/products/?id=${productId}`);
  return response;
}

export async function updateProduct(product) {
  const body = {
    productName: product.productName,
    unitPrice: product.unitPrice,
    numberInStock: product.numberInStock,
    categoryId: product.categoryId,
  };
  const response = await HTTP.put(`/products/?id=${product._id}`, body);
  return response;
}
