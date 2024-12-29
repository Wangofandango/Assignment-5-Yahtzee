import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPlayer } from "../store/slices/player-slice";
import { useNavigate, useSearchParams } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.player.username);
  const [username, setUsername] = React.useState("");

  const handleLogin = () => {
    dispatch(setPlayer(username));

    const game = searchParams.get("game");
    if (game) {
      return navigate(`/game/${game}`);
    }

    const pending = searchParams.get("pending");
    if (pending) {
      return navigate(`/pending/${pending}`);
    }

    navigate("/");
  };

  return (
    <div>
      <h1>Login</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleLogin} disabled={!!player}>
        Login
      </button>
    </div>
  );
}
