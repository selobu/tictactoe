import { useMemo } from 'react';

export default function Sparkles() {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 12,
      size: 2 + Math.random() * 3,
    })),
  []);

  return (
    <div className="sparkles-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: ['#ffd200', '#f7971e', '#ff6b6b', '#48dbfb', '#55efc4'][i % 5],
          }}
        />
      ))}
    </div>
  );
}
