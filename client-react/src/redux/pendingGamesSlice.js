import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../model/api';

export const fetchPendingGame = createAsyncThunk(
  'pendingGames/fetchPendingGame',
  async (gameId) => {
    const response = await api.getPendingGame(gameId);
    return response;
  }
);

const pendingGamesSlice = createSlice({
  name: 'pendingGames',
  initialState: {
    games: {},
  },
  reducers: {
    upsertPendingGame: (state, action) => {
      state.games[action.payload.id] = action.payload;
    },
    removePendingGame: (state, action) => {
      delete state.games[action.payload.id];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPendingGame.fulfilled, (state, action) => {
      state.games[action.payload.id] = action.payload;
    });
  },
});

export const { upsertPendingGame, removePendingGame } = pendingGamesSlice.actions;
export default pendingGamesSlice.reducer;