import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPlayer } from '../redux/playerSlice'; // Ensure this file exists

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [player, setPlayerName] = useState('');
  const enabled = player !== '';

  const login = React.useCallback(() => {
    dispatch(setPlayer(player));
    const query = new URLSearchParams(location.search);
    if (query.get('game')) {
      navigate(`/game/${query.get('game')}`);
    } else if (query.get('pending')) {
      navigate(`/pending/${query.get('pending')}`);
    } else {
      navigate('/');
    }
  }, [dispatch, player, location.search, navigate]);

  const loginKeyListener = React.useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (enabled) login();
    }
  }, [enabled, login]);

  useEffect(() => {
    window.addEventListener('keypress', loginKeyListener);
    return () => {
      window.removeEventListener('keypress', loginKeyListener);
    };
  }, [loginKeyListener]);

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