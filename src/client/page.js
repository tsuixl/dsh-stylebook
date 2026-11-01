import { sameAppearance } from '../model/appearance.ts';
import { colorFields, defaults, builtins, weightOptions } from '../model/defaults.ts';
import { resolvePalette, contrastRatio } from '../model/colors.ts';
/** Mount the reviewed DOM and its local interaction handlers; Host I/O lives in the typed bridge. */
export function mountPage(root, bridge, close) {
    const $ = id => root.querySelector('[id="' + id + '"]');
    const icon = name => `<svg aria-hidden="true"><use href="#sb-i-${name}"/></svg>`;
    const clone = value => structuredClone(value);
    const listeners = [];
    function listen(target, event, handler) { target.addEventListener(event, handler, true); listeners.push(() => target.removeEventListener(event, handler, true)); }
    const systemMedia = matchMedia('(prefers-color-scheme: dark)');
    let choiceTrigger = null;
    const commonFonts = ['Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', 'HarmonyOS Sans SC', 'Noto Sans SC', 'PingFang SC', 'Arial', 'Helvetica Neue', 'Consolas', 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'SF Mono'];
    let fonts = [...commonFonts], fontsLoaded = false, activeFontRole = null, fontTrigger = null, config = clone(bridge.snapshot().config), selectedPreset = bridge.snapshot().selectedPreset, customPresets = clone(bridge.snapshot().presets), toastTimer, lastDialogFocus;
    function effectiveMode() { return config.mode === 'system' ? (systemMedia.matches ? 'dark' : 'light') : config.mode; }
    function fontCss(name, code = false) { const fallback = code ? 'Consolas,"SF Mono","Microsoft YaHei",monospace' : '"Segoe UI","Microsoft YaHei UI","PingFang SC",sans-serif'; return name ? `"${name.replace(/["\\\n\r<>]/g, '')}",${fallback}` : fallback; }
    $('typography-controls').innerHTML = ['ui', 'code'].map(role => `<div class="type-row">
  <label class="type-label" id="${role}-font-label" for="${role}-font">${role === 'ui' ? '界面文字' : '代码字体'}</label>
  <div class="type-field type-font"><button type="button" class="font-select-btn" id="${role}-font" data-font-role="${role}" aria-labelledby="${role}-font-label ${role}-font-name" aria-haspopup="listbox" aria-expanded="false"><span class="font-glyph">${role === 'ui' ? 'Aa' : '&lt;/&gt;'}</span><span class="font-name" id="${role}-font-name">系统默认</span>${icon('chevron')}</button></div>
  <div class="type-field type-size"><div class="number-field"><input type="number" id="${role}-size" min="10" max="22" value="14" aria-label="${role === 'ui' ? '界面' : '代码'}字号"><span class="unit">px</span></div></div>
  <div class="type-field type-weight"><button type="button" class="choice-trigger weight-select" id="${role}-weight" data-choice-weight="${role}" aria-label="${role === 'ui' ? '界面' : '代码'}字重" aria-haspopup="listbox" aria-controls="choice-list" aria-expanded="false"><span id="${role}-weight-name">Regular</span>${icon('chevron')}</button></div>
 </div>`).join('');
    $('color-controls').innerHTML = colorFields.map(({ key, name }) => `<div class="color-control"><label class="color-label" for="color-${key}">${name}</label><div class="color-value"><label class="color-swatch" id="swatch-${key}"><input type="color" id="color-${key}" aria-label="${name}颜色"></label><input class="hex-input" id="hex-${key}" aria-label="${name}十六进制颜色" spellcheck="false" maxlength="7"></div></div>`).join('');
    function renderPresets() {
        const preset = [...builtins, ...customPresets].find(p => p.id === selectedPreset);
        $('preset-name-label').textContent = preset.name;
        $('preset-select').dataset.value = selectedPreset;
        $('preset-select').setAttribute('aria-label', '外观方案：' + preset.name);
        $('delete-preset').hidden = !customPresets.some(p => p.id === selectedPreset);
    }
    function contrast(hexA, hexB) { const luminance = hex => { const v = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4); return v[0] * .2126 + v[1] * .7152 + v[2] * .0722; }; const a = luminance(hexA), b = luminance(hexB); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); }
    function apply(){const mode=effectiveMode(),base=config.palettes[mode],palette=resolvePalette(base,mode);root.dataset.theme=mode;root.style.colorScheme=mode;
 for(const [key,value] of Object.entries(palette))root.style.setProperty('--'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),value);
 root.style.setProperty('--ui-font',fontCss(config.uiFont));root.style.setProperty('--code-font',fontCss(config.codeFont,true));root.style.setProperty('--ui-size',config.uiSize+'px');root.style.setProperty('--code-size',config.codeSize+'px');root.style.setProperty('--ui-weight',config.uiWeight);root.style.setProperty('--code-weight',config.codeWeight);
 root.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===config.mode)));
 for(const role of ['ui','code']){$(role+'-font-name').textContent=config[role+'Font']||'系统默认';$(role+'-size').value=config[role+'Size'];$(role+'-weight-name').textContent=weightOptions.find(option=>option.value===config[role+'Weight']).label;$(role+'-weight').dataset.value=config[role+'Weight'];$(role+'-weight').setAttribute('aria-label',(role==='ui'?'界面':'代码')+'字重：'+$(role+'-weight-name').textContent);}
 for(const {key} of colorFields){$('color-'+key).value=base[key];$('hex-'+key).value=base[key].toUpperCase();$('swatch-'+key).style.setProperty('--swatch',base[key]);}
 const preset=[...builtins,...customPresets].find(p=>p.id===selectedPreset);$('modified-badge').classList.toggle('visible',!!preset&&!sameAppearance(preset.value,config));
 const low=contrastRatio(base.accent,base.theme)<3;$('color-note').classList.toggle('warning',low);$('color-note').querySelector('span').textContent=low?'强调色与主题底色接近，建议调整以便辨认。':'浅色与深色配色分别保存，其他区域自动生成。';
    }
    function persist() { return bridge.save({ config, selectedPreset, presets: customPresets }); }
    function update() { apply(); bridge.preview(config); void persist(); }
    function toast(message) { clearTimeout(toastTimer); $('toast').textContent = message; $('toast').classList.add('visible'); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2600); }
    async function closeSettings() { closeFont(); closeChoice(); if (await bridge.flush())
        close(); }
    function closeFont() { if (fontTrigger)
        fontTrigger.setAttribute('aria-expanded', 'false'); $('font-popover').hidden = true; activeFontRole = null; fontTrigger = null; }
    function renderFonts() { const query = $('font-search').value.trim(), term = query.toLocaleLowerCase(); const list = $('font-list'); list.replaceChildren(); let matches = fonts.filter(font => font.toLocaleLowerCase().includes(term)); if (!query)
        matches = ['', ...matches]; for (const font of matches) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'font-option';
        button.setAttribute('role', 'option');
        const selected = config[activeFontRole + 'Font'] === font;
        button.setAttribute('aria-selected', String(selected));
        if (selected)
            button.classList.add('selected');
        const span = document.createElement('span');
        span.className = 'font-option-text';
        span.textContent = font || '系统默认';
        if (font)
            span.style.fontFamily = fontCss(font);
        button.append(span);
        if (selected)
            button.insertAdjacentHTML('beforeend', icon('check'));
        button.addEventListener('click', () => selectFont(font));
        list.append(button);
    } if (query && !fonts.some(font => font.toLocaleLowerCase() === term)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'font-option font-custom';
        button.setAttribute('role', 'option');
        button.textContent = `使用 “${query}”`;
        button.addEventListener('click', () => selectFont(query));
        list.append(button);
    } $('font-list-label').textContent = fontsLoaded ? `系统字体 · ${fonts.length} 个家族` : '常用字体 · 支持手动输入'; }
    function selectFont(font) { config[activeFontRole + 'Font'] = font; const trigger = fontTrigger; closeFont(); update(); trigger?.focus(); }
    function positionFont() { if (!fontTrigger)
        return; const rect = fontTrigger.getBoundingClientRect(), popover = $('font-popover'); const width = Math.min(290, innerWidth - 24); popover.style.width = width + 'px'; popover.style.left = Math.max(12, Math.min(rect.left, innerWidth - width - 12)) + 'px'; const height = popover.offsetHeight; popover.style.top = (rect.bottom + height + 8 > innerHeight ? Math.max(12, rect.top - height - 6) : rect.bottom + 6) + 'px'; }
    function showFont(button) { const role = button.dataset.fontRole; if (activeFontRole === role) {
        closeFont();
        return;
    } closeFont(); closeChoice(); activeFontRole = role; fontTrigger = button; button.setAttribute('aria-expanded', 'true'); $('font-search').value = ''; renderFonts(); $('font-popover').hidden = false; positionFont(); $('font-search').focus(); }
    function closeChoice() {
        if (choiceTrigger)
            choiceTrigger.setAttribute('aria-expanded', 'false');
        $('choice-popover').hidden = true;
        choiceTrigger = null;
    }
    function showChoice(kind, trigger, role = null) {
        if (choiceTrigger === trigger) {
            closeChoice();
            return;
        }
        closeFont();
        closeChoice();
        choiceTrigger = trigger;
        trigger.setAttribute('aria-expanded', 'true');
        const list = $('choice-list');
        list.replaceChildren();
        list.setAttribute('aria-label', kind === 'preset' ? '外观方案' : (role === 'ui' ? '界面' : '代码') + '字重');
        const options = kind === 'preset'
            ? [...builtins.map(p => ({ value: p.id, label: p.name, group: '内置方案' })), ...customPresets.map(p => ({ value: p.id, label: p.name, group: '我的方案' }))]
            : weightOptions;
        let previousGroup = '';
        for (const option of options) {
            if (option.group && option.group !== previousGroup) {
                const heading = document.createElement('div');
                heading.className = 'choice-group-label';
                heading.textContent = option.group;
                list.append(heading);
                previousGroup = option.group;
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'choice-option';
            button.setAttribute('role', 'option');
            const selected = kind === 'preset' ? selectedPreset === option.value : config[role + 'Weight'] === option.value;
            button.setAttribute('aria-selected', String(selected));
            const label = document.createElement('span');
            label.textContent = option.label;
            if (kind === 'weight')
                label.style.fontWeight = option.value;
            button.append(label);
            if (selected)
                button.insertAdjacentHTML('beforeend', icon('check'));
            button.addEventListener('click', () => {
                if (kind === 'preset') {
                    selectedPreset = option.value;
                    config = clone([...builtins, ...customPresets].find(p => p.id === selectedPreset).value);
                    renderPresets();
                }
                else
                    config[role + 'Weight'] = option.value;
                closeChoice();
                update();
                trigger.focus();
            });
            list.append(button);
        }
        const popover = $('choice-popover'), rect = trigger.getBoundingClientRect();
        popover.style.width = Math.min(Math.max(rect.width, kind === 'preset' ? 220 : 160), innerWidth - 24) + 'px';
        popover.hidden = false;
        popover.style.left = Math.max(12, Math.min(rect.left, innerWidth - popover.offsetWidth - 12)) + 'px';
        popover.style.top = (rect.bottom + popover.offsetHeight + 8 > innerHeight ? Math.max(12, rect.top - popover.offsetHeight - 6) : rect.bottom + 6) + 'px';
        (list.querySelector('[aria-selected="true"]') || list.querySelector('button')).focus({ preventScroll: true });
    }
    $('preset-select').addEventListener('click', () => showChoice('preset', $('preset-select')));
    root.querySelectorAll('[data-choice-weight]').forEach(button => button.addEventListener('click', () => showChoice('weight', button, button.dataset.choiceWeight)));
    root.querySelectorAll('.choice-trigger').forEach(button => button.addEventListener('keydown', event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        showChoice(button.id === 'preset-select' ? 'preset' : 'weight', button, button.dataset.choiceWeight || null);
    } }));
    $('choice-list').addEventListener('keydown', event => {
        const items = [...$('choice-list').querySelectorAll('button')], index = items.indexOf(document.activeElement);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
        }
        else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            items[event.key === 'Home' ? 0 : items.length - 1]?.focus();
        }
        else if (event.key === 'Tab') {
            const trigger = choiceTrigger;
            closeChoice();
            trigger?.focus();
        }
    });
    root.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { config.mode = button.dataset.mode; update(); }));
    root.querySelectorAll('[data-font-role]').forEach(button => button.addEventListener('click', () => showFont(button)));
    for (const role of ['ui', 'code']) {
        $(role + '-size').addEventListener('input', event => { const number = Number(event.target.value); if (Number.isInteger(number) && number >= 10 && number <= 22) {
            config[role + 'Size'] = number;
            update();
        } });
        $(role + '-size').addEventListener('change', event => { const number = Number(event.target.value); config[role + 'Size'] = event.target.value !== '' && Number.isFinite(number) ? Math.min(22, Math.max(10, Math.round(number))) : defaults[role + 'Size']; update(); });
    }
    for (const { key, name } of colorFields) {
        $('color-' + key).addEventListener('input', event => { config.palettes[effectiveMode()][key] = event.target.value; update(); });
        $('hex-' + key).addEventListener('input', event => { let value = event.target.value.trim(); if (!value.startsWith('#'))
            value = '#' + value; if (/^#[\da-f]{6}$/i.test(value)) {
            config.palettes[effectiveMode()][key] = value.toLowerCase();
            update();
        } });
        $('hex-' + key).addEventListener('change', event => { let value = event.target.value.trim(); if (value === '')
            value = defaults.palettes[effectiveMode()][key]; if (!value.startsWith('#'))
            value = '#' + value; if (/^#[\da-f]{3}$/i.test(value))
            value = '#' + [...value.slice(1)].map(c => c + c).join(''); if (!/^#[\da-f]{6}$/i.test(value)) {
            toast(name + '：请输入有效的 HEX 色值');
            apply();
            return;
        } config.palettes[effectiveMode()][key] = value.toLowerCase(); update(); });
    }
    $('reset').addEventListener('click', () => { config = clone(defaults); selectedPreset = 'default'; renderPresets(); update(); toast('已恢复默认外观，保存的方案仍然保留'); });
    $('save-preset').addEventListener('click', () => { closeFont(); closeChoice(); lastDialogFocus = document.activeElement; $('save-overlay').hidden = false; root.querySelector('.settings-main').inert = true; $('preset-name').value = ''; $('preset-error').textContent = ''; $('preset-name').focus(); });
    function closeSave() { $('save-overlay').hidden = true; root.querySelector('.settings-main').inert = false; lastDialogFocus?.focus(); }
    $('cancel-save').addEventListener('click', closeSave);
    $('save-form').addEventListener('submit', event => { event.preventDefault(); const name = $('preset-name').value.trim(); if (!name) {
        $('preset-error').textContent = '给这个方案起个名字吧。';
        return;
    } if ([...builtins, ...customPresets].some(p => p.name === name)) {
        $('preset-error').textContent = '已有同名方案，请换一个名称。';
        return;
    } const id = 'custom-' + Date.now().toString(36); customPresets.push({ id, name, value: clone(config) }); selectedPreset = id; renderPresets(); update(); closeSave(); toast('方案 “' + name + '” 已保存'); });
    $('delete-preset').addEventListener('click', () => { const deleted = customPresets.find(p => p.id === selectedPreset); if (!deleted)
        return; customPresets = customPresets.filter(p => p.id !== selectedPreset); selectedPreset = 'default'; renderPresets(); update(); toast('已删除方案，当前外观保持不变'); });
    $('font-search').addEventListener('input', renderFonts);
    $('font-search').addEventListener('keydown', event => { if (event.key === 'ArrowDown') {
        event.preventDefault();
        $('font-list').querySelector('button')?.focus();
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        $('font-list').querySelector('button')?.click();
    } });
    $('font-list').addEventListener('keydown', event => { const items = [...$('font-list').querySelectorAll('button')], i = items.indexOf(document.activeElement); if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        items[(i + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    } });
    $('load-system-fonts').addEventListener('click', async () => { if (typeof window.queryLocalFonts !== 'function') {
        $('font-message').textContent = '当前环境不支持读取系统字体。可输入名称，或在桌面版 Chrome / Edge 中打开。';
        return;
    } const button = $('load-system-fonts'); button.disabled = true; try {
        const available = await window.queryLocalFonts();
        fonts = [...new Set(available.map(font => font.family).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
        fontsLoaded = true;
        if (activeFontRole)
            renderFonts();
        $('font-message').textContent = '已读取 ' + fonts.length + ' 个字体家族。字体只在本机使用。';
        positionFont();
    }
    catch (error) {
        $('font-message').textContent = '未获得字体读取权限。你仍可直接输入字体名称。';
    }
    finally {
        button.disabled = false;
    } });
    root.querySelectorAll('[data-close-settings]').forEach(button => button.addEventListener('click', closeSettings));
    listen(document, 'pointerdown', event => { if (!$('font-popover').hidden && !$('font-popover').contains(event.target) && !event.target.closest('[data-font-role]'))
        closeFont(); if (!$('choice-popover').hidden && !$('choice-popover').contains(event.target) && !choiceTrigger?.contains(event.target))
        closeChoice(); });
    listen(document, 'keydown', event => { if (event.key === 'Escape') {
        event.stopImmediatePropagation();
        event.preventDefault();
        if (!$('save-overlay').hidden) {
            closeSave();
            return;
        }
        if (!$('choice-popover').hidden) {
            const trigger = choiceTrigger;
            closeChoice();
            trigger?.focus();
            return;
        }
        if (!$('font-popover').hidden) {
            const trigger = fontTrigger;
            closeFont();
            trigger?.focus();
            return;
        }
        void closeSettings();
        return;
    } if (event.key === 'Tab') {
        const modal = !$('save-overlay').hidden ? $('save-overlay') : true ? (!$('font-popover').hidden ? $('font-popover') : !$('choice-popover').hidden ? $('choice-popover') : root) : null;
        if (!modal)
            return;
        const focusables = [...modal.querySelectorAll('button:not(:disabled),input,select')].filter(el => el.getClientRects().length > 0 && !el.closest('[hidden]'));
        if (!focusables.length)
            return;
        const first = focusables[0], last = focusables.at(-1);
        if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
            event.preventDefault();
            first.focus();
        }
    } });
    $('settings-scroll').addEventListener('scroll', () => { closeFont(); closeChoice(); });
    listen(window, 'resize', () => { closeFont(); closeChoice(); });
    listen(systemMedia, 'change', () => { if (config.mode === 'system')
        apply(); });
    function receiveState() {
        const state = bridge.snapshot();
        config = clone(state.config); selectedPreset = state.selectedPreset; customPresets = clone(state.presets);
        renderPresets(); apply();
        $('save-status').querySelector('span').textContent = state.status;
        root.querySelectorAll('button,input').forEach(el => {
            if (!el.hasAttribute('data-close-settings') && el.id !== 'cancel-save') el.disabled = !state.writable;
        });
    }
    const unsubscribe = bridge.subscribe(receiveState);
    receiveState();
    return () => { unsubscribe(); for (const dispose of listeners)
        dispose(); clearTimeout(toastTimer); };
}
