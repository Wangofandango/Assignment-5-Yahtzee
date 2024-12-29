import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Lobby from './views/Lobby';
import Login from './views/Login';
import Game from './views/Game';
import Pending from './views/Pending';
import { fetchGames, fetchPendingGames, upsertOngoingGame, upsertPendingGame, removePendingGame } from './redux/actions'; // Adjust the import paths as needed

const App = () => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player.player);
  const ongoingGames = useSelector((state) => state.ongoingGames.games);
  const pendingGames = useSelector((state) => state.pendingGames.games);

  const isParticipant = (game) => game.players.includes(player ?? "");

  const myOngoingGames = ongoingGames.filter((g) => isParticipant(g) && !g.is_finished);
  const myPendingGames = pendingGames.filter(isParticipant);
  const otherPendingGames = pendingGames.filter((g) => !isParticipant(g));

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

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Lobby} />
        <Route path="/login" component={Login} />
        <Route path="/game/:id" component={Game} />
        <Route path="/pending/:id" component={Pending} />
      </Switch>
    </Router>
  );
};

export default App;