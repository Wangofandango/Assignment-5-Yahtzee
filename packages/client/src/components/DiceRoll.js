import React, { useState, useEffect, useMemo } from "react";
import * as api from "../model/api";
import type { IndexedYahtzee } from "@/model/game";

interface DiceRollProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}

const DiceRoll: React.FC<DiceRollProps> = ({ game, player, enabled }) => {
  const [held, setHeld] = useState([false, false, false, false, false]);

  const rerollEnabled = useMemo(
    () => game && game.rolls_left > 0 && enabled,
    [game, enabled]
  );

  useEffect(() => {
    if (!rerollEnabled) {
      setHeld([false, false, false, false, false]);
    }
  }, [rerollEnabled]);

  const reroll = async () => {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined);
    await api.reroll(game, heldIndices, player);
  };

  return (
    <div className="dice">
      {!enabled && (
        <div className="diceheader">
          {game.players[game.playerInTurn]} is playing
        </div>
      )}
      <div className="die"></div>
      {game.roll.map((d, i) => (
        <div key={i} className={`die die${d}`}>
          {d}
        </div>
      ))}
      <div className="caption">{enabled && rerollEnabled ? "Hold:" : ""}</div>
      {enabled &&
        rerollEnabled &&
        game.roll.map((_, i) => (
          <input
            key={i}
            type="checkbox"
            checked={held[i]}
            onChange={() => {
              const newHeld = [...held];
              newHeld[i] = !newHeld[i];
              setHeld(newHeld);
            }}
          />
        ))}
      {enabled && rerollEnabled && (
        <div className="reroll">
          <button onClick={reroll}>Re-roll</button>
        </div>
      )}
    </div>
  );
};

export default DiceRoll;
