import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { catchError, tap, retry } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Store } from "@reduxjs/toolkit";
import { WebSocketMessage } from "./types";
import {
  connectionStatusChanged,
  messageReceived,
} from "./slices/websocket-slice";

export class WebSocketService {
  private socket: WebSocketSubject<WebSocketMessage> | null = null;
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public connect(url: string): Observable<WebSocketMessage | null> {
    this.socket = webSocket<WebSocketMessage>({
      url,
      openObserver: {
        next: () => {
          this.store.dispatch(connectionStatusChanged("connected"));
          this.send({ type: "subscribe" });
        },
      },
      closingObserver: {
        next: () => {
          this.send({ type: "unsubscribe" });
        },
      },
      closeObserver: {
        next: () => {
          this.store.dispatch(connectionStatusChanged("disconnected"));
        },
      },
    });

    return this.socket.pipe(
      tap((message) => {
        this.store.dispatch(messageReceived(message));
      }),
      retry({
        delay: 5000,
        count: 3,
      }),
      catchError((error: Error) => {
        console.error("WebSocket error:", error);
        return of(null);
      })
    );
  }

  public send(message: WebSocketMessage): void {
    if (this.socket) {
      this.socket.next(message);
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.complete();
    }
  }
}
