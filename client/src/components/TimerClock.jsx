export default function TimerClock({ remaining, isActive, side }) {
  if (remaining === null) return <div className="timer-clock placeholder" />;

  const seconds = Math.ceil(remaining / 1000);
  const formatted = `${seconds}`;
  const isLow = seconds <= 10;
  const isCritical = seconds <= 5;

  const circumference = 2 * Math.PI * 24;
  const progress = remaining / 30000;
  const offset = circumference * (1 - progress);

  return (
    <div className={`timer-clock ${isActive ? 'active' : ''} ${isLow ? 'low' : ''} ${isCritical ? 'critical' : ''} ${side}`}>
      <svg className="timer-svg" viewBox="0 0 56 56" width="56" height="56">
        <circle
          cx="28" cy="28" r="24"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          className="timer-progress"
          cx="28" cy="28" r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 28 28)"
          style={{
            transition: 'stroke-dashoffset 0.3s ease, color 0.3s ease',
            color: isCritical ? '#ff4757' : isLow ? '#ffa502' : 'var(--color-glow, #ffd200)',
          }}
        />
      </svg>
      <span className="timer-text">{formatted}</span>
    </div>
  );
}
