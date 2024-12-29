import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IndexedYahtzeeSpecs } from "../types";
import { fetchPendingGames } from "../thunks";
import { RootState } from "../store";

export const pendingGamesSlice = createSlice({
  name: "pendingGames",
  initialState: [] as IndexedYahtzeeSpecs[],
  reducers: {
    update: (state, action) => {
      const game = action.payload;
      const index = state.findIndex((g) => g.id === game.id);
      if (index > -1) {
        state[index] = game;
      }
    },
    upsert: (state, action: PayloadAction<IndexedYahtzeeSpecs>) => {
      const game = action.payload;
      const index = state.findIndex((g) => g.id === game.id);
      if (index > -1) {
        state[index] = game;
      } else {
        state.push(game);
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      const index = state.findIndex((g) => g.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPendingGames.fulfilled, (state, action) => {
      action.payload.forEach((game) => {
        const index = state.findIndex((g) => g.id === game.id);
        if (index > -1) {
          state[index] = game;
        } else {
          state.push(game);
        }
      });
    });
  },
});

export const selectPendingGame = createSelector(
  (state: RootState) => state.pendingGames,
  (_: RootState, id: number) => id,
  (games, id) => games.find((g) => g.id === id)
);

export const { update, upsert, remove } = pendingGamesSlice.actions;
export default pendingGamesSlice.reducer;
