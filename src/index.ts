import type { Context, Volatile } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-settings';
import z from '@deepseek-ai/schemastery';
import type { StoredState, LegacyStoredState } from './model/appearance.ts';
import { storedSchema } from './model/schema.ts';
// A single validated live field keeps preset edits atomic within this plugin.
export const Config = z.object({ data: storedSchema.volatile() });
export function apply(ctx: Context, _config: {
    data: Volatile<StoredState | LegacyStoredState>;
}) {
    ctx.inject(['settings'], child => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)); });
}
