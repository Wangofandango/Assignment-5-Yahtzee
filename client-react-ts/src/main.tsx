import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./routes/login.tsx";
import { ProtectedRoute } from "./components/protected-route.tsx";
import { Lobby } from "./routes/lobby.tsx";
import { useAppDispatch } from "./store/hooks.ts";
import React from "react";
import { fetchOngoingGames, fetchPendingGames } from "./store/thunks.ts";
import { WebSocketService } from "./store/websocket-service.ts";
import { Game } from "./routes/game.tsx";
import { Pending } from "./routes/pending.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SetupStore>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              index
              element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pending/:gameId"
              element={
                <ProtectedRoute>
                  <Pending />
                </ProtectedRoute>
              }
            />

            <Route
              path="/game/:gameId"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SetupStore>
    </Provider>
  </StrictMode>
);

const websocketService = new WebSocketService(store);

function SetupStore({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchOngoingGames());
    dispatch(fetchPendingGames());

    const subscription = websocketService
      .connect("ws://localhost:9090/publish")
      .subscribe();

    return () => {
      subscription.unsubscribe();
      websocketService.disconnect();
    };
  }, []);

  return children;
}
