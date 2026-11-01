import type { Context } from '@deepseek-ai/cordis';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import { clone, defaultState, withoutMode, validState, readState, type Appearance, type Preset, type StoredState, type LegacyStoredState } from '../../model/appearance.ts';
import { createThemeApplier } from './theme.ts';
export interface PageState {
    config: Appearance;
    selectedPreset: string;
    presets: Preset[];
    status: string;
    writable: boolean;
}
export class StylebookSettings {
    private form: ConfigForm<{
        data: StoredState | LegacyStoredState;
    }>;
    private native: ConfigForm<{
        preference: string;
    }>;
    private listeners = new Set<() => void>();
    private value: PageState;
    private pending = 0;
    private disposed = false;
    private lastWrite = Promise.resolve(true);
    private subscriptions: (() => void)[] = [];
    private applier: ReturnType<typeof createThemeApplier>;
    private legacyBackup: LegacyStoredState | null | undefined;
    constructor(private ctx: Context) {
        this.form = ctx.configForms.get('stylebook');
        this.native = ctx.configForms.get('ui-theme');
        this.applier = createThemeApplier(ctx);
        this.value = { config: { ...clone(defaultState.current), mode: this.mode() }, selectedPreset: 'default', presets: [], status: '正在读取设置…', writable: false };
        this.subscriptions.push(this.form.subscribe(() => this.adopt()), this.native.subscribe(() => this.adopt()));
        this.adopt();
    }
    snapshot() { return this.value; }
    subscribe(listener: () => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
    private emit() { for (const listener of this.listeners)
        listener(); }
    private mode(): Appearance['mode'] {
        const preference = this.native.getSnapshot().value?.preference;
        return preference === 'light' || preference === 'dark' || preference === 'system' ? preference : this.ctx.theme.getTheme().preference;
    }
    private adopt(status?: string, migrate = true) {
        if (this.disposed || this.pending)
            return;
        const section = this.form.getSnapshot();
        const data = readState(section.value?.data);
        if (!data) {
            if (section.status !== 'loading') {
                this.value = { ...this.value, status: '配置版本或内容无法读取，未覆盖原数据', writable: false };
                this.emit();
            }
            return;
        }
        this.legacyBackup = data.legacyBackup;
        this.value = { config: { ...clone(data.current), mode: this.mode() }, selectedPreset: data.selectedPreset, presets: clone(data.presets), status: section.writable ? status ?? '更改自动保存' : '当前配置只读', writable: section.writable };
        this.applier.apply(this.value.config);
        this.emit();
        if (migrate && section.value?.data.version === 1 && section.writable) {
            this.value = { ...this.value, status: '正在迁移配色…' };
            void this.enqueue(() => this.form.mutate([{op:'set',path:['data'],value:data}],section.revision), '配色已迁移', '迁移未保存，请检查连接后重试');
            this.emit();
        }
    }
    // Coordinate the two Host-owned queues as one user action. This is not a cross-form transaction.
    private enqueue(write: () => Promise<boolean>, success: string, failure: string) {
        this.pending++;
        const task = this.lastWrite.then(async () => {
            let accepted = false;
            try {
                if (!this.disposed) accepted = await write();
            } catch {
                // Each form performs its own recovery read; show its accepted values below.
            } finally {
                this.pending--;
                if (!this.pending) this.adopt(accepted ? success : failure, false);
            }
            return accepted;
        });
        this.lastWrite = task;
        return task;
    }
    preview(config: Appearance) { if (!this.disposed) this.applier.apply(config); }
    save(draft: Pick<PageState, 'config' | 'selectedPreset' | 'presets'>) {
        const config = clone(draft.config);
        const data: StoredState = { version: 2, current: withoutMode(config), selectedPreset: draft.selectedPreset, presets: clone(draft.presets), ...(this.legacyBackup ? {legacyBackup:clone(this.legacyBackup)} : {}) };
        if (this.disposed) return Promise.resolve(false);
        if (!validState(data) || !this.form.getSnapshot().writable) {
            this.value = { ...this.value, status: '保存失败，请检查配置后重试' };
            this.emit();
            return Promise.resolve(false);
        }
        this.value = { ...clone(draft), writable: true, status: '正在保存…' };
        const task = this.enqueue(async () => {
            const saved = await this.form.set('data', data);
            if (!saved || this.disposed) return false;
            return this.mode() === config.mode || await this.native.set('preference', config.mode);
        }, '已保存', '保存失败，请重试；部分设置可能已生效');
        this.emit();
        return task;
    }
    async flush(): Promise<boolean> {
        let task = this.lastWrite;
        for (;;) {
            const accepted = await task;
            if (task === this.lastWrite) return accepted;
            task = this.lastWrite;
        }
    }
    dispose() { this.disposed = true; for (const unsubscribe of this.subscriptions)
        unsubscribe(); this.listeners.clear(); this.applier.dispose(); }
}
