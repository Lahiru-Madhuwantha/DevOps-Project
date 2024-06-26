import HTTP from "./httpService";

export async function getCategories() {
  const response = await HTTP.get("/categories");
  return response;
}
