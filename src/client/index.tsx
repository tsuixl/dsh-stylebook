import type { Context } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client';
import type {} from '@deepseek-ai/dsh-client-ui-theme/client';
import type {} from '@deepseek-ai/dsh-client-ui-settings/client';
import { useLayoutEffect, useRef } from 'react';
import { StylebookSettings } from './dsh/settings.ts';
import { mountPage } from './page.js';
import css from './appearance.css';
import view from './view.html';
export const inject = ['slots', 'configForms', 'theme'];
export function apply(ctx: Context) {
    const bridge = new StylebookSettings(ctx);
    const style = document.createElement('style');
    style.dataset.stylebook = 'page';
    style.textContent = css + `
 [data-stylebook-panel]{width:900px!important;border-radius:18px!important}
 [data-stylebook-panel]>nav{width:162px;background:var(--dsw-specific-sidebar-fill);padding:25px 12px}
 [data-stylebook-panel]>nav [aria-current="true"]{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,transparent);color:var(--dsw-alias-brand-primary)}
 [data-stylebook-panel]>div{min-height:0}
 [data-stylebook-panel]>div>div:first-child{display:none}
 [data-stylebook-panel]>div>div:last-child{padding:0;overflow:hidden;display:flex;flex-direction:column;min-height:0}
 @media(min-width:1600px){[data-stylebook-panel]{width:940px!important}}
 @media(max-width:620px){[data-stylebook-panel]>nav{display:none}}
 `;
    document.head.append(style);
    ctx.effect(() => () => { bridge.dispose(); style.remove(); });
    function Page({ close }: {
        close: () => void;
    }) {
        const ref = useRef<HTMLDivElement>(null);
        useLayoutEffect(() => {
            const root = ref.current!;
            const panel = root.closest('[data-shortcut-modal="settings"]');
            panel?.setAttribute('data-stylebook-panel', '');
            root.innerHTML = view;
            const dispose = mountPage(root, bridge, close);
            return () => { dispose(); panel?.removeAttribute('data-stylebook-panel'); };
        }, [close]);
        return <div ref={ref} className="stylebook-page"/>;
    }
    ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'stylebook', order: 5, label: '外观' }, Page)));
}
