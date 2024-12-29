import React from "react";
import { IndexedYahtzee } from "../store/types";
import * as api from "../lib/api";
import "./dice-roll.css";

type DiceRollProps = {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
};

const initialHeld = [false, false, false, false, false];

export function DiceRoll({ game, player, enabled }: DiceRollProps) {
  const [held, setHeld] = React.useState(initialHeld);

  const rerollEnabled = game.rolls_left > 0 && enabled;

  React.useEffect(() => {
    if (!rerollEnabled) setHeld(initialHeld);
  }, [rerollEnabled]);

  async function handleReroll() {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined);
    await api.reroll(game, heldIndices, player);
  }

  return (
    <div className="dice">
      {!enabled && (
        <div className="diceheader">
          {game.players[game.playerInTurn]} is playing
        </div>
      )}
      <div className="die"></div>
      {game.roll.map((d, i) => (
        <div key={`${d}-${i}`} className={`die die${d}`}>
          {d}
        </div>
      ))}
      <div className="caption">{enabled && rerollEnabled ? "Hold" : ""}</div>
      {enabled && rerollEnabled && (
        <>
          {game.roll.map((_, i) => (
            <input
              key={i}
              type="checkbox"
              checked={held[i]}
              onChange={(event) => {
                const newHeld = [...held];
                newHeld[i] = event.target.checked;
                setHeld(newHeld);
              }}
            />
          ))}
          <div className="reroll">
            <button onClick={handleReroll}>Re-roll</button>
          </div>
        </>
      )}
    </div>
  );
}
