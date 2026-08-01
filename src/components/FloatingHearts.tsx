import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Heart {
  id: number;
  x: number; // percentage
  size: number; // px
  duration: number; // sec
  delay: number; // sec
  opacity: number;
}

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generatedHearts: Heart[] = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.random() * 96,
      size: Math.floor(Math.random() * 16) + 12, // 12px to 28px
      duration: Math.random() * 12 + 10, // 10s to 22s
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.2,
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '105vh', opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, heart.opacity, heart.opacity, 0],
            scale: [0.6, 1, 1.1, 0.8],
            rotate: [0, 15, -15, 20],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
          }}
          className="select-none text-rose-400/50 drop-shadow-sm"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};
