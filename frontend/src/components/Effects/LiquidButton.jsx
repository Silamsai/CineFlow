import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SHARED_CLASSES = {
  base: 'relative overflow-hidden rounded-full font-bold transition-all duration-500 inline-flex items-center justify-center gap-2 group',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20',
  red: 'bg-gradient-to-r from-[#E50914] via-[#FF2D2D] to-[#B20710] shadow-[0_0_30px_rgba(229,9,20,0.3)] hover:shadow-[0_0_50px_rgba(229,9,20,0.5)]',
  outline: 'border border-white/20 hover:border-white/40 bg-transparent',
};

const SIZES = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
  xl: 'px-12 py-5 text-lg',
};

export default function LiquidButton({
  children,
  variant = 'red',
  size = 'md',
  className = '',
  onClick,
  disabled,
  href,
  ...props
}) {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);

    if (onClick) onClick(e);
  };

  const classes = `
    ${SHARED_CLASSES.base}
    ${SHARED_CLASSES[variant] || SHARED_CLASSES.red}
    ${SIZES[size] || SIZES.md}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      ref={btnRef}
      href={href}
      onClick={handleClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {/* Liquid hover effect */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[liquid_3s_ease-in-out_infinite]" />
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[liquid_3s_ease-in-out_infinite_0.5s]" />
      </span>

      {/* Shimmer border */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100">
        <span className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_linear_infinite]" />
      </span>

      {/* Glow */}
      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cinema-red/0 via-cinema-red/30 to-cinema-red/0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-white/40"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            animation: 'ripple 1s ease-out forwards',
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
        {children}
      </span>
    </Tag>
  );
}

export function LiquidGlassButton({ children, ...props }) {
  return <LiquidButton variant="glass" {...props}>{children}</LiquidButton>;
}

export function LiquidOutlineButton({ children, ...props }) {
  return <LiquidButton variant="outline" {...props}>{children}</LiquidButton>;
}
