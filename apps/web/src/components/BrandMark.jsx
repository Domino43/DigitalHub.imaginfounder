import React from 'react';
import { Link } from 'react-router-dom';

const BrandMark = ({ showWordmark = true, compact = false }) => (
  <Link to="/" className="flex items-center gap-2.5 min-w-0">
    <img
      src="/logo.png"
      alt="DigitalHub focus mark"
      className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl object-cover border border-border`}
    />
    {showWordmark && (
      <span className="min-w-0">
        <span className="block text-lg font-semibold leading-none" style={{letterSpacing: '-0.02em'}}>
          DigitalHub
        </span>
        <span className="block text-xs text-muted-foreground mt-1 leading-none">
          ADHD-friendly
        </span>
      </span>
    )}
  </Link>
);

export default BrandMark;
