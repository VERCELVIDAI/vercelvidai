'use client';

import React from 'react';
import { AnimatedVideoStudio } from '@/components/animated-video/AnimatedVideoStudio';

export default function MythologyDashboardPage() {
  return (
    <div className="space-y-6">
      <AnimatedVideoStudio initialStyleId="mythology" />
    </div>
  );
}