# Suno 歌词构建器

[English](README.md)

一款可视化歌词编辑器，专为 [Suno](https://suno.com) AI 音乐生成平台设计。支持 Suno V5 Meta Tags、拖拽式歌曲结构编排，以及中英双语界面。

## 功能特性

- **分块编辑** - 将歌词按 `[Verse]`、`[Chorus]`、`[Bridge]` 等段落组织
- **丰富的标签系统** - 通过拖拽或点击添加结构、人声、情绪、乐器、风格标签
- **全局歌曲设置** - 设定全曲风格与元数据标签
- **模板保存/加载** - 将歌曲结构保存为模板，随时复用
- **实时预览** - 复制到 Suno 前预览最终格式化输出
- **一键复制** - 将完整的带标签歌词复制到剪贴板
- **中英双语** - 自由切换中文和英文界面

## 快速开始

**前置条件：** Node.js

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用运行在 `http://localhost:3000`。

## 构建

```bash
npm run build
npm run preview
```

## 技术栈

- React 19
- TypeScript
- Vite
- Lucide Icons
