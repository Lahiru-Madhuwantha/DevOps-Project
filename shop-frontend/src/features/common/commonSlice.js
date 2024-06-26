import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    searchItem: "",
    selectCategory: "",
  },
  reducers: {
    setSearchItem: (state, action) => {
      state.searchItem = action.payload;
    },
    setSelectCategory: (state, action) => {
      state.selectCategory = action.payload;
    },
  },
});

export const { setSearchItem } = commonSlice.actions;
export default commonSlice.reducer;
