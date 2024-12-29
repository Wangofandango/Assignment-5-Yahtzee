import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { reroll as apiReroll } from "@/model/api"; // Adjust the import path as needed

const DiceRoll = ({ game, player, enabled }) => {
  const [held, setHeld] = useState([false, false, false, false, false]);

  const rerollEnabled = game && game.rolls_left > 0 && enabled;

  useEffect(() => {
    if (!rerollEnabled) {
      setHeld([false, false, false, false, false]);
    }
  }, [rerollEnabled]);

  const reroll = async () => {
    const heldIndices = held
      .map((b, i) => (b ? i : undefined))
      .filter((i) => i !== undefined);
    await apiReroll(game, heldIndices, player);
  };

  const handleCheckboxChange = (index) => {
    setHeld((prevHeld) => {
      const newHeld = [...prevHeld];
      newHeld[index] = !newHeld[index];
      return newHeld;
    });
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
            onChange={() => handleCheckboxChange(i)}
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

DiceRoll.propTypes = {
  game: PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
    playerInTurn: PropTypes.number.isRequired,
    rolls_left: PropTypes.number.isRequired,
    roll: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  player: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

export default DiceRoll;
