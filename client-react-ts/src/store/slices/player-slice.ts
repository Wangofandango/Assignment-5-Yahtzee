import { createSlice } from "@reduxjs/toolkit";

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    username: undefined as string | undefined,
  },
  reducers: {
    setPlayer: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;
