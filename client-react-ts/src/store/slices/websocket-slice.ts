import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionStatus, WebSocketMessage } from "../types";

const initialState = {
  messages: [] as WebSocketMessage[],
  connectionStatus: "disconnected" as ConnectionStatus,
};

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    messageReceived: (state, action: PayloadAction<WebSocketMessage>) => {
      state.messages.push(action.payload);
      console.log({ message: action.payload });
    },
    connectionStatusChanged: (
      state,
      action: PayloadAction<ConnectionStatus>
    ) => {
      state.connectionStatus = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { messageReceived, connectionStatusChanged, clearMessages } =
  websocketSlice.actions;
export default websocketSlice.reducer;
