// The standalone HTML receives a bundled copy of this same model, not a second implementation.
export { defaults, builtins, colorFields, weightOptions } from './defaults.ts';
export { resolvePalette, surfaceColors, contrastRatio } from './colors.ts';
export { readState, validAppearance, withoutMode, sameAppearance } from './appearance.ts';
import { readState, type Appearance, type Mode } from './appearance.ts';
/** The old standalone prototype used config/mode instead of the Host's current field. */
export function readBrowserState(value: unknown) {
    if (!value || typeof value !== 'object') return undefined;
    const raw = value as Record<string, unknown>;
    if (!raw.config || typeof raw.config !== 'object') return undefined;
    const { mode, ...current } = raw.config as Record<string, unknown>;
    if (!['light', 'dark', 'system'].includes(String(mode))) return undefined;
    const state = readState({ version: raw.version, current, selectedPreset: raw.selectedPreset, presets: raw.presets, ...(raw.legacyBackup ? { legacyBackup: raw.legacyBackup } : {}) });
    if (!state) return undefined;
    return { version: 2 as const, config: { ...state.current, mode: mode as Mode } satisfies Appearance, selectedPreset: state.selectedPreset, presets: state.presets, ...(state.legacyBackup ? { legacyBackup: state.legacyBackup } : {}) };
}
