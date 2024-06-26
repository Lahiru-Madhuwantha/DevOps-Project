import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import orderReducer from "../features/orders/orderSlice";
import authReducer from "../features/authentication/authSlice";
import userReducer from "../features/users/userSlice";
import categoryReducer from "../features/Category/categorySlice";
import cartReducer from "../features/cart/cartSlice";
import commonSlice from "../features/common/commonSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    user: userReducer,
    category: categoryReducer,
    cart: cartReducer,
    common : commonSlice
  },
});

export default store;
