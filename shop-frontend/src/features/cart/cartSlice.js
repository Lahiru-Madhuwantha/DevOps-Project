import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
  },
  reducers: {
    addProduct: (state, action) => {
      //check if the product id is already in the cart
      if (state.data.find((product) => product.id === action.payload.id)) {
        return;
      }
      state.data.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.data = state.data.filter(
        (product) => product.id !== action.payload.id
      );
    },
    //incrementQuantity
    incrementQuantity: (state, action) => {
      const product = state.data.find(
        (product) => product.id === action.payload.id
      );
      product.quantity++;
    },

    //decrementQuantity
    decrementQuantity: (state, action) => {
      const product = state.data.find(
        (product) => product.id === action.payload.id
      );
      if (product.quantity > 1) {
        product.quantity--;
      }
    },

    //clear cart
    clearCart: (state) => {
      state.data = [];
    },
  },
});

export const {
  addProduct,
  removeProduct,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
