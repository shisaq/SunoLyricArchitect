

import React, { useState } from 'react';
import { SongBlock as ISongBlock, Language, TagCategory } from '../types';
import { Trash2, GripVertical, X, Music, ChevronDown } from 'lucide-react';
import { UI_LABELS, SUNO_TAGS } from '../constants';

interface SongBlockProps {
  block: ISongBlock;
  index: number;
  language: Language;
  onUpdate: (id: string, updates: Partial<ISongBlock>) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const SongBlock: React.FC<SongBlockProps> = ({ block, index, language, onUpdate, onDelete, onMove }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDropMeta = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to container
    setIsDragOver(false);
    
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      
      const data = JSON.parse(dataStr);
      
      // If Structure tag dropped on header/body, update Type
      if (data.category === TagCategory.STRUCTURE) {
        onUpdate(block.id, { type: data.tag });
      } else if (data.category === TagCategory.MOOD || data.category === TagCategory.INSTRUMENT) {
        if (!block.tags.includes(data.tag)) {
          onUpdate(block.id, { tags: [...block.tags, data.tag] });
        }
      }
    } catch (err) {
      console.error('Drop failed', err);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate(block.id, { tags: block.tags.filter(t => t !== tagToRemove) });
  };

  // --- REORDERING LOGIC ---
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'block-drag');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/suno-block-index', index.toString());
  };

  const handleDragOverBlock = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('application/suno-block-index')) {
        e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDropBlock = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const dragIndexStr = e.dataTransfer.getData('application/suno-block-index');
      if (dragIndexStr) {
          const dragIndex = parseInt(dragIndexStr, 10);
          if (dragIndex !== index) {
              onMove(dragIndex, index);
          }
      }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !block.tags.includes(val)) {
      onUpdate(block.id, { tags: [...block.tags, val] });
    }
  };

  // Split options
  const moodOptions = SUNO_TAGS.filter(t => t.category === TagCategory.MOOD);
  const instOptions = SUNO_TAGS.filter(t => t.category === TagCategory.INSTRUMENT);

  return (
    <div 
        className="group flex items-start space-x-2 mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300"
        onDragOver={handleDragOverBlock}
        onDrop={handleDropBlock}
    >
      
      {/* Side Controls (Drag Handle) */}
      <div 
        className="flex-none pt-4 flex flex-col items-center space-y-2 opacity-30 group-hover:opacity-100 transition-opacity"
        draggable
        onDragStart={handleDragStart}
      >
        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-suno-500">
          <GripVertical className="w-5 h-5" />
        </div>
        <button onClick={() => onDelete(block.id)} className="p-1 hover:bg-red-900/30 text-slate-500 hover:text-red-400 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-colors">
        
        {/* Header: Section Type */}
        <div 
          className="bg-slate-950/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between"
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDropMeta}
        >
          <input 
            type="text" 
            value={block.type}
            onChange={(e) => onUpdate(block.id, { type: e.target.value })}
            className="bg-transparent font-mono text-suno-500 font-bold focus:outline-none focus:text-suno-400 w-full"
            placeholder="[Section]"
          />
          <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider hidden sm:block">
            {UI_LABELS.blockMetaHint[language]}
          </span>
        </div>

        {/* Meta Tags Area */}
        <div 
          className={`px-4 py-3 flex flex-col gap-3 transition-colors duration-200 ${isDragOver ? 'bg-suno-900/20' : 'bg-slate-900'}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropMeta}
        >
          <div className="flex flex-wrap gap-2">
            {block.tags.length === 0 && (
                <div className="text-xs text-slate-600 flex items-center italic py-1 pointer-events-none select-none">
                    <Music className="w-3 h-3 mr-2" />
                    {UI_LABELS.blockMetaHint[language]}
                </div>
            )}
            {block.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {tag}
                <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 text-slate-500 hover:text-red-400"
                >
                    <X className="w-3 h-3" />
                </button>
                </span>
            ))}
          </div>
          
           {/* Explicit Dropdowns */}
            <div className="flex flex-wrap gap-2">
                <div className="relative">
                    <select 
                        className="appearance-none pl-2 pr-6 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-[10px] text-slate-400 hover:text-slate-200 hover:border-suno-500/50 focus:outline-none cursor-pointer"
                        onChange={handleSelectChange}
                        value=""
                    >
                        <option value="" disabled>{UI_LABELS.selectMood[language]}</option>
                        {moodOptions.map(t => (
                            <option key={t.id} value={t.tag}>{t.label[language]}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>

                <div className="relative">
                     <select 
                        className="appearance-none pl-2 pr-6 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-[10px] text-slate-400 hover:text-slate-200 hover:border-suno-500/50 focus:outline-none cursor-pointer"
                        onChange={handleSelectChange}
                        value=""
                    >
                        <option value="" disabled>{UI_LABELS.selectInst[language]}</option>
                        {instOptions.map(t => (
                            <option key={t.id} value={t.tag}>{t.label[language]}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Lyrics Input */}
        <div className="border-t border-slate-800/50">
          <textarea
            value={block.lines}
            onChange={(e) => onUpdate(block.id, { lines: e.target.value })}
            placeholder={UI_LABELS.blockLyricsPlaceholder[language]}
            className="w-full bg-slate-900/50 p-4 text-slate-300 font-sans text-base leading-relaxed resize-none focus:outline-none focus:bg-slate-900 transition-colors min-h-[120px]"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SongBlock;
