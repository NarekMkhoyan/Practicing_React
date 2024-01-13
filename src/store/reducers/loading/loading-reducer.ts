import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { isLoading: false },
  reducers: {
    setLoadingState: (state, action) => {
      const loading = { isLoading: action.payload };
      return loading;
    },
  },
});

export const { setLoadingState } = loadingSlice.actions;

export default loadingSlice.reducer;
