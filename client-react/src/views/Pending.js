import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../model/api';
import { fetchPendingGame } from '../redux/pendingGamesSlice';
import { fetchOngoingGame } from '../redux/ongoingGamesSlice';

const Pending = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player.player);
  const pendingGame = useSelector((state) => state.pendingGames.games[id]);
  const ongoingGame = useSelector((state) => state.ongoingGames.games[id]);

  const [gameId, setGameId] = useState(parseInt(id));

  useEffect(() => {
    setGameId(parseInt(id));
  }, [id]);

  useEffect(() => {
    if (player === undefined) {
      navigate('/login');
    } else {
      dispatch(fetchPendingGame(gameId));
    }
  }, [player, gameId, navigate, dispatch]);

  useEffect(() => {
    if (!pendingGame && ongoingGame) {
      navigate(`/game/${gameId}`);
    } else if (!pendingGame && !ongoingGame) {
      navigate('/');
    }
  }, [pendingGame, ongoingGame, gameId, navigate]);

  const canJoin = useMemo(() => {
    return pendingGame && player && !pendingGame.players.includes(player);
  }, [pendingGame, player]);

  const join = () => {
    if (pendingGame && player && canJoin) {
      api.join(pendingGame, player);
    }
  };

  if (player === undefined) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <h1>Pending Game {gameId}</h1>
      {pendingGame ? (
        <div>
          <div>Players:</div>
          <ul>
            {pendingGame.players.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ul>
          {canJoin && <button onClick={join}>Join Game</button>}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Pending;