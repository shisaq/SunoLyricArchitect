import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Copy, 
  Trash2, 
  Languages, 
  LayoutTemplate, 
  Mic2, 
  Sparkles, 
  Guitar, 
  Music, 
  FileText,
  Check,
  Eye,
  PenTool,
  Plus,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';

import { SUNO_TAGS, CATEGORIES, UI_LABELS } from './constants';
import { Language, TagCategory, SongState, SongBlock as ISongBlock, TagDefinition } from './types';
import TagButton from './components/TagButton';
import SongBlock from './components/SongBlock';
import GlobalSettings from './components/GlobalSettings';

const IconMap: Record<string, React.FC<any>> = {
  LayoutTemplate, Mic2, Sparkles, Guitar, Music, FileText
};

// --- TYPES ---
interface ToastMsg {
  id: number;
  text: string;
  type: 'success' | 'info';
}

type DialogState = 
  | { type: 'none' }
  | { type: 'clear' }
  | { type: 'save' }
  | { type: 'load'; template: TagDefinition }
  | { type: 'delete'; templateId: string };

const App: React.FC = () => {
  // --- STATE ---
  const [language, setLanguage] = useState<Language>('zh');
  const [activeCategory, setActiveCategory] = useState<TagCategory>(TagCategory.STRUCTURE);
  const [showPreview, setShowPreview] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  
  // Dialog State
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const [templateNameInput, setTemplateNameInput] = useState('');

  // Custom Templates State
  const [customTemplates, setCustomTemplates] = useState<TagDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('suno_custom_templates');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });

  // Save Custom Templates Effect
  useEffect(() => {
    try {
      localStorage.setItem('suno_custom_templates', JSON.stringify(customTemplates));
    } catch (e) {
      console.error("Failed to save templates", e);
    }
  }, [customTemplates]);

  const [song, setSong] = useState<SongState>({
    globalTags: [],
    blocks: [
      { id: '1', type: '[Verse]', tags: [], lines: '' },
    ]
  });

  // Combine constant tags with custom templates
  const allTags = useMemo(() => {
    return [...SUNO_TAGS, ...customTemplates];
  }, [customTemplates]);

  // --- ACTIONS ---

  const showToast = (text: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addBlock = (type: string = '[Verse]') => {
    const newBlock: ISongBlock = {
      id: Date.now().toString() + Math.random().toString().slice(2, 8),
      type,
      tags: [],
      lines: ''
    };
    setSong(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (id: string, updates: Partial<ISongBlock>) => {
    setSong(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const deleteBlock = (id: string) => {
    setSong(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setSong(prev => {
        const newBlocks = [...prev.blocks];
        const [movedBlock] = newBlocks.splice(dragIndex, 1);
        newBlocks.splice(hoverIndex, 0, movedBlock);
        return { ...prev, blocks: newBlocks };
    });
  }, []);

  const updateGlobalTags = (tags: string[]) => {
    setSong(prev => ({ ...prev, globalTags: tags }));
  };

  // --- DIALOG HANDLERS ---

  // 1. Clear
  const handleClearClick = () => {
    setDialog({ type: 'clear' });
  };

  const confirmClear = () => {
    setSong({
      globalTags: [],
      blocks: [{ id: Date.now().toString() + Math.random(), type: '[Verse]', tags: [], lines: '' }]
    });
    setShowPreview(false);
    setDialog({ type: 'none' });
    showToast(language === 'en' ? 'Workspace Cleared' : '工作区已清空', 'info');
  };

  // 2. Save
  const handleSaveClick = () => {
    setTemplateNameInput('');
    setDialog({ type: 'save' });
  };

  const confirmSaveTemplate = () => {
    const name = templateNameInput.trim();
    if (!name) return;

    const newTemplate: TagDefinition = {
      id: 'custom-' + Date.now(),
      tag: name,
      category: TagCategory.TEMPLATE,
      label: { en: name, zh: name },
      description: { en: 'Custom User Template', zh: '用户自定义模板' },
      templatePayload: {
        globalTags: [...song.globalTags],
        blocks: song.blocks.map(({ id, ...rest }) => ({ ...rest }))
      }
    };

    setCustomTemplates(prev => [newTemplate, ...prev]);
    setActiveCategory(TagCategory.TEMPLATE);
    setDialog({ type: 'none' });
    showToast(language === 'en' ? 'Template Saved!' : '模板已保存!', 'success');
  };

  // 3. Delete
  const handleDeleteTemplateClick = (id: string) => {
    setDialog({ type: 'delete', templateId: id });
  };

  const confirmDelete = () => {
    if (dialog.type !== 'delete') return;
    setCustomTemplates(prev => prev.filter(t => t.id !== dialog.templateId));
    setDialog({ type: 'none' });
    showToast(language === 'en' ? 'Deleted' : '已删除', 'info');
  };

  // 4. Load
  const handleLoadTemplateClick = (tagDef: TagDefinition) => {
      setDialog({ type: 'load', template: tagDef });
  };

  const confirmLoad = () => {
      if (dialog.type !== 'load' || !dialog.template.templatePayload) return;
      const payload = dialog.template.templatePayload;
      const newBlocks = payload.blocks.map(b => ({
          ...b,
          id: Date.now().toString() + Math.random().toString().slice(2,8)
      }));
      
      setSong({
          globalTags: [...payload.globalTags],
          blocks: newBlocks
      });
      setDialog({ type: 'none' });
      showToast(language === 'en' ? 'Template Loaded' : '模板已加载', 'success');
  };

  // 5. Rename (Kept simple with prompt for now as it wasn't reported broken, but can be upgraded if needed)
  const handleRenameTemplate = (id: string) => {
    const tpl = customTemplates.find(t => t.id === id);
    if (!tpl) return;
    const newName = window.prompt(UI_LABELS.renameTemplate[language], tpl.label[language]);
    if (newName && newName !== tpl.label[language]) {
      setCustomTemplates(prev => prev.map(t => 
        t.id === id 
          ? { ...t, tag: newName, label: { en: newName, zh: newName } } 
          : t
      ));
      showToast(language === 'en' ? 'Renamed' : '已重命名', 'success');
    }
  };


  const getCompiledLyrics = () => {
    let output = '';
    if (song.globalTags.length > 0) output += song.globalTags.join('\n') + '\n\n';
    song.blocks.forEach(block => {
      output += `${block.type}\n`;
      if (block.tags.length > 0) output += block.tags.join(' ') + '\n';
      if (block.lines) output += block.lines + '\n';
      output += '\n';
    });
    return output.trim();
  };

  const handleCopy = async () => {
    const text = getCompiledLyrics();
    try {
      await navigator.clipboard.writeText(text);
      showToast(UI_LABELS.copied[language], 'success');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // --- DRAG HELPERS ---

  const handleDropOnAddZone = (e: React.DragEvent) => {
    e.preventDefault();
    try {
       const dataStr = e.dataTransfer.getData('application/json');
       if(dataStr) {
         const data = JSON.parse(dataStr);
         if (data.category === TagCategory.TEMPLATE && data.payload) {
             const payload = data.payload;
             const newBlocks = payload.blocks.map((b: any) => ({ ...b, id: Date.now().toString() + Math.random() }));
             setSong({ globalTags: [...payload.globalTags], blocks: newBlocks });
             showToast(language === 'en' ? 'Template Loaded' : '模板已加载', 'success');
         } else if (data.category === TagCategory.STRUCTURE) {
            addBlock(data.tag);
         } else {
           const newBlock: ISongBlock = {
            id: Date.now().toString() + Math.random(),
            type: '[Verse]',
            tags: [data.tag],
            lines: ''
          };
          setSong(prev => ({...prev, blocks: [...prev.blocks, newBlock]}));
         }
       }
    } catch (e) { console.error(e); }
  };

  const handleTagClick = (tagData: TagDefinition) => {
      if (tagData.category === TagCategory.TEMPLATE) {
          handleLoadTemplateClick(tagData);
      }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[50] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto px-4 py-2 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-right fade-in duration-300 ${t.type === 'success' ? 'bg-suno-900 border-suno-500 text-suno-100' : 'bg-slate-800 border-slate-700 text-slate-100'}`}>
            {t.type === 'success' ? <Check className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            <span className="text-sm font-medium">{t.text}</span>
          </div>
        ))}
      </div>

      {/* --- MODAL DIALOGS --- */}
      {dialog.type !== 'none' && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
              
              {/* CLEAR MODAL */}
              {dialog.type === 'clear' && (
                <>
                  <div className="flex items-center gap-3 mb-4 text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Clear Workspace?' : '清空工作区？'}</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                    {language === 'en' ? 'This will remove all current lyrics and tags. This action cannot be undone.' : '这将删除所有当前的歌词和标签。此操作无法撤销。'}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setDialog({ type: 'none' })} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button onClick={confirmClear} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm">
                      {language === 'en' ? 'Clear All' : '确认清空'}
                    </button>
                  </div>
                </>
              )}

              {/* SAVE MODAL */}
              {dialog.type === 'save' && (
                <>
                  <div className="flex items-center gap-3 mb-4 text-suno-400">
                    <Save className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Save Template' : '保存模板'}</h3>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{language === 'en' ? 'Template Name' : '模板名称'}</label>
                    <input 
                      type="text" 
                      value={templateNameInput}
                      onChange={(e) => setTemplateNameInput(e.target.value)}
                      placeholder={language === 'en' ? 'My Awesome Song...' : '我的歌曲...'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-suno-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && confirmSaveTemplate()}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setDialog({ type: 'none' })} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button onClick={confirmSaveTemplate} className="px-4 py-2 rounded-lg bg-suno-600 hover:bg-suno-500 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!templateNameInput.trim()}>
                      {language === 'en' ? 'Save' : '保存'}
                    </button>
                  </div>
                </>
              )}

              {/* LOAD MODAL */}
              {dialog.type === 'load' && (
                <>
                  <div className="flex items-center gap-3 mb-4 text-blue-400">
                    <FileText className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Load Template?' : '加载模板？'}</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                     {language === 'en' 
                        ? `Load "${dialog.template.label.en}"? This will replace your current song.` 
                        : `加载 "${dialog.template.label.zh}"? 这将覆盖当前所有内容。`}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setDialog({ type: 'none' })} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button onClick={confirmLoad} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm">
                      {language === 'en' ? 'Load' : '确认加载'}
                    </button>
                  </div>
                </>
              )}

              {/* DELETE MODAL */}
              {dialog.type === 'delete' && (
                <>
                   <div className="flex items-center gap-3 mb-4 text-red-400">
                    <Trash2 className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Delete Template?' : '删除模板？'}</h3>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm">
                     {language === 'en' ? 'Are you sure you want to delete this custom template?' : '您确定要删除此自定义模板吗？'}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setDialog({ type: 'none' })} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                    <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm">
                      {language === 'en' ? 'Delete' : '确认删除'}
                    </button>
                  </div>
                </>
              )}

           </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-none h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-suno-500 to-suno-600 rounded-lg shadow-lg shadow-suno-500/20 flex items-center justify-center">
             <Music className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white hidden sm:block">
            {UI_LABELS.appTitle[language]}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
           <button
            onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <Languages className="w-4 h-4" />
            <span className="font-medium uppercase">{language}</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-2" />
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${showPreview ? 'bg-suno-900 text-suno-200' : 'text-slate-400 hover:text-white'}`}
          >
             {showPreview ? <PenTool className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
             <span className="hidden sm:inline">{showPreview ? UI_LABELS.editor[language] : UI_LABELS.preview[language]}</span>
          </button>

          <button
            onClick={handleSaveClick}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-slate-400 hover:text-suno-400 hover:bg-slate-800 transition-colors text-sm"
            title={UI_LABELS.saveTemplate[language]}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{UI_LABELS.saveTemplate[language]}</span>
          </button>

          <button 
            onClick={handleClearClick}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
            title={UI_LABELS.clear[language]}
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-suno-600 hover:bg-suno-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-suno-500/20"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">{UI_LABELS.copy[language]}</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Sidebar: Palette */}
        <div className="w-full md:w-72 lg:w-80 flex-none bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col h-[35vh] md:h-auto z-20 shadow-xl">
          <div className="p-3 border-b border-slate-800 bg-slate-900">
            <div className="grid grid-cols-3 gap-1">
              {CATEGORIES.map(cat => {
                const Icon = IconMap[cat.icon];
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-800 text-suno-400 shadow-sm ring-1 ring-slate-700' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-suno-500' : ''}`} />
                    <span className="truncate w-full text-center">{cat.name[language]}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-center text-[10px] text-slate-600">
                {CATEGORIES.find(c => c.id === activeCategory)?.description[language]}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className="grid grid-cols-2 gap-2 pb-4">
              {allTags
                .filter(t => t.category === activeCategory)
                .map(tagData => (
                  <TagButton 
                    key={tagData.id} 
                    tagData={tagData} 
                    language={language}
                    onClick={handleTagClick}
                    isCustom={tagData.id.startsWith('custom-')}
                    onDelete={() => handleDeleteTemplateClick(tagData.id)}
                    onRename={() => handleRenameTemplate(tagData.id)}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Builder Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col h-[65vh] md:h-auto relative overflow-hidden">
           
           {/* BUILDER VIEW */}
           <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar pb-32">
                 <div className="max-w-3xl mx-auto">
                    
                    {/* 1. Global Zone */}
                    <GlobalSettings 
                      tags={song.globalTags} 
                      language={language} 
                      onUpdate={updateGlobalTags} 
                    />

                    {/* 2. Song Blocks */}
                    <div className="space-y-6">
                      {song.blocks.map((block, index) => (
                        <SongBlock
                          key={block.id}
                          index={index}
                          block={block}
                          language={language}
                          onUpdate={updateBlock}
                          onDelete={deleteBlock}
                          onMove={moveBlock}
                        />
                      ))}
                    </div>

                    {/* 3. Add Section Area */}
                    <div 
                      className="mt-8 border-2 border-dashed border-slate-800 hover:border-suno-600/50 hover:bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 transition-all cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropOnAddZone}
                      onClick={() => addBlock()}
                    >
                       <div className="bg-slate-900 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-suno-500" />
                       </div>
                       <p className="font-semibold text-sm">{UI_LABELS.addSectionTitle[language]}</p>
                       <p className="text-xs mt-1 text-slate-600">{UI_LABELS.orClick[language]} <span className="text-suno-500 font-mono">[Verse]</span></p>
                    </div>

                 </div>
              </div>
           </div>

           {/* PREVIEW VIEW */}
           <div className={`absolute inset-0 bg-slate-950 flex flex-col transition-opacity duration-300 ${showPreview ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex-1 p-8 overflow-y-auto flex justify-center">
                 <div className="w-full max-w-3xl">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                       <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4 font-bold">Final Output Preview</h3>
                       <pre className="font-mono text-sm sm:text-base text-slate-300 whitespace-pre-wrap leading-relaxed">
                         {getCompiledLyrics() || <span className="text-slate-600 italic">No lyrics generated yet...</span>}
                       </pre>
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </main>

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;