import { combineSlices } from "@reduxjs/toolkit";
import { websocketSlice } from "./websocket-slice";
import { ongoingGamesSlice } from "./ongoing-games-slice";
import { pendingGamesSlice } from "./pending-games-slice";
import { playerSlice } from "./player-slice";

export const rootReducer = combineSlices(
  websocketSlice,
  ongoingGamesSlice,
  pendingGamesSlice,
  playerSlice
);
