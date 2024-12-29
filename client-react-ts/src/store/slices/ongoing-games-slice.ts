import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IndexedYahtzee } from "../types";
import { fetchOngoingGames } from "../thunks";
import { RootState } from "../store";

export const ongoingGamesSlice = createSlice({
  name: "ongoingGames",
  initialState: [] as IndexedYahtzee[],
  reducers: {
    update: (state, action: PayloadAction<IndexedYahtzee>) => {
      const index = state.findIndex((g) => g.id === action.payload.id);
      if (index > -1) {
        state[index] = action.payload;
      }
    },
    upsert: (state, action: PayloadAction<IndexedYahtzee>) => {
      const game = action.payload;
      const index = state.findIndex((g) => g.id === game.id);
      if (index > -1) {
        state[index] = game;
      } else {
        state.push(game);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOngoingGames.fulfilled, (state, action) => {
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

export const selectOngoingGame = createSelector(
  (state: RootState) => state.ongoingGames,
  (_: RootState, id: number) => id,
  (games, id) => games.find((g) => g.id === id)
);

export const { update, upsert } = ongoingGamesSlice.actions;
export default ongoingGamesSlice.reducer;
