import type { Palette } from './appearance.ts';
/** Derive related surfaces without adding independent persisted settings. */
export function surfaceColors(color: string, mode: 'light' | 'dark') {
    const shift = (offset: readonly number[]) => '#' + offset.map((delta, index) => {
        const component = parseInt(color.slice(1 + index * 2, 3 + index * 2), 16);
        return Math.max(0, Math.min(255, component + delta)).toString(16).padStart(2, '0');
    }).join('');
    return mode === 'dark'
        ? { surface: shift([-2, -3, -4]), control: shift([5, 5, 5]), subtle: shift([-7, -9, -11]), hover: shift([13, 14, 17]) }
        : { surface: color.toLowerCase(), control: color.toLowerCase(), subtle: shift([-7, -6, -3]), hover: shift([-15, -13, -8]) };
}

function luminance(color: string) {
    const values = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
export function contrastRatio(a: string, b: string) {
    const x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export function readableText(background: string) {
    const candidates = ['#24262e', '#e5e7ef'];
    const best = candidates.sort((a, b) => contrastRatio(background, b) - contrastRatio(background, a))[0];
    if (contrastRatio(background, best) >= 4.5) return best;
    return contrastRatio(background, '#000000') > contrastRatio(background, '#ffffff') ? '#000000' : '#ffffff';
}
function blend(a: string, b: string, amount: number) {
    return '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - amount) + parseInt(b.slice(i, i + 2), 16) * amount).toString(16).padStart(2, '0')).join('');
}
function mutedText(background: string, foreground: string) {
    let value = foreground;
    for (let amount = .56; amount <= 1; amount += .04) {
        value = blend(background, foreground, amount);
        if (contrastRatio(background, value) >= 4.5) return value;
    }
    return foreground;
}
/** Three user colors are the sole input; all region and readable text colors are derived. */
export function resolvePalette(base: Palette, mode: 'light' | 'dark') {
    const theme = base.theme.toLowerCase(), sidebar = base.sidebar.toLowerCase(), accent = base.accent.toLowerCase();
    const surfaces = surfaceColors(theme, mode);
    const text = readableText(theme), sidebarText = readableText(sidebar);
    return {
        theme, sidebar, accent, workspace: theme, tools: sidebar,
        composer: surfaces.subtle, code: surfaces.subtle, overlay: theme, ...surfaces, hover: blend(theme, text, .06),
        text, muted: mutedText(theme, text), line: blend(theme, text, .13),
        sidebarText, sidebarMuted: mutedText(sidebar, sidebarText), sidebarLine: blend(sidebar, sidebarText, .13), sidebarHover: blend(sidebar, sidebarText, .08),
        accentText: readableText(accent), subtleText: readableText(surfaces.subtle),
    };
}
