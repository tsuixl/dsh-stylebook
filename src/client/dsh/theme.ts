import type { Context } from '@deepseek-ai/cordis';
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client';
import { fontFamily, type Appearance } from '../../model/appearance.ts';
import { resolvePalette } from '../../model/colors.ts';
/** One removable token layer plus semantic region rules. No application files are changed. */
export function createThemeApplier(ctx: Context) {
    let release: (() => void) | undefined;
    const style = document.createElement('style');
    style.dataset.stylebook = 'regions';
    document.head.append(style);
    let fingerprint = '';
    function apply(config: Appearance) {
        const next = JSON.stringify(config);
        if (next === fingerprint)
            return;
        fingerprint = next;
        const tokens: ThemeTokenOverrides = {};
        const palettes = { light: resolvePalette(config.palettes.light, 'light'), dark: resolvePalette(config.palettes.dark, 'dark') };
        const colorMap: Record<string, keyof ReturnType<typeof resolvePalette>> = {
            '--dsw-specific-sidebar-fill': 'sidebar', '--dsw-alias-bg-base': 'workspace',
            '--dsw-specific-input-major': 'composer', '--dsw-alias-markdown-code-block': 'code',
            '--dsw-alias-bg-overlay': 'overlay',
            '--dsw-alias-brand-primary': 'accent', '--dsw-alias-state-business-primary': 'accent',
            '--dsw-focus-ring-color': 'accent',
            '--dsw-alias-label-primary': 'text', '--dsw-alias-label-secondary': 'muted',
            '--dsw-alias-label-tertiary': 'muted', '--dsw-alias-label-primary-dimmed': 'muted',
            '--dsw-alias-border-l1': 'line', '--dsw-alias-border-l2': 'line',
            '--dsw-alias-border-l3': 'line', '--dsw-alias-border-l4': 'line',
            '--dsw-alias-interactive-bg-hover-solid': 'hover',
        };
        for (const [token, region] of Object.entries(colorMap))
            tokens[token] = { light: palettes.light[region], dark: palettes.dark[region] };
        const surfaces = palettes;
        for (const token of ['--dsw-specific-menu', '--dsw-menu-surface-fill', '--dsw-alias-menu-group-header-fill'])
            tokens[token] = { light: surfaces.light.surface, dark: surfaces.dark.surface };
        const fonts = {
            '--dsh-font-family-text': fontFamily(config.uiFont), '--dsh-font-family-code': fontFamily(config.codeFont, true),
            '--dsw-font-family': fontFamily(config.uiFont), '--ds-font-family-code': fontFamily(config.codeFont, true),
            '--dsh-content-font-size': config.uiSize + 'px', '--dsh-code-font-size': config.codeSize + 'px',
        };
        for (const [key, value] of Object.entries(fonts))
            tokens[key] = { light: value, dark: value };
        // Typography tokens are shorthand declarations upstream; change their weight/size as a unit.
        for (const [name, size, weight] of [['s-14', config.uiSize, config.uiWeight], ['xs-13', config.uiSize - 1, config.uiWeight], ['s-strong-14', config.uiSize, Math.max(600, config.uiWeight)]] as const) {
            const value = `${weight} ${size}px/${size + 8}px var(--dsw-font-family)`;
            tokens['--dsw-font-' + name] = { light: value, dark: value };
        }
        for (const name of ['markdown-code', 'markdown-code-block', 'markdown-code-block-small']) {
            const value = `${config.codeWeight} ${config.codeSize}px/${config.codeSize + 7}px var(--ds-font-family-code)`;
            tokens['--dsw-font-' + name] = { light: value, dark: value };
        }
        const old = release;
        release = ctx.theme.overrideTokens('dsh-stylebook', tokens);
        old?.();
        const rules = (mode: 'light' | 'dark') => {
            const p = palettes[mode];
            const s = surfaces[mode];
            const scope = mode === 'dark' ? 'body[data-ds-dark-theme]' : 'body:not([data-ds-dark-theme])';
            const sidebar = `--dsw-alias-label-primary:${p.sidebarText};--dsw-alias-label-secondary:${p.sidebarMuted};--dsw-alias-label-tertiary:${p.sidebarMuted};--dsw-alias-label-primary-dimmed:${p.sidebarMuted};--dsw-alias-border-l3:${p.sidebarLine};--dsw-alias-interactive-bg-hover:${p.sidebarHover};--dsw-alias-interactive-bg-hover-solid:${p.sidebarHover}`;
            // 0.2.1-rc.5 Frame: first column precedes the stable bottom/overlay seats; no CSS hash dependency.
            return `${scope} #root div:has(> [data-shell-bottom]):has(> [data-shell-overlay]) > div:first-child{${sidebar}}
    ${scope} [data-stylebook-panel]>nav{${sidebar}}
    ${scope} [data-sidebar-right-panel]{--dsw-alias-bg-base:${p.tools};--dsw-alias-bg-layer-1:${p.tools};--dsw-alias-bg-layer-2:${p.tools};${sidebar}}
    ${scope} [data-composer-card]{background:${p.composer}}
    ${scope} [data-dockkit-pane]{background:${p.tools};${sidebar}}
    ${scope} [data-menu-material]{--dsw-specific-menu:${s.surface};--dsw-menu-surface-fill:${s.surface};--dsw-alias-menu-group-header-fill:${s.subtle}}
    ${scope} [role="dialog"]{--dsw-alias-bg-base:${s.control};--dsw-alias-bg-layer-1:${s.control};--dsw-alias-bg-layer-2:${p.overlay};--dsw-alias-bg-layer-3:${s.subtle};--dsw-alias-settings-card-fill:${s.control};--dsw-specific-input-major:${s.control};--dsw-alias-interactive-bg-hover-solid:${s.hover}}
    ${scope} [data-shortcut-modal="settings"]{background:${p.overlay}}`;
        };
        style.textContent = rules('light') + '\n' + rules('dark') + `\nbody{font-weight:${config.uiWeight}}`;
    }
    return { apply, dispose() { release?.(); style.remove(); } };
}
