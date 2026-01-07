// components/ui/QuickBackgroundSwitcher.tsx
"use client";

import { useState } from 'react';
import { useBackground } from '@/lib/backgrounds';
import { BackgroundPicker } from '@/lib/backgrounds';

export function QuickBackgroundSwitcher() {
  const [showPicker, setShowPicker] = useState(false);
  const { currentBackground } = useBackground();

  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        className="fixed bottom-16 right-4 z-50 px-3 py-2 bg-black/20 backdrop-blur rounded-lg text-white text-sm hover:bg-black/30 transition-colors"
        title="Change Background"
      >
        {currentBackground?.name || 'Change Wallpaper'}
      </button>

      <BackgroundPicker
        open={showPicker}
        onOpenChange={setShowPicker}
      />
    </>
  );
}
