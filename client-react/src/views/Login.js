import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPlayer } from '../redux/playerSlice'; // Adjust the import path as needed

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [player, setPlayerName] = useState('');
  const enabled = player !== '';

  const login = () => {
    dispatch(setPlayer(player));
    const query = new URLSearchParams(location.search);
    if (query.get('game')) {
      history.replace(`/game/${query.get('game')}`);
    } else if (query.get('pending')) {
      history.replace(`/pending/${query.get('pending')}`);
    } else {
      history.replace('/');
    }
  };

  const loginKeyListener = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (enabled) login();
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', loginKeyListener);
    return () => {
      window.removeEventListener('keypress', loginKeyListener);
    };
  }, [enabled]);

  return (
    <div>
      <h1>Login</h1>
      <div>
        Username: 
        <input 
          value={player} 
          onChange={(e) => setPlayerName(e.target.value)} 
        /> 
        <button disabled={!enabled} onClick={login}>Login</button>
      </div>
    </div>
  );
};

export default Login;