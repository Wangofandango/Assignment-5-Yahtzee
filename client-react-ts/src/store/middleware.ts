import { Middleware } from "@reduxjs/toolkit";
import { websocketSlice } from "./slices/websocket-slice";
import { ongoingGamesSlice } from "./slices/ongoing-games-slice";
import { IndexedYahtzee, IndexedYahtzeeSpecs } from "./types";
import { pendingGamesSlice } from "./slices/pending-games-slice";

export const gameSyncMiddleware: Middleware = (store) => (next) => (action) => {
  if (websocketSlice.actions.messageReceived.match(action)) {
    const message = action.payload;

    if (message.id !== undefined) {
      const game = message as IndexedYahtzee | IndexedYahtzeeSpecs;

      if (game.pending) {
        console.log("Upserting pending game", game);
        store.dispatch(pendingGamesSlice.actions.upsert(game));
      } else {
        store.dispatch(ongoingGamesSlice.actions.upsert(game));
        store.dispatch(pendingGamesSlice.actions.remove(game.id));
      }
    } else {
      console.error("Received game without id", message);
    }
  }

  return next(action);
};
