import { useAppSelector } from "../store/hooks";
import * as api from "../lib/api";
import { Link, useNavigate } from "react-router";
import React from "react";

export function Lobby() {
  const navigate = useNavigate();
  const player = useAppSelector((state) => state.player.username);

  const pendingGames = useAppSelector((state) => state.pendingGames);
  const ongoingGames = useAppSelector((state) => state.ongoingGames);

  const [numberOfPlayers, setNumberOfPlayers] = React.useState(2);

  const handleNewGame = async () => {
    if (!player) return;
    const game = await api.new_game(numberOfPlayers, player);
    navigate(`/pending/${game.id}`);
  };

  return (
    <div>
      <h1>Yahtzee!</h1>
      {!!player && (
        <main>
          Number of players:{" "}
          <input
            min="1"
            type="number"
            value={numberOfPlayers}
            onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
          />
          <button onClick={handleNewGame}>New Game</button>
        </main>
      )}
      <h2>Pending Games</h2>
      {pendingGames.map((game) => (
        <Link
          key={game.id}
          to={`/pending/${game.id}`}
          style={{ display: "block" }}
        >
          Game #{game.id}
        </Link>
      ))}
      <h2>Ongoing Games</h2>
      {ongoingGames.map((game) => (
        <Link
          key={game.id}
          to={`/game/${game.id}`}
          style={{ display: "block" }}
        >
          Game #{game.id}
        </Link>
      ))}
    </div>
  );
}
