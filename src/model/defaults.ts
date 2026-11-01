import type { Appearance, Preset } from './appearance.ts';
export const colorFields = [{ key: 'theme', name: '主题底色' }, { key: 'sidebar', name: '侧边栏' }, { key: 'accent', name: '强调色' }];
export const defaults: Appearance = { mode: 'light', uiFont: '', codeFont: 'Consolas', uiSize: 14, codeSize: 13, uiWeight: 400, codeWeight: 400, palettes: { light: { theme: '#ffffff', sidebar: '#f5f6fa', accent: '#4d6bfe' }, dark: { theme: '#242934', sidebar: '#1c202a', accent: '#8396ff' } } };
export const builtins: Preset[] = [
    { id: 'default', name: '默认 · Harness', value: structuredClone(defaults) },
    { id: 'paper', name: '暖纸 · 轻阅读', value: { ...structuredClone(defaults), palettes: { light: { theme: '#fffdf8', sidebar: '#f3efe7', accent: '#a07b4a' }, dark: { theme: '#302d27', sidebar: '#25231f', accent: '#c3a172' } } } },
    { id: 'ocean', name: '深海 · 专注', value: { ...structuredClone(defaults), mode: 'dark', palettes: { light: { theme: '#fbfdff', sidebar: '#edf3f9', accent: '#497dac' }, dark: { theme: '#1b2b3c', sidebar: '#14202d', accent: '#79a9d5' } } } },
    { id: 'forest', name: '苔绿 · 安静', value: { ...structuredClone(defaults), palettes: { light: { theme: '#fcfdf9', sidebar: '#eef2ed', accent: '#638264' }, dark: { theme: '#25322a', sidebar: '#1d2722', accent: '#94b196' } } } }
];
export const weightOptions = [{ value: 400, label: 'Regular' }, { value: 500, label: 'Medium' }, { value: 600, label: 'SemiBold' }, { value: 700, label: 'Bold' }];
