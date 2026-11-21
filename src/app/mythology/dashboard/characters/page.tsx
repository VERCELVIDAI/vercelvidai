'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, Trash2 } from 'lucide-react';
import { MythCharacter } from '@/lib/mythology/types';

export default function MythologyCharactersDashboardPage() {
  const [characters, setCharacters] = useState<MythCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mythology/characters')
      .then((res) => res.json())
      .then((data) => {
        if (data.characters) setCharacters(data.characters);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Character Bible Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Persistent character definitions with attributes, attire, and divine weapons reused across all scenes.
          </p>
        </div>

        <a
          href="/mythology/studio"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Character</span>
        </a>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium">
          Loading characters...
        </div>
      ) : characters.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2 bg-white dark:bg-slate-900">
          <Shield className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No registered characters yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add characters in the studio to ensure Lord Rama, Krishna, or Hanuman maintain visual fidelity across episodes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {char.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase">
                  {char.archetype}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                <strong className="text-slate-700 dark:text-slate-300">Appearance:</strong> {char.appearance}
              </p>

              {char.attire && (
                <p className="text-xs text-slate-500 line-clamp-2">
                  <strong className="text-slate-600 dark:text-slate-400">Attire:</strong> {char.attire}
                </p>
              )}

              {char.weaponOrVahana && (
                <p className="text-xs text-slate-500 line-clamp-1">
                  <strong className="text-slate-600 dark:text-slate-400">Attributes:</strong> {char.weaponOrVahana}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
