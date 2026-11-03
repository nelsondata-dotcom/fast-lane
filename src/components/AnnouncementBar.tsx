import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.announcementBanner) return null;

  return (
    <div className="bg-stone-900 text-stone-100 dark:bg-stone-900 dark:text-stone-200 text-xs py-2 px-4 relative z-40 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcementBanner}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-stone-100 p-0.5 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
