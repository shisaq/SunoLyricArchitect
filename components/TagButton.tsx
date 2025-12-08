

import React from 'react';
import { TagDefinition, Language, TagCategory } from '../types';
import { Trash2, Pencil } from 'lucide-react';

interface TagButtonProps {
  tagData: TagDefinition;
  language: Language;
  onClick?: (tagData: TagDefinition) => void;
  isCustom?: boolean;
  onDelete?: () => void;
  onRename?: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({ tagData, language, onClick, isCustom, onDelete, onRename }) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Send full data so drop zones can filter by category
    const data = {
      tag: tagData.tag,
      category: tagData.category,
      id: tagData.id,
      payload: tagData.templatePayload
    };
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.setData('text/plain', tagData.tag); // Fallback
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (e: React.MouseEvent) => {
      // Prevent triggering if clicking controls
      if ((e.target as HTMLElement).closest('button')) return;
      if (onClick) onClick(tagData);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group relative flex flex-col items-start justify-center p-3 bg-slate-800 hover:bg-suno-900 border border-slate-700 hover:border-suno-500 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 select-none shadow-sm active:scale-95"
      title={tagData.description[language]}
    >
      <div className="flex w-full justify-between items-start">
          <span className="font-mono text-xs sm:text-sm font-semibold text-suno-100 group-hover:text-white break-words text-left flex-1">
            {tagData.category === TagCategory.TEMPLATE ? tagData.label[language] : (tagData.tag.length > 35 ? tagData.label[language] : tagData.tag)}
          </span>
          
          {isCustom && (
            <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onRename?.(); }} className="p-1 hover:text-blue-400 text-slate-500 rounded">
                    <Pencil className="w-3 h-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="p-1 hover:text-red-400 text-slate-500 rounded">
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
          )}
      </div>

      <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-suno-200 font-medium truncate w-full">
        {tagData.description[language]}
      </span>
      
      {/* Visual Grip Hint */}
      {!isCustom && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
            </svg>
        </div>
      )}
    </div>
  );
};

export default TagButton;