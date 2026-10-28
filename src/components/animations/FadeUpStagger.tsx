'use client';

import React from 'react';

export interface FadeUpStaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerInterval?: number; // ms cinsinden, varsayılan 80ms
  className?: string;
}

/**
 * FadeUpStagger — Yan yana veya alt alta duran kartları 80ms aralıklarla domino taşı gibi akıtır
 */
export function FadeUpStagger({
  children,
  staggerInterval = 80,
  className = '',
  ...props
}: FadeUpStaggerProps) {
  return (
    <div className={`apple-stagger-group ${className}`} {...props}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            className="apple-reveal"
            style={{ '--stagger-delay': `${idx * staggerInterval}ms` } as React.CSSProperties}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export interface FadeUpItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FadeUpItem — Tekil öğe için Fade-Up / Slide-Up animasyon sarmalayıcısı
 */
export function FadeUpItem({
  children,
  delay = 0,
  className = '',
  ...props
}: FadeUpItemProps) {
  return (
    <div
      className={`apple-reveal ${className}`}
      style={{ '--stagger-delay': `${delay}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
