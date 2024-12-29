import { useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import "./game.css";
import { ScoreCard } from "../components/score-card";
import { is_finished, scores } from "models/src/model/yahtzee.game";
import { DiceRoll } from "../components/dice-roll";

export function Game() {
  const params = useParams<{ gameId: string }>();

  const player = useAppSelector((state) => state.player.username);
  const game = useAppSelector((state) =>
    state.ongoingGames.find((g) => g.id === Number(params.gameId))
  );

  console.log({ player, game, params });

  if (!player || !game) return;

  const enabled = player === game.players[game.playerInTurn];

  const finished = is_finished(game);

  const standings = scores(game)
    .map<[string, number]>((s, i) => [game.players[i], s])
    .sort(([_, score1], [__, score2]) => score2 - score1);

  return (
    <div>
      <div className="meta">
        <h1>Game #{game.id}</h1>
      </div>
      <ScoreCard game={game} player={player} enabled={enabled} />
      <DiceRoll game={game} player={player} enabled={enabled} />
      {finished && (
        <div className="scoreboard">
          <table>
            <thead>
              <tr>
                <td>Player</td>
                <td>Score</td>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr className={row[0] == player ? "current" : undefined}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
