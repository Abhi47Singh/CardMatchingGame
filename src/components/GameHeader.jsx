export const GameHeader = ({
  score,
  move,
  onReset,
  soundOn,
  onToggleSound,
}) => {
  return (
    <div className="game-header">
      <h1>🎮 Meomery Card Game</h1>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Score:</span>{" "}
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves:</span>{" "}
          <span className="stat-value">{move}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="reset-btn" onClick={onReset}>
          New Game
        </button>
        <button
          className="sound-btn"
          onClick={onToggleSound}
          aria-pressed={!soundOn}
          title={soundOn ? "Mute sounds" : "Unmute sounds"}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>
    </div>
  );
};
