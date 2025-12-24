
import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snow"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animation: `snowfall ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
