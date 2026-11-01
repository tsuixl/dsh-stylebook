import z from '@deepseek-ai/schemastery';
import { defaultState } from './appearance.ts';
const family = () => z.string().max(256);
const size = () => z.number().min(10).max(22).step(1);
const weight = () => z.union([400, 500, 600, 700]);
const legacyKeys = ['sidebar', 'workspace', 'tools', 'composer', 'code', 'overlay', 'accent'];
const palette = (keys: string[]) => z.object(Object.fromEntries(keys.map(k => [k, z.string().pattern(/^#[\da-f]{6}$/i)])));
const current = (keys: string[]) => z.object({ uiFont: family(), codeFont: family(), uiSize: size(), codeSize: size(), uiWeight: weight(), codeWeight: weight(), palettes: z.object({ light: palette(keys), dark: palette(keys) }) });
const snapshot = (keys: string[]) => current(keys).set('mode', z.union(['light', 'dark', 'system']));
const state = (version: 1 | 2, keys: string[]) => z.object({
    version: z.const(version), current: current(keys), selectedPreset: z.string().min(1),
    presets: z.array(z.object({ id: z.string().pattern(/^custom-/), name: z.string().min(1).max(24), value: snapshot(keys) })).max(100),
});
// Keep the previous schema readable until the Client performs a revision-fenced migration.
const legacySchema = state(1, legacyKeys);
const currentSchema = state(2, ['theme', 'sidebar', 'accent']).set('legacyBackup', z.union([z.const(null), legacySchema]).default(null));
export const storedSchema = z.union([currentSchema, legacySchema]).default(defaultState);
