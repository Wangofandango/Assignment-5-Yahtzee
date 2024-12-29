import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as api from '../model/api';
import {
  lower_section_keys,
  lower_section_slots,
  sum_upper,
  total_upper,
  upper_section_slots,
  isDieValue,
  score,
} from 'models/src/model/yahtzee.score';
import { die_values } from 'models/src/model/dice';

const ScoreCard = ({ game, player, enabled }) => {
  const players = useMemo(() => game.players, [game.players]);
  const upper_sections = useMemo(() => game.upper_sections, [game.upper_sections]);
  const lower_sections = useMemo(() => game.lower_sections, [game.lower_sections]);

  const register = (key) => {
    if (enabled) {
      api.register(game, key, player);
    }
  };

  const isActive = (p) => {
    return game.players[game.playerInTurn] === player && player === p;
  };

  const playerScores = (key) => {
    if (isDieValue(key)) {
      return players.map((p, i) => ({ player: p, score: upper_sections[i].scores[key] }));
    } else {
      return players.map((p, i) => ({ player: p, score: lower_sections[i].scores[key] }));
    }
  };

  const potentialScore = (key) => {
    if (isDieValue(key)) {
      return score(upper_section_slots[key], game.roll);
    } else {
      return score(lower_section_slots[key], game.roll);
    }
  };

  return (
    <div className="scorecard">
      {/* Render your scorecard UI here */}
      {/* Example: */}
      {players.map((p, index) => (
        <div key={index} className={`player ${isActive(p) ? 'active' : ''}`}>
          <h3>{p}</h3>
          {/* Render scores for each player */}
          {die_values.map((key) => (
            <div key={key} className="score">
              <span>{key}</span>
              <span>{playerScores(key).find((ps) => ps.player === p)?.score}</span>
            </div>
          ))}
          {lower_section_keys.map((key) => (
            <div key={key} className="score">
              <span>{key}</span>
              <span>{playerScores(key).find((ps) => ps.player === p)?.score}</span>
            </div>
          ))}
        </div>
      ))}
      {enabled && (
        <div className="potential-scores">
          {die_values.map((key) => (
            <div key={key} className="potential-score">
              <span>{key}</span>
              <span>{potentialScore(key)}</span>
              <button onClick={() => register(key)}>Register</button>
            </div>
          ))}
          {lower_section_keys.map((key) => (
            <div key={key} className="potential-score">
              <span>{key}</span>
              <span>{potentialScore(key)}</span>
              <button onClick={() => register(key)}>Register</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ScoreCard.propTypes = {
  game: PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.string).isRequired,
    playerInTurn: PropTypes.number.isRequired,
    upper_sections: PropTypes.arrayOf(
      PropTypes.shape({
        scores: PropTypes.object.isRequired,
      })
    ).isRequired,
    lower_sections: PropTypes.arrayOf(
      PropTypes.shape({
        scores: PropTypes.object.isRequired,
      })
    ).isRequired,
    roll: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  player: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

export default ScoreCard;