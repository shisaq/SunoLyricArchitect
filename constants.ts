

import { TagCategory, TagDefinition, CategoryMeta, Translation } from './types';

export const UI_LABELS: Record<string, Translation> = {
  appTitle: { en: 'Suno Lyric Architect', zh: 'Suno 歌词构建器' },
  clear: { en: 'New Song', zh: '新建歌曲' },
  copy: { en: 'Copy All', zh: '复制全部' },
  copied: { en: 'Copied!', zh: '已复制!' },
  preview: { en: 'Preview', zh: '预览' },
  editor: { en: 'Builder', zh: '构建视图' },
  saveTemplate: { en: 'Save Template', zh: '保存模板' },
  
  // Zones
  globalZoneTitle: { en: 'Song Style & Global Meta', zh: '全曲风格与全局设置' },
  globalZoneHint: { en: 'Drag Genre, Vocal, or Era tags here...', zh: '拖拽 流派 / 人声 / 年代 标签至此...' },
  addTag: { en: 'Add Tag...', zh: '添加标签...' },
  selectGenre: { en: 'Select Genre...', zh: '选择流派...' },
  selectVocal: { en: 'Select Vocal...', zh: '选择人声...' },
  
  blockMetaHint: { en: 'Moods & Instruments', zh: '情绪与乐器' },
  blockLyricsPlaceholder: { en: 'Enter lyrics for this section...', zh: '输入本段歌词...' },
  selectMood: { en: 'Add Mood...', zh: '添加情绪...' },
  selectInst: { en: 'Add Instrument...', zh: '添加乐器...' },
  
  addSectionTitle: { en: 'Drag Structure Tag Here to Add Section', zh: '拖拽结构标签(如[Verse])至此添加段落' },
  orClick: { en: 'or click to add manually:', zh: '或点击手动添加：' },
  
  // Sidebar
  dragTip: {
    en: 'Drag tags into the zones on the right',
    zh: '拖拽标签至右侧对应区域'
  },
  
  // Prompts
  enterTemplateName: { en: 'Enter template name:', zh: '请输入模板名称：' },
  confirmDelete: { en: 'Delete this template?', zh: '删除此模板？' },
  renameTemplate: { en: 'Rename template:', zh: '重命名模板：' }
};

export const CATEGORIES: CategoryMeta[] = [
  { 
    id: TagCategory.STRUCTURE, 
    name: { en: 'Structure', zh: '结构' }, 
    icon: 'LayoutTemplate',
    description: { en: 'Drag to add new sections', zh: '拖拽以添加新段落' }
  },
  { 
    id: TagCategory.VOCAL, 
    name: { en: 'Vocals', zh: '人声' }, 
    icon: 'Mic2',
    description: { en: 'Global vocal settings', zh: '全局人声设置' }
  },
  { 
    id: TagCategory.MOOD, 
    name: { en: 'Mood', zh: '情绪' }, 
    icon: 'Sparkles',
    description: { en: 'Section specific mood', zh: '段落情绪' }
  },
  { 
    id: TagCategory.INSTRUMENT, 
    name: { en: 'Inst.', zh: '乐器' }, 
    icon: 'Guitar',
    description: { en: 'Instruments', zh: '乐器' }
  },
  { 
    id: TagCategory.GENRE, 
    name: { en: 'Genre', zh: '流派' }, 
    icon: 'Music',
    description: { en: 'Main style', zh: '主要风格' }
  },
  { 
    id: TagCategory.TEMPLATE, 
    name: { en: 'V5 Tpl', zh: 'V5模板' }, 
    icon: 'FileText',
    description: { en: 'Quick start templates', zh: '快速开始' }
  },
];

export const SUNO_TAGS: TagDefinition[] = [
  // --- TEMPLATES ---
  {
    id: 'tpl-structure-pop',
    tag: 'Structured Pop-Rock',
    category: TagCategory.TEMPLATE,
    label: { en: 'Structured Pop', zh: '标准流行摇滚' },
    description: { en: 'Intro -> Verse -> Chorus -> Bridge', zh: '前奏 -> 主歌 -> 副歌 -> 桥段' },
    templatePayload: {
      globalTags: ['[Genre: Pop Rock]', '[Mood: Uplifting]', '[Instrument: Bright Electric Guitars]', '[Vocal Style: Open, Confident]'],
      blocks: [
        { type: '[Intro]', tags: ['[Energy: Medium→High]'], lines: '' },
        { type: '[Verse]', tags: [], lines: 'Small steps, big faith, I’m finding my way...' },
        { type: '[Chorus]', tags: ['[Energy: High]'], lines: 'Carry me forward, louder than fear\nWe rise together, the reason is clear' },
        { type: '[Bridge]', tags: ['[Texture: Tape-Saturated]'], lines: 'We rise and fall and rise again.' },
        { type: '[Outro]', tags: ['[Fade Out]'], lines: '' }
      ]
    }
  },
  {
    id: 'tpl-lofi-loop',
    tag: 'Lo-fi Loop',
    category: TagCategory.TEMPLATE,
    label: { en: 'Lo-fi Loop', zh: 'Lo-fi 循环' },
    description: { en: 'Chill, loop-friendly beat', zh: '松弛, 适合循环' },
    templatePayload: {
      globalTags: ['[Style: Lo-fi Hip Hop]', '[Instrument: Warm Rhodes]', '[Instrument: Soft Drums]', '[Texture: Vinyl Hiss]'],
      blocks: [
        { type: '[Intro]', tags: ['[Mood: Chill But Focused]'], lines: '' },
        { type: '[Verse]', tags: ['[Structure: Loop-Friendly]'], lines: 'Raindrops on the window pane\nWriting code inside my brain...' },
        { type: '[Outro]', tags: ['[Texture: Gentle Sidechain]'], lines: '' }
      ]
    }
  },
  {
    id: 'tpl-gospel-trap',
    tag: 'Gospel Trap',
    category: TagCategory.TEMPLATE,
    label: { en: 'Gospel Trap', zh: '福音 Trap' },
    description: { en: 'High energy, powerful vocals', zh: '高能, 强力人声' },
    templatePayload: {
      globalTags: ['[Genre: Gospel Trap]', '[Vocal Style: Power Praise Persona]', '[Instrument: 808s]', '[Instrument: Handclaps]'],
      blocks: [
        { type: '[Intro]', tags: ['[Mood: Joyful]', '[Energy: High]'], lines: 'Yeah! Hallelujah!' },
        { type: '[Chorus]', tags: ['[Instrument: Gospel Choir]'], lines: 'Shine the light, break the chains!' },
        { type: '[Verse]', tags: ['[Flow: Fast]'], lines: '' }
      ]
    }
  },

  // 1. Structure
  {
    id: 'intro',
    tag: '[Intro]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Intro', zh: '前奏' },
    description: { en: 'Lead-in / scene setting', zh: '引入 / 场景铺垫' }
  },
  {
    id: 'verse',
    tag: '[Verse]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Verse', zh: '主歌' },
    description: { en: 'Lyrical development', zh: '歌词发展' }
  },
  {
    id: 'chorus',
    tag: '[Chorus]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Chorus', zh: '副歌' },
    description: { en: 'Main hook / emotional core', zh: '核心高潮' }
  },
  {
    id: 'bridge',
    tag: '[Bridge]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Bridge', zh: '桥段' },
    description: { en: 'Contrast / pivot', zh: '转折 / 枢纽' }
  },
  {
    id: 'pre-chorus',
    tag: '[Pre-Chorus]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Pre-Chorus', zh: '导歌' },
    description: { en: 'Build up', zh: '情绪铺垫' }
  },
  {
    id: 'drop',
    tag: '[Drop]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Drop', zh: 'Drop' },
    description: { en: 'Beat-driven instrumental focus', zh: '强节奏乐器段落' }
  },
  {
    id: 'outro',
    tag: '[Outro]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Outro', zh: '尾奏' },
    description: { en: 'Closure or fade-out', zh: '结束或淡出' }
  },
  {
    id: 'interlude',
    tag: '[Interlude]',
    category: TagCategory.STRUCTURE,
    label: { en: 'Interlude', zh: '间奏' },
    description: { en: 'Instrumental break', zh: '器乐过场' }
  },

  // 2. Vocals
  {
    id: 'voc-fem',
    tag: '[Vocalist: Female]',
    category: TagCategory.VOCAL,
    label: { en: 'Female', zh: '女声' },
    description: { en: 'Suggest vocal gender', zh: '指定女歌手' }
  },
  {
    id: 'voc-male',
    tag: '[Vocalist: Male]',
    category: TagCategory.VOCAL,
    label: { en: 'Male', zh: '男声' },
    description: { en: 'Suggest vocal gender', zh: '指定男歌手' }
  },
  {
    id: 'voc-duet',
    tag: '[Vocalist: Duet]',
    category: TagCategory.VOCAL,
    label: { en: 'Duet', zh: '对唱' },
    description: { en: 'Two singers', zh: '双人演唱' }
  },
  {
    id: 'voc-harmony',
    tag: '[Harmony: Yes]',
    category: TagCategory.VOCAL,
    label: { en: 'Harmony', zh: '和声' },
    description: { en: 'Add background vocals', zh: '增加背景人声' }
  },
  {
    id: 'voc-reverb',
    tag: '[Vocal Effect: Reverb]',
    category: TagCategory.VOCAL,
    label: { en: 'Reverb', zh: '混响' },
    description: { en: 'Suggest audio FX', zh: '音频效果建议' }
  },
  {
    id: 'voc-whisper',
    tag: '[Vocal Tone: Whisper]',
    category: TagCategory.VOCAL,
    label: { en: 'Whisper', zh: '耳语' },
    description: { en: 'Guide vocal style', zh: '引导演唱风格' }
  },
  {
    id: 'voc-style-open',
    tag: '[Vocal Style: Open, Confident]',
    category: TagCategory.VOCAL,
    label: { en: 'Confident', zh: '自信' },
    description: { en: 'V5 Persona helper', zh: 'V5 人格辅助' }
  },

  // 3. Mood
  {
    id: 'mood-uplifting',
    tag: '[Mood: Uplifting]',
    category: TagCategory.MOOD,
    label: { en: 'Uplifting', zh: '振奋' },
    description: { en: 'Emotion / feel', zh: '情感基调' }
  },
  {
    id: 'mood-intense',
    tag: '[Mood: Intense]',
    category: TagCategory.MOOD,
    label: { en: 'Intense', zh: '激烈' },
    description: { en: 'High emotion', zh: '强烈情感' }
  },
  {
    id: 'mood-sad',
    tag: '[Mood: Melancholic]',
    category: TagCategory.MOOD,
    label: { en: 'Sad', zh: '忧伤' },
    description: { en: 'Sad emotion', zh: '悲伤情感' }
  },
  {
    id: 'mood-chill',
    tag: '[Mood: Chill]',
    category: TagCategory.MOOD,
    label: { en: 'Chill', zh: '松弛' },
    description: { en: 'Relaxed vibe', zh: '放松氛围' }
  },
  {
    id: 'tempo-fast',
    tag: '[Tempo: Fast]',
    category: TagCategory.MOOD,
    label: { en: 'Fast', zh: '快速' },
    description: { en: 'Fast pace', zh: '快节奏' }
  },
  {
    id: 'energy-high',
    tag: '[Energy: High]',
    category: TagCategory.MOOD,
    label: { en: 'High Energy', zh: '高能' },
    description: { en: 'Momentum / impact', zh: '冲击力' }
  },
  {
    id: 'texture-gritty',
    tag: '[Texture: Gritty]',
    category: TagCategory.MOOD,
    label: { en: 'Gritty', zh: '粗粝' },
    description: { en: 'Tonality influence', zh: '音色质感' }
  },

  // 4. Instrument
  {
    id: 'inst-piano',
    tag: '[Instrument: Piano]',
    category: TagCategory.INSTRUMENT,
    label: { en: 'Piano', zh: '钢琴' },
    description: { en: 'Promote instrument use', zh: '主要乐器' }
  },
  {
    id: 'inst-guitar-dist',
    tag: '[Instrument: Electric Guitar]',
    category: TagCategory.INSTRUMENT,
    label: { en: 'Elec. Guitar', zh: '电吉他' },
    description: { en: 'Add edge or tone', zh: '增加锋利感' }
  },
  {
    id: 'inst-strings',
    tag: '[Instrument: Strings]',
    category: TagCategory.INSTRUMENT,
    label: { en: 'Strings', zh: '弦乐' },
    description: { en: 'Elevate emotional feel', zh: '提升情感' }
  },
  {
    id: 'inst-808',
    tag: '[Instrument: 808 Bass]',
    category: TagCategory.INSTRUMENT,
    label: { en: '808', zh: '808' },
    description: { en: 'Suggest beat/bass format', zh: '低音节拍' }
  },
   {
    id: 'inst-drums',
    tag: '[Instrument: Heavy Drums]',
    category: TagCategory.INSTRUMENT,
    label: { en: 'Drums', zh: '鼓组' },
    description: { en: 'Rhythm', zh: '节奏' }
  },
  {
    id: 'inst-rhodes',
    tag: '[Instrument: Warm Rhodes]',
    category: TagCategory.INSTRUMENT,
    label: { en: 'Rhodes', zh: '罗兹电琴' },
    description: { en: 'Warm keyboard', zh: '温暖键盘' }
  },

  // 5. Genre
  {
    id: 'genre-pop',
    tag: '[Genre: Pop]',
    category: TagCategory.GENRE,
    label: { en: 'Pop', zh: '流行' },
    description: { en: 'Standard Pop', zh: '标准流行' }
  },
  {
    id: 'genre-rock',
    tag: '[Genre: Rock]',
    category: TagCategory.GENRE,
    label: { en: 'Rock', zh: '摇滚' },
    description: { en: 'Rock music', zh: '摇滚乐' }
  },
  {
    id: 'genre-edm',
    tag: '[Genre: EDM]',
    category: TagCategory.GENRE,
    label: { en: 'EDM', zh: '电子舞曲' },
    description: { en: 'Electronic Dance', zh: '电子舞曲' }
  },
  {
    id: 'genre-gospel',
    tag: '[Genre: Gospel]',
    category: TagCategory.GENRE,
    label: { en: 'Gospel', zh: '福音' },
    description: { en: 'Set genre reference', zh: '流派参考' }
  },
  {
    id: 'genre-orchestral',
    tag: '[Genre: Orchestral]',
    category: TagCategory.GENRE,
    label: { en: 'Orchestral', zh: '管弦乐' },
    description: { en: 'Cinematic', zh: '史诗感' }
  },
  {
    id: 'style-lofi',
    tag: '[Style: Lo-fi]',
    category: TagCategory.GENRE,
    label: { en: 'Lo-fi', zh: 'Lo-fi' },
    description: { en: 'Add texture/style filter', zh: '风格滤镜' }
  },
  {
    id: 'era-2000s',
    tag: '[Era: 2000s]',
    category: TagCategory.GENRE,
    label: { en: '2000s', zh: '00年代' },
    description: { en: 'Suggest sound era', zh: '年代感' }
  },
   {
    id: 'era-80s',
    tag: '[Era: 80s]',
    category: TagCategory.GENRE,
    label: { en: '80s', zh: '80年代' },
    description: { en: 'Synthwave era', zh: '复古电子' }
  },
];