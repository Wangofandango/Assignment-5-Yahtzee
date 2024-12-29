import React, { useMemo } from "react";
import * as api from "../model/api";
import {
  lower_section_keys,
  lower_section_slots,
  sum_upper,
  total_upper,
  upper_section_slots,
  type LowerSectionKey,
} from "models/src/model/yahtzee.score";
import { die_values, isDieValue, type DieValue } from "models/src/model/dice";
import { scores } from "models/src/model/yahtzee.game";
import { score } from "models/src/model/yahtzee.slots";
import type { IndexedYahtzee } from "@/model/game";

interface ScoreCardProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ game, player, enabled }) => {
  const players = useMemo(() => game.players, [game.players]);
  const upperSections = useMemo(
    () => game.upper_sections,
    [game.upper_sections]
  );
  const lowerSections = useMemo(
    () => game.lower_sections,
    [game.lower_sections]
  );

  const register = (key: DieValue | LowerSectionKey) => {
    if (enabled) {
      api.register(game, key, player);
    }
  };

  const isActive = (p: string) => {
    return game.players[game.playerInTurn] === player && player === p;
  };

  const playerScores = (
    key: DieValue | LowerSectionKey
  ): { player: string, score: number | undefined }[] => {
    if (isDieValue(key)) {
      return players.map((p, i) => ({
        player: p,
        score: upperSections[i].scores[key],
      }));
    } else {
      return players.map((p, i) => ({
        player: p,
        score: lowerSections[i].scores[key],
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

  return (
    <div>
      {/* Render the scorecard UI here */}
      {/* Example: */}
      <div>
        {players.map((p, index) => (
          <div key={index}>
            <h3>{p}</h3>
            <div>Upper Section Scores: {upperSections[index].scores}</div>
            <div>Lower Section Scores: {lowerSections[index].scores}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCard;
