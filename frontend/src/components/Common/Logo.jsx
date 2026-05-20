import React from 'react';
import logoSvg from '../../assets/logo.svg';

export default function Logo({ className = '', height = 32 }) {
  return (
    <img
      src={logoSvg}
      alt="CineFlow Logo"
      style={{ height: `${height}px` }}
      className={`select-none object-contain ${className}`}
    />
  );
}
