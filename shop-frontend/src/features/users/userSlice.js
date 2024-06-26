import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../../services/userService";

// Define the async thunk for fetching user data
export const fetchUsers = createAsyncThunk(
  "user/fetctUsers",
  async () => {
    const response = await getUser();
    return response.data;
  }
);

// Define the user slice
export const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default fetchUsers.reducer;
