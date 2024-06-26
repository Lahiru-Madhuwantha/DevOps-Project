import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrders } from "../../services/orderService";

// Define the async thunk for fetching user data
export const fetchOrders = createAsyncThunk("order/fetctOrders", async () => {
  const response = await getOrders();
  return response.data;
});

// Define the order slice
export const orderSlice = createSlice({
  name: "order",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default orderSlice.reducer;
