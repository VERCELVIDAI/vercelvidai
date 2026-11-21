'use client';

import React, { useState } from 'react';
import {
  Palette,
  Users,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  X,
} from 'lucide-react';
import { MYTH_ART_STYLES } from '@/lib/mythology/constants';
import { MythCharacter } from '@/lib/mythology/types';

interface Step3CharactersProps {
  artStyleId: string;
  characterBible: MythCharacter[];
  onChangeStyle: (styleId: string) => void;
  onUpdateCharacters: (characters: MythCharacter[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Characters({
  artStyleId,
  characterBible,
  onChangeStyle,
  onUpdateCharacters,
  onNext,
  onPrev,
}: Step3CharactersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChar, setNewChar] = useState<Partial<MythCharacter>>({
    name: '',
    culture: 'hindu_epic',
    archetype: 'god',
    appearance: '',
    attire: '',
    weaponOrVahana: '',
    colorPalette: ['#E58A1F', '#1E3A8A'],
  });

  const handleSaveCharacter = () => {
    if (!newChar.name || !newChar.appearance) {
      alert('Please provide character name and appearance.');
      return;
    }

    const created: MythCharacter = {
      id: `char_${Date.now()}`,
      name: newChar.name,
      culture: newChar.culture || 'hindu_epic',
      archetype: newChar.archetype || 'god',
      appearance: newChar.appearance,
      attire: newChar.attire || 'Traditional silk dhoti & ornaments',
      weaponOrVahana: newChar.weaponOrVahana || 'Sacred attributes',
      colorPalette: newChar.colorPalette || ['#E58A1F', '#F59E0B'],
    };

    onUpdateCharacters([...characterBible, created]);
    setIsAddModalOpen(false);
    setNewChar({
      name: '',
      culture: 'hindu_epic',
      archetype: 'god',
      appearance: '',
      attire: '',
      weaponOrVahana: '',
      colorPalette: ['#E58A1F', '#1E3A8A'],
    });
  };

  const handleDeleteCharacter = (id: string) => {
    onUpdateCharacters(characterBible.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            Step 3: Visual Art Style & Character Bible
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Set the aesthetic & lock character consistency
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose an authentic artistic tradition. Characters in the Bible will be seamlessly injected into each scene prompt.
          </p>
        </div>
      </div>

      {/* 7 Art Styles Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-500" />
          Choose Visual Art Style (7 Authentic Presets)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MYTH_ART_STYLES.map((style) => {
            const isSelected = artStyleId === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeStyle(style.id)}
                className={`text-left rounded-2xl border overflow-hidden transition-all cursor-pointer group relative flex flex-col ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50'
                }`}
              >
                {/* Visual Thumbnail Banner */}
                <div className="h-32 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={style.previewImage}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {style.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      {style.badge}
                    </span>
                  )}
                  {isSelected && (
                    <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white/90">
                    {style.era}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {style.name}
                    </h4>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      {style.nameHindi}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Character Bible Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Character Bible ({characterBible.length} Characters Registered)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Characters keep their iconography, colors, and attire consistent across scenes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Character</span>
          </button>
        </div>

        {characterBible.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Shield className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              No custom characters added yet. The AI will generate authentic figures automatically, or you can register key figures.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {characterBible.map((char) => (
              <div
                key={char.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {char.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                      {char.archetype}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCharacter(char.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  <strong className="text-slate-700 dark:text-slate-300">Appearance:</strong> {char.appearance}
                </p>

                {char.weaponOrVahana && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    <strong className="text-slate-600 dark:text-slate-400">Weapon/Vahana:</strong> {char.weaponOrVahana}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Character Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Add to Character Bible
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Character Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newChar.name}
                  onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
                  placeholder="e.g. Lord Rama, Ravana, Bhishma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Archetype
                </label>
                <select
                  value={newChar.archetype}
                  onChange={(e) => setNewChar({ ...newChar, archetype: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs outline-none"
                >
                  <option value="god">Deity / God (भगवान)</option>
                  <option value="avatar">Avatar (अवतार)</option>
                  <option value="warrior">Warrior / King (योद्धा/सम्राट)</option>
                  <option value="sage">Sage / Rishi (ऋषि/तपस्वी)</option>
                  <option value="demon">Demon / Asura (असुर/राक्षस)</option>
                  <option value="devotee">Devotee / Bhakta (भक्त)</option>
                  <option value="creature">Mythic Creature (दिव्य प्राणी)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Physical Appearance <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={newChar.appearance}
                  onChange={(e) => setNewChar({ ...newChar, appearance: e.target.value })}
                  placeholder="e.g. Shyamavarna complexion, compassionate lotus-shaped eyes, noble countenance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Divine Weapon or Vahana
                </label>
                <input
                  type="text"
                  value={newChar.weaponOrVahana}
                  onChange={(e) => setNewChar({ ...newChar, weaponOrVahana: e.target.value })}
                  placeholder="e.g. Kodanda bow, Sudarshana Chakra, Garuda mount"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCharacter}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25"
              >
                Save Character
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Actions */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Visual Generation</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
