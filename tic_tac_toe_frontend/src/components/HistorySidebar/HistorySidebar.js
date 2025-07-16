import React from "react";
import "./HistorySidebar.css";

/**
 * Sidebar for displaying user's game history.
 * Props:
 *   - history: Array of {id, is_over, winner_id, created_at}
 *   - selectedGameId: integer or null
 *   - onSelectGame: function(gameId)
 */
// PUBLIC_INTERFACE
function HistorySidebar({ history, selectedGameId, onSelectGame }) {
  return (
    <aside className="history-sidebar">
      <h3>My Game History</h3>
      <ul className="game-history-list">
        {history.length === 0 ? (
          <li>No games played yet.</li>
        ) : (
          history.map(game => (
            <li
              key={game.id}
              className={selectedGameId === game.id ? "selected" : ""}
              onClick={() => onSelectGame(game.id)}
            >
              Game #{game.id} {game.is_over ? (game.winner_id ? `- Won` : "- Draw") : "- Ongoing"}
              <span className="game-date">{new Date(game.created_at).toLocaleString()}</span>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

export default HistorySidebar;
