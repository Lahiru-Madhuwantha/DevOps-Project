import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "../../services/categoryService";

// Define the async thunk for fetching user data
export const fetchCategories = createAsyncThunk(
  "order/fetctCategories",
  async () => {
    const response = await getCategories();
    return response.data;
  }
);

// Define the category slice
export const categorySlice = createSlice({
  name: "category",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default categorySlice.reducer;
