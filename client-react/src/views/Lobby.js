import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as api from '../model/api'; // Adjust the import path as needed

const Lobby = () => {
  const history = useHistory();
  const player = useSelector((state) => state.player.player);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);

  useEffect(() => {
    if (player === undefined) {
      history.push('/login');
    }
  }, [player, history]);

  const newGame = async () => {
    const pendingGame = await api.new_game(numberOfPlayers, player);
    setTimeout(() => history.push(`/pending/${pendingGame.id}`), 100);
  };

  if (player === undefined) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <h1>Yahtzee!</h1>
      <main>
        <div>
          Number of players: 
          <input 
            type="number" 
            min="1" 
            value={numberOfPlayers} 
            onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
          />
        </div>
        <button onClick={newGame}>New Game</button>
      </main>
    </div>
  );
};

export default Lobby;