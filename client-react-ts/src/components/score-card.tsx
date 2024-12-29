import { die_values, DieValue, isDieValue } from "models/src/model/dice";
import { IndexedYahtzee } from "../store/types";
import "./score-card.css";
import {
  lower_section_keys,
  lower_section_slots,
  LowerSectionKey,
  sum_upper,
  total_upper,
  upper_section_slots,
} from "models/src/model/yahtzee.score";
import * as api from "../lib/api";
import { score } from "models/src/model/yahtzee.slots";
import React from "react";
import { scores } from "models/src/model/yahtzee.game";

type ScoreCardProps = {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
};

export function ScoreCard({ game, player, enabled }: ScoreCardProps) {
  const activeClass = (p: string) => (p === player ? "activeplayer" : "");

  const isActive = (p: string) => {
    return game.players[game.playerInTurn] === player && player === p;
  };

  const playerScores = (
    key: DieValue | LowerSectionKey
  ): { player: string; score: number | undefined }[] => {
    if (isDieValue(key)) {
      return game.players.map((p, i) => ({
        player: p,
        score: game.upper_sections[i].scores[key],
      }));
    } else {
      return game.players.map((p, i) => ({
        player: p,
        score: game.lower_sections[i].scores[key],
      }));
    }
  };

  const potentialScore = (key: DieValue | LowerSectionKey) => {
    if (isDieValue(key)) {
      return score(upper_section_slots[key], game.roll);
    } else {
      return score(lower_section_slots[key], game.roll);
    }
  };

  const displayScore = (score: number | undefined): string => {
    if (score === undefined) return "";
    else if (score === 0) return "---";
    else return score.toString();
  };

  const register = (key: DieValue | LowerSectionKey) => {
    if (enabled) {
      api.register(game, key, player);
    }
  };

  return (
    <div className="score">
      <table className="scorecard">
        <tbody>
          <tr className="section_header">
            <td colSpan={game.players.length + 2}>Upper Section</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Target</td>
            {game.players.map((p) => (
              <td key={p} className={activeClass(p)}>
                {p}
              </td>
            ))}
          </tr>
          {die_values.map((value) => (
            <tr key={value}>
              <td>{value}s</td>
              <td>{3 * value}</td>
              {playerScores(value).map(({ player, score }) => (
                <React.Fragment key={player}>
                  {isActive(player) && score === undefined ? (
                    <td
                      className="clickable potential"
                      onClick={() => {
                        register(value);
                      }}
                    >
                      {displayScore(potentialScore(value))}
                    </td>
                  ) : (
                    <td className={isActive(player) ? "activeplayer" : ""}>
                      {displayScore(score)}
                    </td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
          <tr>
            <td>Sum</td>
            <td>63</td>
            {game.players.map((p, i) => (
              <td key={p} className={activeClass(p)}>
                {sum_upper(game.upper_sections[i].scores)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Bonus</td>
            <td>50</td>
            {game.players.map((p, i) => (
              <td key={p} className={activeClass(p)}>
                {displayScore(game.upper_sections[i].bonus)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            {game.players.map((p, i) => (
              <td key={p} className={activeClass(p)}>
                {total_upper(game.upper_sections[i])}
              </td>
            ))}
          </tr>
          <tr className="section_header">
            <td colSpan={game.players.length + 2}>Lower Section</td>
          </tr>
          {lower_section_keys.map((key) => (
            <tr key={key}>
              <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
              <td></td>
              {playerScores(key).map(({ player, score }) => (
                <React.Fragment key={player}>
                  {isActive(player) && score === undefined ? (
                    <td
                      className="clickable potential"
                      onClick={() => {
                        register(key);
                      }}
                    >
                      {displayScore(potentialScore(key))}
                    </td>
                  ) : (
                    <td className={isActive(player) ? "activeplayer" : ""}>
                      {displayScore(score)}
                    </td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td></td>
            {game.players.map((p, i) => (
              <td key={p} className={activeClass(p)}>
                {scores(game)[i]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
