import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../lib/api";

export const fetchOngoingGames = createAsyncThunk("games", api.games);

export const fetchPendingGames = createAsyncThunk(
  "pendingGames",
  api.pending_games
);
