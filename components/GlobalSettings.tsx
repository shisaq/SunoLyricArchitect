

import React, { useState } from 'react';
import { X, Sparkles, ChevronDown } from 'lucide-react';
import { Language, TagCategory } from '../types';
import { UI_LABELS, SUNO_TAGS } from '../constants';

interface GlobalSettingsProps {
  tags: string[];
  language: Language;
  onUpdate: (tags: string[]) => void;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ tags, language, onUpdate }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      if (!tags.includes(data.tag)) {
        onUpdate([...tags, data.tag]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeTag = (t: string) => {
    onUpdate(tags.filter(tag => tag !== t));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !tags.includes(val)) {
      onUpdate([...tags, val]);
    }
    // No need to manually reset e.target.value because we use value=""
  };

  // Split options for cleaner dropdowns
  const genreOptions = SUNO_TAGS.filter(t => t.category === TagCategory.GENRE);
  const vocalOptions = SUNO_TAGS.filter(t => t.category === TagCategory.VOCAL);

  return (
    <div 
      className={`relative mb-6 rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragOver 
          ? 'border-suno-500 bg-suno-900/10' 
          : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="absolute -top-3 left-4 px-2 bg-slate-950 text-xs font-bold text-suno-500 uppercase tracking-wide flex items-center gap-2">
        <div className="flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            {UI_LABELS.globalZoneTitle[language]}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        
        {/* Active Tags */}
        <div className="flex flex-wrap gap-2 min-h-[30px]">
             {tags.length === 0 && (
                <span className="text-sm text-slate-500 italic pointer-events-none select-none">
                    {UI_LABELS.globalZoneHint[language]}
                </span>
            )}
            {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full bg-suno-900/40 border border-suno-500/30 text-sm font-mono text-suno-200 shadow-sm animate-in zoom-in-95 duration-200">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 text-suno-500 hover:text-white">
                <X className="w-3 h-3" />
                </button>
            </span>
            ))}
        </div>
        
        {/* Dropdown Selectors */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800/50">
            <div className="relative">
                <select 
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-suno-500 focus:outline-none focus:ring-1 focus:ring-suno-500 cursor-pointer"
                    onChange={handleSelectChange}
                    value="" 
                >
                    <option value="" disabled>{UI_LABELS.selectGenre[language]}</option>
                    {genreOptions.map(t => (
                        <option key={t.id} value={t.tag}> {t.label[language]} </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
                <select 
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-suno-500 focus:outline-none focus:ring-1 focus:ring-suno-500 cursor-pointer"
                    onChange={handleSelectChange}
                    value=""
                >
                    <option value="" disabled>{UI_LABELS.selectVocal[language]}</option>
                    {vocalOptions.map(t => (
                        <option key={t.id} value={t.tag}> {t.label[language]} </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalSettings;
