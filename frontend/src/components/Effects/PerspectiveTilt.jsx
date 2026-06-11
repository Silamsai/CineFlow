import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function PerspectiveTilt({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  perspective = 1200,
  ...props
}) {
  const ref = useRef(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -maxTilt;
      const tiltY = ((x - centerX) / centerX) * maxTilt;

      setTransform(
        `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlareStyle({
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        });
      }
    },
    [maxTilt, scale, glare, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('');
    setGlareStyle({});
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ ...glareStyle, transition: 'background 0.1s ease-out' }}
        />
      )}
    </motion.div>
  );
}

export function TiltCard({ children, className = '', ...props }) {
  return (
    <PerspectiveTilt
      className={`rounded-2xl ${className}`}
      maxTilt={10}
      scale={1.01}
      glare={true}
      {...props}
    >
      {children}
    </PerspectiveTilt>
  );
}
