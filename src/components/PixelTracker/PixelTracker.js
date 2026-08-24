'use client';

import { useEffect } from 'react';
import { event } from '@/lib/pixel';

export default function PixelTracker({ name, data }) {
  useEffect(() => {
    if (name) event(name, data);
  }, [name, data]);
  
  return null;
}
