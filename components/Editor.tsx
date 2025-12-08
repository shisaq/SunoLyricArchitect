import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { UI_LABELS } from '../constants';
import { Language } from '../types';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  language: Language;
}

export interface EditorHandle {
  insertText: (text: string) => void;
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ value, onChange, language }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    insertText: (textToInsert: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      // Add newlines around structure tags for cleaner formatting if not already present
      let formattedText = textToInsert;
      const isStructureTag = textToInsert.startsWith('[') && !textToInsert.includes('Instrument') && !textToInsert.includes('Mood');
      
      // If inserting a structure block like [Verse], ensure it has breathing room
      if (isStructureTag) {
          const charBefore = text.charAt(start - 1);
          if (charBefore && charBefore !== '\n') {
              formattedText = '\n\n' + formattedText;
          }
          formattedText += '\n';
      }

      const newText = text.substring(0, start) + formattedText + text.substring(end);
      
      onChange(newText);

      // Restore focus and move cursor to end of insertion
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + formattedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  }));

  return (
    <div className="w-full h-full flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-mono tracking-wide uppercase">Editor</span>
        <span className="text-[10px] text-slate-500 hidden sm:block">Markdown / Plain Text</span>
      </div>
      <textarea
        ref={textareaRef}
        className="flex-1 w-full bg-slate-800 p-6 text-slate-200 font-mono text-sm md:text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-suno-500/20"
        placeholder={UI_LABELS.editorPlaceholder[language]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
});

export default Editor;