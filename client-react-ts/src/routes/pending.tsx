import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import * as api from "../lib/api";
import { selectPendingGame } from "../store/slices/pending-games-slice";
import React from "react";
import { selectOngoingGame } from "../store/slices/ongoing-games-slice";

export function Pending() {
  const navigate = useNavigate();
  const params = useParams<{ gameId: string }>();

  const player = useAppSelector((state) => state.player.username);
  const game = useAppSelector((state) =>
    selectPendingGame(state, Number(params.gameId))
  );
  const ongoingGame = useAppSelector((state) =>
    selectOngoingGame(state, Number(params.gameId))
  );

  React.useEffect(() => {
    if (!game) {
      if (ongoingGame) {
        navigate(`/game/${params.gameId}`);
      } else {
        navigate("/");
      }
    }
  }, [game]);

  console.log("Found: ", game);

  if (!player || !game) return;

  const canJoin = game.players.indexOf(player) === -1;

  const handleJoin = async () => {
    await api.join(game, player);
  };

  return (
    <div>
      <h1>Game #{params.gameId}</h1>
      <div>Created by: {game.creator}</div>
      <div>Players: {game.players.join(", ")}</div>
      <div>
        Available seats: {(game.number_of_players ?? 2) - game.players.length}
      </div>
      {canJoin && <button onClick={handleJoin}>Join</button>}
    </div>
  );
}
