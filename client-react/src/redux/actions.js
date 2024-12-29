import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../model/api';

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await api.games();
  return response;
});

export const fetchPendingGames = createAsyncThunk('pendingGames/fetchPendingGames', async () => {
  const response = await api.pending_games();
  return response;
});