import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Lobby from "./views/Lobby";
import Login from "./views/Login";
import Game from "./views/Game";
import Pending from "./views/Pending";
import {
  fetchGames,
  fetchPendingGames,
  upsertOngoingGame,
  upsertPendingGame,
  removePendingGame,
} from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player.player);
  const ongoingGames = useSelector((state) => state.ongoingGames.games);
  const pendingGames = useSelector((state) => state.pendingGames.games);

  const isParticipant = (game) => game.players.includes(player ?? "");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9090/publish");
    ws.onopen = () => ws.send(JSON.stringify({ type: "subscribe" }));
    ws.onmessage = ({ data: gameJSON }) => {
      const game = JSON.parse(gameJSON);
      if (game.pending) {
        dispatch(upsertPendingGame(game));
      } else {
        dispatch(upsertOngoingGame(game));
        dispatch(removePendingGame(game));
      }
    };
    return () => {
      ws.send(JSON.stringify({ type: "unsubscribe" }));
      ws.close();
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const games = await fetchGames();
      games.forEach((game) => dispatch(upsertOngoingGame(game)));

      const pendingGames = await fetchPendingGames();
      pendingGames.forEach((game) => dispatch(upsertPendingGame(game)));
    };
    fetchData();
  }, [dispatch]);

  const myOngoingGames = ongoingGames.filter(isParticipant);
  const myPendingGames = pendingGames.filter(isParticipant);
  const otherPendingGames = pendingGames.filter((game) => !isParticipant(game));

  return (
    <Router>
      <div>
        <h1 className="header">Yahtzee!</h1>
        {player && <h2 className="subheader">Welcome player {player}</h2>}
        {player && (
          <nav>
            <Link className="link" to="/">
              Lobby
            </Link>

            <h2>My Games</h2>
            <h3>Ongoing</h3>
            {myOngoingGames.map((game) => (
              <Link key={game.id} className="link" to={`/game/${game.id}`}>
                Game #{game.id}
              </Link>
            ))}

            <h3>Waiting for players</h3>
            {myPendingGames.map((game) => (
              <Link key={game.id} className="link" to={`/pending/${game.id}`}>
                Game #{game.id}
              </Link>
            ))}

            <h2>Available Games</h2>
            {otherPendingGames.map((game) => (
              <Link key={game.id} className="link" to={`/pending/${game.id}`}>
                Game #{game.id}
              </Link>
            ))}
          </nav>
        )}
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/pending/:id" element={<Pending />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
