import { defaults, builtins } from './defaults.ts';
export type Mode = 'light' | 'dark' | 'system';
export type Weight = 400 | 500 | 600 | 700;
export type Palette = Record<'theme' | 'sidebar' | 'accent', string>;
export type LegacyPalette = Record<'sidebar' | 'workspace' | 'tools' | 'composer' | 'code' | 'overlay' | 'accent', string>;
export interface Appearance {
    mode: Mode;
    uiFont: string;
    codeFont: string;
    uiSize: number;
    codeSize: number;
    uiWeight: Weight;
    codeWeight: Weight;
    palettes: Record<'light' | 'dark', Palette>;
}
export type Preset = {
    id: string;
    name: string;
    value: Appearance;
};
export type CurrentAppearance = Omit<Appearance, 'mode'>;
export interface StoredState {
    version: 2;
    current: CurrentAppearance;
    selectedPreset: string;
    presets: Preset[];
    legacyBackup?: LegacyStoredState | null;
}
export type LegacyAppearance = Omit<Appearance, 'palettes'> & { palettes: Record<'light' | 'dark', LegacyPalette> };
export interface LegacyStoredState {
    version: 1;
    current: Omit<LegacyAppearance, 'mode'>;
    selectedPreset: string;
    presets: Array<{ id: string; name: string; value: LegacyAppearance }>;
}
export const clone = <T>(value: T): T => structuredClone(value);
export function withoutMode(value: Appearance): CurrentAppearance { const { mode, ...current } = value; return clone(current); }
export const defaultState: StoredState = { version: 2, current: withoutMode(defaults), selectedPreset: 'default', presets: [], legacyBackup: null };
function validAppearanceFields(value: unknown, keys: readonly string[]): boolean {
    if (!value || typeof value !== 'object')
        return false;
    const v = value as Record<string, unknown>;
    if (!['light', 'dark', 'system'].includes(String(v.mode)))
        return false;
    if (!['uiFont', 'codeFont'].every(k => typeof v[k] === 'string' && (v[k] as string).length <= 256))
        return false;
    if (!['uiSize', 'codeSize'].every(k => Number.isInteger(v[k]) && Number(v[k]) >= 10 && Number(v[k]) <= 22))
        return false;
    if (!['uiWeight', 'codeWeight'].every(k => [400, 500, 600, 700].includes(Number(v[k])) && typeof v[k] === 'number'))
        return false;
    const palettes = v.palettes as Record<string, Record<string, string>> | undefined;
    return ['light', 'dark'].every(mode => palettes?.[mode] && Object.keys(palettes[mode]).length === keys.length && keys.every(key => /^#[\da-f]{6}$/i.test(palettes[mode][key] ?? '')));
}
export function validAppearance(value: unknown): value is Appearance { return validAppearanceFields(value, ['theme', 'sidebar', 'accent']); }
/** Config and preset objects may have different key order after migration or Host reads. */
export function sameAppearance(a: Appearance, b: Appearance): boolean {
    return ['mode', 'uiSize', 'codeSize', 'uiWeight', 'codeWeight'].every(key => a[key as keyof Appearance] === b[key as keyof Appearance])
        && ['uiFont', 'codeFont'].every(key => a[key as 'uiFont' | 'codeFont'].trim().toLowerCase() === b[key as 'uiFont' | 'codeFont'].trim().toLowerCase())
        && (['light', 'dark'] as const).every(mode => (['theme', 'sidebar', 'accent'] as const).every(key => a.palettes[mode][key].toLowerCase() === b.palettes[mode][key].toLowerCase()));
}
function validLegacyAppearance(value: unknown): value is LegacyAppearance { return validAppearanceFields(value, ['sidebar', 'workspace', 'tools', 'composer', 'code', 'overlay', 'accent']); }
function validStateFields(value: unknown, version: number, appearanceCheck: (value: unknown) => boolean): boolean {
    if (!value || typeof value !== 'object')
        return false;
    const v = value as StoredState | LegacyStoredState;
    if (v.version !== version || !appearanceCheck({ ...v.current, mode: 'light' }) || !Array.isArray(v.presets) || v.presets.length > 100)
        return false;
    const ids = new Set<string>(), names = new Set(builtins.map(p => p.name));
    for (const p of v.presets) {
        if (!p || typeof p.id !== 'string' || !p.id.startsWith('custom-') || ids.has(p.id) || typeof p.name !== 'string' || p.name !== p.name.trim() || !p.name || p.name.length > 24 || names.has(p.name) || !appearanceCheck(p.value))
            return false;
        ids.add(p.id);
        names.add(p.name);
    }
    return [...builtins.map(p => p.id), ...ids].includes(v.selectedPreset);
}
export function validLegacyState(value: unknown): value is LegacyStoredState { return validStateFields(value, 1, validLegacyAppearance); }
export function validState(value: unknown): value is StoredState {
    return validStateFields(value, 2, validAppearance) && ((value as StoredState).legacyBackup == null || validLegacyState((value as StoredState).legacyBackup));
}
function migrateAppearance(value: LegacyAppearance): Appearance {
    const palette = (p: LegacyPalette): Palette => ({ theme: p.workspace, sidebar: p.sidebar, accent: p.accent });
    return { ...clone(value), palettes: { light: palette(value.palettes.light), dark: palette(value.palettes.dark) } };
}
/** Read both released formats. Never mutate or overwrite an unrecognized version. */
export function readState(value: unknown): StoredState | undefined {
    if (validState(value)) return { ...clone(value), legacyBackup: value.legacyBackup ?? null };
    if (!validLegacyState(value)) return undefined;
    return {
        version: 2, current: withoutMode(migrateAppearance({ ...value.current, mode: 'light' })),
        selectedPreset: value.selectedPreset,
        presets: value.presets.map(p => ({ ...p, value: migrateAppearance(p.value) })),
        legacyBackup: clone(value),
    };
}
export function fontFamily(name: string, code = false) {
    const fallback = code ? 'Consolas,"SF Mono","Microsoft YaHei",monospace' : '"Segoe UI","Microsoft YaHei UI","PingFang SC",sans-serif';
    const cleaned = name.replace(/["'\\<>\u0000-\u001f\u007f]/g, '').trim();
    return cleaned ? JSON.stringify(cleaned) + ',' + fallback : fallback;
}
