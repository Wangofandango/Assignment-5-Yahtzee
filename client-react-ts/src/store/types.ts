import * as Y from "models/src/model/yahtzee.game";

export type IndexedYahtzee = Readonly<
  Omit<Y.Yahtzee, "roller"> & { id: number; pending: false }
>;

export type IndexedYahtzeeSpecs = Readonly<
  Y.YahtzeeSpecs & { id: number; pending: true }
>;

export type ConnectionStatus = "connected" | "disconnected" | "connecting";

export type WebSocketMessage = Record<any, any>;

export interface WebSocketState {
  messages: WebSocketMessage[];
  connectionStatus: ConnectionStatus;
  error?: string | null;
}
