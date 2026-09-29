'use client'
import { useState } from 'react';
import Image from 'next/image';

export function Logo({ name, logo }: { name: string; logo?: string }) {
  const [error, setError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(name);

  if (logo && !error) {
    return (
      <Image
        src={logo}
        alt={name}
        width={32}
        height={32}
        className="rounded-sm flex-shrink-0 object-contain"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs flex-shrink-0">
      {initials}
    </div>
  );
}
