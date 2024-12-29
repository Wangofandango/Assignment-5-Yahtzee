import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { is_finished, scores } from 'models/src/model/yahtzee.game';  
import { fetchOngoingGame } from '../redux/ongoingGamesSlice';

const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player.player);
  const game = useSelector((state) => state.ongoingGames.games[id]);

  const [gameId, setGameId] = useState(parseInt(id));

  useEffect(() => {
    setGameId(parseInt(id));
  }, [id]);

  useEffect(() => {
    if (player === undefined) {
      navigate(`/login?game=${gameId}`);
    } else if (game === undefined) {
      dispatch(fetchOngoingGame(gameId));
    }
  }, [player, game, gameId, navigate, dispatch]);

  const enabled = useMemo(() => {
    return game !== undefined && player === game.players[game.playerInTurn];
  }, [game, player]);

  const finished = useMemo(() => {
    return game === undefined || is_finished(game);
  }, [game]);

  const standings = useMemo(() => {
    if (game === undefined) return [];
    const g = game;
    const standings = scores(g).map((s, i) => [g.players[i], s]);
    standings.sort(([, score1], [, score2]) => score2 - score1);
    return standings;
  }, [game]);

  if (player === undefined) {
    return null; // or a loading spinner
  }

  return (
    <div>
      {finished ? (
        <div>Game Finished</div>
      ) : (
        <div>
          <h1>Game {gameId}</h1>
          <div>Player in Turn: {game.players[game.playerInTurn]}</div>
          <div>Standings:</div>
          <ul>
            {standings.map(([player, score], index) => (
              <li key={index}>
                {player}: {score}
              </li>
            ))}
          </ul>
          {/* Add other game-related UI components here */}
        </div>
      )}
    </div>
  );
};

export default Game;