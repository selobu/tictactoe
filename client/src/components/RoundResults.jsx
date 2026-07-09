import AvatarDisplay from './AvatarDisplay';

export default function RoundResults({ round, pairs, advanced, players }) {
  const getPlayerName = (id) => {
    const p = players?.find(p2 => p2.id === id);
    return p?.name || 'Unknown';
  };
  const getPlayerAvatar = (id) => {
    const p = players?.find(p2 => p2.id === id);
    return p?.avatar || 'mario';
  };

  return (
    <div className="round-results">
      <h2 className="round-results-title">Round {round} Results</h2>
      <div className="round-matchups">
        {pairs.map((pair, i) => {
          const p1 = pair.player1;
          const p2 = pair.player2;
          if (pair.bye) {
            return (
              <div key={i} className="round-matchup bye">
                <div className="matchup-players">
                  <span className="matchup-avatar"><AvatarDisplay character={getPlayerAvatar(p1.id)} size={28} /></span>
                  <span className="matchup-name">{p1.name}</span>
                </div>
                <span className="matchup-score bye-label">BYE</span>
                <span className="matchup-status">auto-advances</span>
              </div>
            );
          }
          if (!p1 || !p2) return null;
          const p1Win = pair.winnerId === p1.id;
          const p2Win = pair.winnerId === p2.id;
          return (
            <div key={i} className={`round-matchup ${pair.winnerId ? 'played' : 'pending'}`}>
              <div className={`matchup-players ${p1Win ? 'winner' : ''}`}>
                <span className="matchup-avatar"><AvatarDisplay character={getPlayerAvatar(p1.id)} size={28} /></span>
                <span className="matchup-name">{p1.name}</span>
                <span className="matchup-score">{pair.p1wins}</span>
              </div>
              <span className="matchup-vs">vs</span>
              <div className={`matchup-players ${p2Win ? 'winner' : ''}`}>
                <span className="matchup-avatar"><AvatarDisplay character={getPlayerAvatar(p2.id)} size={28} /></span>
                <span className="matchup-name">{p2.name}</span>
                <span className="matchup-score">{pair.p2wins}</span>
              </div>
              {!pair.winnerId && <span className="matchup-status pending-label">pending</span>}
              {pair.winnerId && <span className="matchup-status result-label">complete</span>}
            </div>
          );
        })}
      </div>
      <div className="round-advanced">
        <h3>Advanced to Round {round + 1}</h3>
        <div className="advanced-list">
          {advanced.map(p => (
            <div key={p.id} className="advanced-player">
              <span className="advanced-avatar"><AvatarDisplay character={p.avatar} size={28} /></span>
              <span className="advanced-name">{p.name}</span>
              <span className="advanced-coins">{p.coins ?? 0} 🪙</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
