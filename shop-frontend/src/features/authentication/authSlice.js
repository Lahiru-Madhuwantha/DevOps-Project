import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser } from "../../services/authService";

// Define the initial state for the user slice
const initialState = {
  data: {},
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Define the async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    const response = await getCurrentUser();
    return response;
  }
);

// Define the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Define the reducer for logging out
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
    },

    // Define the reducer for setting the user data
    setUserData: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions
export const { logout, setUserData } = authSlice.actions;

export default authSlice.reducer;
