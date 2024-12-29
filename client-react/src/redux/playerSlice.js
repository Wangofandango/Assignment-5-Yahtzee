import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    player: undefined,
  },
  reducers: {
    setPlayer: (state, action) => {
      state.player = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;