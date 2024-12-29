import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../model/api';

export const fetchOngoingGame = createAsyncThunk(
  'ongoingGames/fetchOngoingGame',
  async (gameId) => {
    const response = await api.getOngoingGame(gameId);
    return response;
  }
);

const ongoingGamesSlice = createSlice({
  name: 'ongoingGames',
  initialState: {
    games: {},
  },
  reducers: {
    upsertOngoingGame: (state, action) => {
      state.games[action.payload.id] = action.payload;
    },
    removeOngoingGame: (state, action) => {
      delete state.games[action.payload.id];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOngoingGame.fulfilled, (state, action) => {
      state.games[action.payload.id] = action.payload;
    });
  },
});

export const { upsertOngoingGame, removeOngoingGame } = ongoingGamesSlice.actions;
export default ongoingGamesSlice.reducer;