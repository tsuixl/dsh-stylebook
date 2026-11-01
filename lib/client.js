window.__ModuleLoader__.load({id:"dsh-stylebook",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");

// src/model/defaults.ts
var colorFields = [{ key: "theme", name: "\u4E3B\u9898\u5E95\u8272" }, { key: "sidebar", name: "\u4FA7\u8FB9\u680F" }, { key: "accent", name: "\u5F3A\u8C03\u8272" }];
var defaults = { mode: "light", uiFont: "", codeFont: "Consolas", uiSize: 14, codeSize: 13, uiWeight: 400, codeWeight: 400, palettes: { light: { theme: "#ffffff", sidebar: "#f5f6fa", accent: "#4d6bfe" }, dark: { theme: "#242934", sidebar: "#1c202a", accent: "#8396ff" } } };
var builtins = [
  { id: "default", name: "\u9ED8\u8BA4 \xB7 Harness", value: structuredClone(defaults) },
  { id: "paper", name: "\u6696\u7EB8 \xB7 \u8F7B\u9605\u8BFB", value: { ...structuredClone(defaults), palettes: { light: { theme: "#fffdf8", sidebar: "#f3efe7", accent: "#a07b4a" }, dark: { theme: "#302d27", sidebar: "#25231f", accent: "#c3a172" } } } },
  { id: "ocean", name: "\u6DF1\u6D77 \xB7 \u4E13\u6CE8", value: { ...structuredClone(defaults), mode: "dark", palettes: { light: { theme: "#fbfdff", sidebar: "#edf3f9", accent: "#497dac" }, dark: { theme: "#1b2b3c", sidebar: "#14202d", accent: "#79a9d5" } } } },
  { id: "forest", name: "\u82D4\u7EFF \xB7 \u5B89\u9759", value: { ...structuredClone(defaults), palettes: { light: { theme: "#fcfdf9", sidebar: "#eef2ed", accent: "#638264" }, dark: { theme: "#25322a", sidebar: "#1d2722", accent: "#94b196" } } } }
];
var weightOptions = [{ value: 400, label: "Regular" }, { value: 500, label: "Medium" }, { value: 600, label: "SemiBold" }, { value: 700, label: "Bold" }];

// src/model/appearance.ts
var clone = (value) => structuredClone(value);
function withoutMode(value) {
  const { mode, ...current } = value;
  return clone(current);
}
var defaultState = { version: 2, current: withoutMode(defaults), selectedPreset: "default", presets: [], legacyBackup: null };
function validAppearanceFields(value, keys) {
  if (!value || typeof value !== "object")
    return false;
  const v = value;
  if (!["light", "dark", "system"].includes(String(v.mode)))
    return false;
  if (!["uiFont", "codeFont"].every((k) => typeof v[k] === "string" && v[k].length <= 256))
    return false;
  if (!["uiSize", "codeSize"].every((k) => Number.isInteger(v[k]) && Number(v[k]) >= 10 && Number(v[k]) <= 22))
    return false;
  if (!["uiWeight", "codeWeight"].every((k) => [400, 500, 600, 700].includes(Number(v[k])) && typeof v[k] === "number"))
    return false;
  const palettes = v.palettes;
  return ["light", "dark"].every((mode) => palettes?.[mode] && Object.keys(palettes[mode]).length === keys.length && keys.every((key) => /^#[\da-f]{6}$/i.test(palettes[mode][key] ?? "")));
}
function validAppearance(value) {
  return validAppearanceFields(value, ["theme", "sidebar", "accent"]);
}
function sameAppearance(a, b) {
  return ["mode", "uiSize", "codeSize", "uiWeight", "codeWeight"].every((key) => a[key] === b[key]) && ["uiFont", "codeFont"].every((key) => a[key].trim().toLowerCase() === b[key].trim().toLowerCase()) && ["light", "dark"].every((mode) => ["theme", "sidebar", "accent"].every((key) => a.palettes[mode][key].toLowerCase() === b.palettes[mode][key].toLowerCase()));
}
function validLegacyAppearance(value) {
  return validAppearanceFields(value, ["sidebar", "workspace", "tools", "composer", "code", "overlay", "accent"]);
}
function validStateFields(value, version, appearanceCheck) {
  if (!value || typeof value !== "object")
    return false;
  const v = value;
  if (v.version !== version || !appearanceCheck({ ...v.current, mode: "light" }) || !Array.isArray(v.presets) || v.presets.length > 100)
    return false;
  const ids = /* @__PURE__ */ new Set(), names = new Set(builtins.map((p) => p.name));
  for (const p of v.presets) {
    if (!p || typeof p.id !== "string" || !p.id.startsWith("custom-") || ids.has(p.id) || typeof p.name !== "string" || p.name !== p.name.trim() || !p.name || p.name.length > 24 || names.has(p.name) || !appearanceCheck(p.value))
      return false;
    ids.add(p.id);
    names.add(p.name);
  }
  return [...builtins.map((p) => p.id), ...ids].includes(v.selectedPreset);
}
function validLegacyState(value) {
  return validStateFields(value, 1, validLegacyAppearance);
}
function validState(value) {
  return validStateFields(value, 2, validAppearance) && (value.legacyBackup == null || validLegacyState(value.legacyBackup));
}
function migrateAppearance(value) {
  const palette = (p) => ({ theme: p.workspace, sidebar: p.sidebar, accent: p.accent });
  return { ...clone(value), palettes: { light: palette(value.palettes.light), dark: palette(value.palettes.dark) } };
}
function readState(value) {
  if (validState(value)) return { ...clone(value), legacyBackup: value.legacyBackup ?? null };
  if (!validLegacyState(value)) return void 0;
  return {
    version: 2,
    current: withoutMode(migrateAppearance({ ...value.current, mode: "light" })),
    selectedPreset: value.selectedPreset,
    presets: value.presets.map((p) => ({ ...p, value: migrateAppearance(p.value) })),
    legacyBackup: clone(value)
  };
}
function fontFamily(name, code = false) {
  const fallback = code ? 'Consolas,"SF Mono","Microsoft YaHei",monospace' : '"Segoe UI","Microsoft YaHei UI","PingFang SC",sans-serif';
  const cleaned = name.replace(/["'\\<>\u0000-\u001f\u007f]/g, "").trim();
  return cleaned ? JSON.stringify(cleaned) + "," + fallback : fallback;
}

// src/model/colors.ts
function surfaceColors(color, mode) {
  const shift = (offset) => "#" + offset.map((delta, index) => {
    const component = parseInt(color.slice(1 + index * 2, 3 + index * 2), 16);
    return Math.max(0, Math.min(255, component + delta)).toString(16).padStart(2, "0");
  }).join("");
  return mode === "dark" ? { surface: shift([-2, -3, -4]), control: shift([5, 5, 5]), subtle: shift([-7, -9, -11]), hover: shift([13, 14, 17]) } : { surface: color.toLowerCase(), control: color.toLowerCase(), subtle: shift([-7, -6, -3]), hover: shift([-15, -13, -8]) };
}
function luminance(color) {
  const values = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrastRatio(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function readableText(background) {
  const candidates = ["#24262e", "#e5e7ef"];
  const best = candidates.sort((a, b) => contrastRatio(background, b) - contrastRatio(background, a))[0];
  if (contrastRatio(background, best) >= 4.5) return best;
  return contrastRatio(background, "#000000") > contrastRatio(background, "#ffffff") ? "#000000" : "#ffffff";
}
function blend(a, b, amount) {
  return "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - amount) + parseInt(b.slice(i, i + 2), 16) * amount).toString(16).padStart(2, "0")).join("");
}
function mutedText(background, foreground) {
  let value = foreground;
  for (let amount = 0.56; amount <= 1; amount += 0.04) {
    value = blend(background, foreground, amount);
    if (contrastRatio(background, value) >= 4.5) return value;
  }
  return foreground;
}
function resolvePalette(base, mode) {
  const theme = base.theme.toLowerCase(), sidebar = base.sidebar.toLowerCase(), accent = base.accent.toLowerCase();
  const surfaces = surfaceColors(theme, mode);
  const text = readableText(theme), sidebarText = readableText(sidebar);
  return {
    theme,
    sidebar,
    accent,
    workspace: theme,
    tools: sidebar,
    composer: surfaces.subtle,
    code: surfaces.subtle,
    overlay: theme,
    ...surfaces,
    hover: blend(theme, text, 0.06),
    text,
    muted: mutedText(theme, text),
    line: blend(theme, text, 0.13),
    sidebarText,
    sidebarMuted: mutedText(sidebar, sidebarText),
    sidebarLine: blend(sidebar, sidebarText, 0.13),
    sidebarHover: blend(sidebar, sidebarText, 0.08),
    accentText: readableText(accent),
    subtleText: readableText(surfaces.subtle)
  };
}

// src/client/dsh/theme.ts
function createThemeApplier(ctx) {
  let release;
  const style = document.createElement("style");
  style.dataset.stylebook = "regions";
  document.head.append(style);
  let fingerprint = "";
  function apply2(config) {
    const next = JSON.stringify(config);
    if (next === fingerprint)
      return;
    fingerprint = next;
    const tokens = {};
    const palettes = { light: resolvePalette(config.palettes.light, "light"), dark: resolvePalette(config.palettes.dark, "dark") };
    const colorMap = {
      "--dsw-specific-sidebar-fill": "sidebar",
      "--dsw-alias-bg-base": "workspace",
      "--dsw-specific-input-major": "composer",
      "--dsw-alias-markdown-code-block": "code",
      "--dsw-alias-bg-overlay": "overlay",
      "--dsw-alias-brand-primary": "accent",
      "--dsw-alias-state-business-primary": "accent",
      "--dsw-focus-ring-color": "accent",
      "--dsw-alias-label-primary": "text",
      "--dsw-alias-label-secondary": "muted",
      "--dsw-alias-label-tertiary": "muted",
      "--dsw-alias-label-primary-dimmed": "muted",
      "--dsw-alias-border-l1": "line",
      "--dsw-alias-border-l2": "line",
      "--dsw-alias-border-l3": "line",
      "--dsw-alias-border-l4": "line",
      "--dsw-alias-interactive-bg-hover-solid": "hover"
    };
    for (const [token, region] of Object.entries(colorMap))
      tokens[token] = { light: palettes.light[region], dark: palettes.dark[region] };
    const surfaces = palettes;
    for (const token of ["--dsw-specific-menu", "--dsw-menu-surface-fill", "--dsw-alias-menu-group-header-fill"])
      tokens[token] = { light: surfaces.light.surface, dark: surfaces.dark.surface };
    const fonts = {
      "--dsh-font-family-text": fontFamily(config.uiFont),
      "--dsh-font-family-code": fontFamily(config.codeFont, true),
      "--dsw-font-family": fontFamily(config.uiFont),
      "--ds-font-family-code": fontFamily(config.codeFont, true),
      "--dsh-content-font-size": config.uiSize + "px",
      "--dsh-code-font-size": config.codeSize + "px"
    };
    for (const [key, value] of Object.entries(fonts))
      tokens[key] = { light: value, dark: value };
    for (const [name, size, weight] of [["s-14", config.uiSize, config.uiWeight], ["xs-13", config.uiSize - 1, config.uiWeight], ["s-strong-14", config.uiSize, Math.max(600, config.uiWeight)]]) {
      const value = `${weight} ${size}px/${size + 8}px var(--dsw-font-family)`;
      tokens["--dsw-font-" + name] = { light: value, dark: value };
    }
    for (const name of ["markdown-code", "markdown-code-block", "markdown-code-block-small"]) {
      const value = `${config.codeWeight} ${config.codeSize}px/${config.codeSize + 7}px var(--ds-font-family-code)`;
      tokens["--dsw-font-" + name] = { light: value, dark: value };
    }
    const old = release;
    release = ctx.theme.overrideTokens("dsh-stylebook", tokens);
    old?.();
    const rules = (mode) => {
      const p = palettes[mode];
      const s = surfaces[mode];
      const scope = mode === "dark" ? "body[data-ds-dark-theme]" : "body:not([data-ds-dark-theme])";
      const sidebar = `--dsw-alias-label-primary:${p.sidebarText};--dsw-alias-label-secondary:${p.sidebarMuted};--dsw-alias-label-tertiary:${p.sidebarMuted};--dsw-alias-label-primary-dimmed:${p.sidebarMuted};--dsw-alias-border-l3:${p.sidebarLine};--dsw-alias-interactive-bg-hover:${p.sidebarHover};--dsw-alias-interactive-bg-hover-solid:${p.sidebarHover}`;
      return `${scope} #root div:has(> [data-shell-bottom]):has(> [data-shell-overlay]) > div:first-child{${sidebar}}
    ${scope} [data-stylebook-panel]>nav{${sidebar}}
    ${scope} [data-sidebar-right-panel]{--dsw-alias-bg-base:${p.tools};--dsw-alias-bg-layer-1:${p.tools};--dsw-alias-bg-layer-2:${p.tools};${sidebar}}
    ${scope} [data-composer-card]{background:${p.composer}}
    ${scope} [data-dockkit-pane]{background:${p.tools};${sidebar}}
    ${scope} [data-menu-material]{--dsw-specific-menu:${s.surface};--dsw-menu-surface-fill:${s.surface};--dsw-alias-menu-group-header-fill:${s.subtle}}
    ${scope} [role="dialog"]{--dsw-alias-bg-base:${s.control};--dsw-alias-bg-layer-1:${s.control};--dsw-alias-bg-layer-2:${p.overlay};--dsw-alias-bg-layer-3:${s.subtle};--dsw-alias-settings-card-fill:${s.control};--dsw-specific-input-major:${s.control};--dsw-alias-interactive-bg-hover-solid:${s.hover}}
    ${scope} [data-shortcut-modal="settings"]{background:${p.overlay}}`;
    };
    style.textContent = rules("light") + "\n" + rules("dark") + `
body{font-weight:${config.uiWeight}}`;
  }
  return { apply: apply2, dispose() {
    release?.();
    style.remove();
  } };
}

// src/client/dsh/settings.ts
var StylebookSettings = class {
  constructor(ctx) {
    this.ctx = ctx;
    this.form = ctx.configForms.get("stylebook");
    this.native = ctx.configForms.get("ui-theme");
    this.applier = createThemeApplier(ctx);
    this.value = { config: { ...clone(defaultState.current), mode: this.mode() }, selectedPreset: "default", presets: [], status: "\u6B63\u5728\u8BFB\u53D6\u8BBE\u7F6E\u2026", writable: false };
    this.subscriptions.push(this.form.subscribe(() => this.adopt()), this.native.subscribe(() => this.adopt()));
    this.adopt();
  }
  form;
  native;
  listeners = /* @__PURE__ */ new Set();
  value;
  pending = 0;
  disposed = false;
  lastWrite = Promise.resolve(true);
  subscriptions = [];
  applier;
  legacyBackup;
  snapshot() {
    return this.value;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit() {
    for (const listener of this.listeners)
      listener();
  }
  mode() {
    const preference = this.native.getSnapshot().value?.preference;
    return preference === "light" || preference === "dark" || preference === "system" ? preference : this.ctx.theme.getTheme().preference;
  }
  adopt(status, migrate = true) {
    if (this.disposed || this.pending)
      return;
    const section = this.form.getSnapshot();
    const data = readState(section.value?.data);
    if (!data) {
      if (section.status !== "loading") {
        this.value = { ...this.value, status: "\u914D\u7F6E\u7248\u672C\u6216\u5185\u5BB9\u65E0\u6CD5\u8BFB\u53D6\uFF0C\u672A\u8986\u76D6\u539F\u6570\u636E", writable: false };
        this.emit();
      }
      return;
    }
    this.legacyBackup = data.legacyBackup;
    this.value = { config: { ...clone(data.current), mode: this.mode() }, selectedPreset: data.selectedPreset, presets: clone(data.presets), status: section.writable ? status ?? "\u66F4\u6539\u81EA\u52A8\u4FDD\u5B58" : "\u5F53\u524D\u914D\u7F6E\u53EA\u8BFB", writable: section.writable };
    this.applier.apply(this.value.config);
    this.emit();
    if (migrate && section.value?.data.version === 1 && section.writable) {
      this.value = { ...this.value, status: "\u6B63\u5728\u8FC1\u79FB\u914D\u8272\u2026" };
      void this.enqueue(() => this.form.mutate([{ op: "set", path: ["data"], value: data }], section.revision), "\u914D\u8272\u5DF2\u8FC1\u79FB", "\u8FC1\u79FB\u672A\u4FDD\u5B58\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u540E\u91CD\u8BD5");
      this.emit();
    }
  }
  // Coordinate the two Host-owned queues as one user action. This is not a cross-form transaction.
  enqueue(write, success, failure) {
    this.pending++;
    const task = this.lastWrite.then(async () => {
      let accepted = false;
      try {
        if (!this.disposed) accepted = await write();
      } catch {
      } finally {
        this.pending--;
        if (!this.pending) this.adopt(accepted ? success : failure, false);
      }
      return accepted;
    });
    this.lastWrite = task;
    return task;
  }
  preview(config) {
    if (!this.disposed) this.applier.apply(config);
  }
  save(draft) {
    const config = clone(draft.config);
    const data = { version: 2, current: withoutMode(config), selectedPreset: draft.selectedPreset, presets: clone(draft.presets), ...this.legacyBackup ? { legacyBackup: clone(this.legacyBackup) } : {} };
    if (this.disposed) return Promise.resolve(false);
    if (!validState(data) || !this.form.getSnapshot().writable) {
      this.value = { ...this.value, status: "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E\u540E\u91CD\u8BD5" };
      this.emit();
      return Promise.resolve(false);
    }
    this.value = { ...clone(draft), writable: true, status: "\u6B63\u5728\u4FDD\u5B58\u2026" };
    const task = this.enqueue(async () => {
      const saved = await this.form.set("data", data);
      if (!saved || this.disposed) return false;
      return this.mode() === config.mode || await this.native.set("preference", config.mode);
    }, "\u5DF2\u4FDD\u5B58", "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF1B\u90E8\u5206\u8BBE\u7F6E\u53EF\u80FD\u5DF2\u751F\u6548");
    this.emit();
    return task;
  }
  async flush() {
    let task = this.lastWrite;
    for (; ; ) {
      const accepted = await task;
      if (task === this.lastWrite) return accepted;
      task = this.lastWrite;
    }
  }
  dispose() {
    this.disposed = true;
    for (const unsubscribe of this.subscriptions)
      unsubscribe();
    this.listeners.clear();
    this.applier.dispose();
  }
};

// src/client/page.js
function mountPage(root, bridge, close) {
  const $ = (id) => root.querySelector('[id="' + id + '"]');
  const icon = (name) => `<svg aria-hidden="true"><use href="#sb-i-${name}"/></svg>`;
  const clone2 = (value) => structuredClone(value);
  const listeners = [];
  function listen(target, event, handler) {
    target.addEventListener(event, handler, true);
    listeners.push(() => target.removeEventListener(event, handler, true));
  }
  const systemMedia = matchMedia("(prefers-color-scheme: dark)");
  let choiceTrigger = null;
  const commonFonts = ["Segoe UI", "Microsoft YaHei UI", "Microsoft YaHei", "HarmonyOS Sans SC", "Noto Sans SC", "PingFang SC", "Arial", "Helvetica Neue", "Consolas", "Cascadia Code", "JetBrains Mono", "Fira Code", "SF Mono"];
  let fonts = [...commonFonts], fontsLoaded = false, activeFontRole = null, fontTrigger = null, config = clone2(bridge.snapshot().config), selectedPreset = bridge.snapshot().selectedPreset, customPresets = clone2(bridge.snapshot().presets), toastTimer, lastDialogFocus;
  function effectiveMode() {
    return config.mode === "system" ? systemMedia.matches ? "dark" : "light" : config.mode;
  }
  function fontCss(name, code = false) {
    const fallback = code ? 'Consolas,"SF Mono","Microsoft YaHei",monospace' : '"Segoe UI","Microsoft YaHei UI","PingFang SC",sans-serif';
    return name ? `"${name.replace(/["\\\n\r<>]/g, "")}",${fallback}` : fallback;
  }
  $("typography-controls").innerHTML = ["ui", "code"].map((role) => `<div class="type-row">
  <label class="type-label" id="${role}-font-label" for="${role}-font">${role === "ui" ? "\u754C\u9762\u6587\u5B57" : "\u4EE3\u7801\u5B57\u4F53"}</label>
  <div class="type-field type-font"><button type="button" class="font-select-btn" id="${role}-font" data-font-role="${role}" aria-labelledby="${role}-font-label ${role}-font-name" aria-haspopup="listbox" aria-expanded="false"><span class="font-glyph">${role === "ui" ? "Aa" : "&lt;/&gt;"}</span><span class="font-name" id="${role}-font-name">\u7CFB\u7EDF\u9ED8\u8BA4</span>${icon("chevron")}</button></div>
  <div class="type-field type-size"><div class="number-field"><input type="number" id="${role}-size" min="10" max="22" value="14" aria-label="${role === "ui" ? "\u754C\u9762" : "\u4EE3\u7801"}\u5B57\u53F7"><span class="unit">px</span></div></div>
  <div class="type-field type-weight"><button type="button" class="choice-trigger weight-select" id="${role}-weight" data-choice-weight="${role}" aria-label="${role === "ui" ? "\u754C\u9762" : "\u4EE3\u7801"}\u5B57\u91CD" aria-haspopup="listbox" aria-controls="choice-list" aria-expanded="false"><span id="${role}-weight-name">Regular</span>${icon("chevron")}</button></div>
 </div>`).join("");
  $("color-controls").innerHTML = colorFields.map(({ key, name }) => `<div class="color-control"><label class="color-label" for="color-${key}">${name}</label><div class="color-value"><label class="color-swatch" id="swatch-${key}"><input type="color" id="color-${key}" aria-label="${name}\u989C\u8272"></label><input class="hex-input" id="hex-${key}" aria-label="${name}\u5341\u516D\u8FDB\u5236\u989C\u8272" spellcheck="false" maxlength="7"></div></div>`).join("");
  function renderPresets() {
    const preset = [...builtins, ...customPresets].find((p) => p.id === selectedPreset);
    $("preset-name-label").textContent = preset.name;
    $("preset-select").dataset.value = selectedPreset;
    $("preset-select").setAttribute("aria-label", "\u5916\u89C2\u65B9\u6848\uFF1A" + preset.name);
    $("delete-preset").hidden = !customPresets.some((p) => p.id === selectedPreset);
  }
  function contrast(hexA, hexB) {
    const luminance2 = (hex) => {
      const v = hex.slice(1).match(/../g).map((n) => parseInt(n, 16) / 255).map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4);
      return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
    };
    const a = luminance2(hexA), b = luminance2(hexB);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  function apply2() {
    const mode = effectiveMode(), base = config.palettes[mode], palette = resolvePalette(base, mode);
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    for (const [key, value] of Object.entries(palette)) root.style.setProperty("--" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), value);
    root.style.setProperty("--ui-font", fontCss(config.uiFont));
    root.style.setProperty("--code-font", fontCss(config.codeFont, true));
    root.style.setProperty("--ui-size", config.uiSize + "px");
    root.style.setProperty("--code-size", config.codeSize + "px");
    root.style.setProperty("--ui-weight", config.uiWeight);
    root.style.setProperty("--code-weight", config.codeWeight);
    root.querySelectorAll("[data-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === config.mode)));
    for (const role of ["ui", "code"]) {
      $(role + "-font-name").textContent = config[role + "Font"] || "\u7CFB\u7EDF\u9ED8\u8BA4";
      $(role + "-size").value = config[role + "Size"];
      $(role + "-weight-name").textContent = weightOptions.find((option) => option.value === config[role + "Weight"]).label;
      $(role + "-weight").dataset.value = config[role + "Weight"];
      $(role + "-weight").setAttribute("aria-label", (role === "ui" ? "\u754C\u9762" : "\u4EE3\u7801") + "\u5B57\u91CD\uFF1A" + $(role + "-weight-name").textContent);
    }
    for (const { key } of colorFields) {
      $("color-" + key).value = base[key];
      $("hex-" + key).value = base[key].toUpperCase();
      $("swatch-" + key).style.setProperty("--swatch", base[key]);
    }
    const preset = [...builtins, ...customPresets].find((p) => p.id === selectedPreset);
    $("modified-badge").classList.toggle("visible", !!preset && !sameAppearance(preset.value, config));
    const low = contrastRatio(base.accent, base.theme) < 3;
    $("color-note").classList.toggle("warning", low);
    $("color-note").querySelector("span").textContent = low ? "\u5F3A\u8C03\u8272\u4E0E\u4E3B\u9898\u5E95\u8272\u63A5\u8FD1\uFF0C\u5EFA\u8BAE\u8C03\u6574\u4EE5\u4FBF\u8FA8\u8BA4\u3002" : "\u6D45\u8272\u4E0E\u6DF1\u8272\u914D\u8272\u5206\u522B\u4FDD\u5B58\uFF0C\u5176\u4ED6\u533A\u57DF\u81EA\u52A8\u751F\u6210\u3002";
  }
  function persist() {
    return bridge.save({ config, selectedPreset, presets: customPresets });
  }
  function update() {
    apply2();
    bridge.preview(config);
    void persist();
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").classList.add("visible");
    toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 2600);
  }
  async function closeSettings() {
    closeFont();
    closeChoice();
    if (await bridge.flush())
      close();
  }
  function closeFont() {
    if (fontTrigger)
      fontTrigger.setAttribute("aria-expanded", "false");
    $("font-popover").hidden = true;
    activeFontRole = null;
    fontTrigger = null;
  }
  function renderFonts() {
    const query = $("font-search").value.trim(), term = query.toLocaleLowerCase();
    const list = $("font-list");
    list.replaceChildren();
    let matches = fonts.filter((font) => font.toLocaleLowerCase().includes(term));
    if (!query)
      matches = ["", ...matches];
    for (const font of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "font-option";
      button.setAttribute("role", "option");
      const selected = config[activeFontRole + "Font"] === font;
      button.setAttribute("aria-selected", String(selected));
      if (selected)
        button.classList.add("selected");
      const span = document.createElement("span");
      span.className = "font-option-text";
      span.textContent = font || "\u7CFB\u7EDF\u9ED8\u8BA4";
      if (font)
        span.style.fontFamily = fontCss(font);
      button.append(span);
      if (selected)
        button.insertAdjacentHTML("beforeend", icon("check"));
      button.addEventListener("click", () => selectFont(font));
      list.append(button);
    }
    if (query && !fonts.some((font) => font.toLocaleLowerCase() === term)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "font-option font-custom";
      button.setAttribute("role", "option");
      button.textContent = `\u4F7F\u7528 \u201C${query}\u201D`;
      button.addEventListener("click", () => selectFont(query));
      list.append(button);
    }
    $("font-list-label").textContent = fontsLoaded ? `\u7CFB\u7EDF\u5B57\u4F53 \xB7 ${fonts.length} \u4E2A\u5BB6\u65CF` : "\u5E38\u7528\u5B57\u4F53 \xB7 \u652F\u6301\u624B\u52A8\u8F93\u5165";
  }
  function selectFont(font) {
    config[activeFontRole + "Font"] = font;
    const trigger = fontTrigger;
    closeFont();
    update();
    trigger?.focus();
  }
  function positionFont() {
    if (!fontTrigger)
      return;
    const rect = fontTrigger.getBoundingClientRect(), popover = $("font-popover");
    const width = Math.min(290, innerWidth - 24);
    popover.style.width = width + "px";
    popover.style.left = Math.max(12, Math.min(rect.left, innerWidth - width - 12)) + "px";
    const height = popover.offsetHeight;
    popover.style.top = (rect.bottom + height + 8 > innerHeight ? Math.max(12, rect.top - height - 6) : rect.bottom + 6) + "px";
  }
  function showFont(button) {
    const role = button.dataset.fontRole;
    if (activeFontRole === role) {
      closeFont();
      return;
    }
    closeFont();
    closeChoice();
    activeFontRole = role;
    fontTrigger = button;
    button.setAttribute("aria-expanded", "true");
    $("font-search").value = "";
    renderFonts();
    $("font-popover").hidden = false;
    positionFont();
    $("font-search").focus();
  }
  function closeChoice() {
    if (choiceTrigger)
      choiceTrigger.setAttribute("aria-expanded", "false");
    $("choice-popover").hidden = true;
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
    trigger.setAttribute("aria-expanded", "true");
    const list = $("choice-list");
    list.replaceChildren();
    list.setAttribute("aria-label", kind === "preset" ? "\u5916\u89C2\u65B9\u6848" : (role === "ui" ? "\u754C\u9762" : "\u4EE3\u7801") + "\u5B57\u91CD");
    const options = kind === "preset" ? [...builtins.map((p) => ({ value: p.id, label: p.name, group: "\u5185\u7F6E\u65B9\u6848" })), ...customPresets.map((p) => ({ value: p.id, label: p.name, group: "\u6211\u7684\u65B9\u6848" }))] : weightOptions;
    let previousGroup = "";
    for (const option of options) {
      if (option.group && option.group !== previousGroup) {
        const heading = document.createElement("div");
        heading.className = "choice-group-label";
        heading.textContent = option.group;
        list.append(heading);
        previousGroup = option.group;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-option";
      button.setAttribute("role", "option");
      const selected = kind === "preset" ? selectedPreset === option.value : config[role + "Weight"] === option.value;
      button.setAttribute("aria-selected", String(selected));
      const label = document.createElement("span");
      label.textContent = option.label;
      if (kind === "weight")
        label.style.fontWeight = option.value;
      button.append(label);
      if (selected)
        button.insertAdjacentHTML("beforeend", icon("check"));
      button.addEventListener("click", () => {
        if (kind === "preset") {
          selectedPreset = option.value;
          config = clone2([...builtins, ...customPresets].find((p) => p.id === selectedPreset).value);
          renderPresets();
        } else
          config[role + "Weight"] = option.value;
        closeChoice();
        update();
        trigger.focus();
      });
      list.append(button);
    }
    const popover = $("choice-popover"), rect = trigger.getBoundingClientRect();
    popover.style.width = Math.min(Math.max(rect.width, kind === "preset" ? 220 : 160), innerWidth - 24) + "px";
    popover.hidden = false;
    popover.style.left = Math.max(12, Math.min(rect.left, innerWidth - popover.offsetWidth - 12)) + "px";
    popover.style.top = (rect.bottom + popover.offsetHeight + 8 > innerHeight ? Math.max(12, rect.top - popover.offsetHeight - 6) : rect.bottom + 6) + "px";
    (list.querySelector('[aria-selected="true"]') || list.querySelector("button")).focus({ preventScroll: true });
  }
  $("preset-select").addEventListener("click", () => showChoice("preset", $("preset-select")));
  root.querySelectorAll("[data-choice-weight]").forEach((button) => button.addEventListener("click", () => showChoice("weight", button, button.dataset.choiceWeight)));
  root.querySelectorAll(".choice-trigger").forEach((button) => button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      showChoice(button.id === "preset-select" ? "preset" : "weight", button, button.dataset.choiceWeight || null);
    }
  }));
  $("choice-list").addEventListener("keydown", (event) => {
    const items = [...$("choice-list").querySelectorAll("button")], index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (event.key === "Tab") {
      const trigger = choiceTrigger;
      closeChoice();
      trigger?.focus();
    }
  });
  root.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    config.mode = button.dataset.mode;
    update();
  }));
  root.querySelectorAll("[data-font-role]").forEach((button) => button.addEventListener("click", () => showFont(button)));
  for (const role of ["ui", "code"]) {
    $(role + "-size").addEventListener("input", (event) => {
      const number = Number(event.target.value);
      if (Number.isInteger(number) && number >= 10 && number <= 22) {
        config[role + "Size"] = number;
        update();
      }
    });
    $(role + "-size").addEventListener("change", (event) => {
      const number = Number(event.target.value);
      config[role + "Size"] = event.target.value !== "" && Number.isFinite(number) ? Math.min(22, Math.max(10, Math.round(number))) : defaults[role + "Size"];
      update();
    });
  }
  for (const { key, name } of colorFields) {
    $("color-" + key).addEventListener("input", (event) => {
      config.palettes[effectiveMode()][key] = event.target.value;
      update();
    });
    $("hex-" + key).addEventListener("input", (event) => {
      let value = event.target.value.trim();
      if (!value.startsWith("#"))
        value = "#" + value;
      if (/^#[\da-f]{6}$/i.test(value)) {
        config.palettes[effectiveMode()][key] = value.toLowerCase();
        update();
      }
    });
    $("hex-" + key).addEventListener("change", (event) => {
      let value = event.target.value.trim();
      if (value === "")
        value = defaults.palettes[effectiveMode()][key];
      if (!value.startsWith("#"))
        value = "#" + value;
      if (/^#[\da-f]{3}$/i.test(value))
        value = "#" + [...value.slice(1)].map((c) => c + c).join("");
      if (!/^#[\da-f]{6}$/i.test(value)) {
        toast(name + "\uFF1A\u8BF7\u8F93\u5165\u6709\u6548\u7684 HEX \u8272\u503C");
        apply2();
        return;
      }
      config.palettes[effectiveMode()][key] = value.toLowerCase();
      update();
    });
  }
  $("reset").addEventListener("click", () => {
    config = clone2(defaults);
    selectedPreset = "default";
    renderPresets();
    update();
    toast("\u5DF2\u6062\u590D\u9ED8\u8BA4\u5916\u89C2\uFF0C\u4FDD\u5B58\u7684\u65B9\u6848\u4ECD\u7136\u4FDD\u7559");
  });
  $("save-preset").addEventListener("click", () => {
    closeFont();
    closeChoice();
    lastDialogFocus = document.activeElement;
    $("save-overlay").hidden = false;
    root.querySelector(".settings-main").inert = true;
    $("preset-name").value = "";
    $("preset-error").textContent = "";
    $("preset-name").focus();
  });
  function closeSave() {
    $("save-overlay").hidden = true;
    root.querySelector(".settings-main").inert = false;
    lastDialogFocus?.focus();
  }
  $("cancel-save").addEventListener("click", closeSave);
  $("save-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("preset-name").value.trim();
    if (!name) {
      $("preset-error").textContent = "\u7ED9\u8FD9\u4E2A\u65B9\u6848\u8D77\u4E2A\u540D\u5B57\u5427\u3002";
      return;
    }
    if ([...builtins, ...customPresets].some((p) => p.name === name)) {
      $("preset-error").textContent = "\u5DF2\u6709\u540C\u540D\u65B9\u6848\uFF0C\u8BF7\u6362\u4E00\u4E2A\u540D\u79F0\u3002";
      return;
    }
    const id = "custom-" + Date.now().toString(36);
    customPresets.push({ id, name, value: clone2(config) });
    selectedPreset = id;
    renderPresets();
    update();
    closeSave();
    toast("\u65B9\u6848 \u201C" + name + "\u201D \u5DF2\u4FDD\u5B58");
  });
  $("delete-preset").addEventListener("click", () => {
    const deleted = customPresets.find((p) => p.id === selectedPreset);
    if (!deleted)
      return;
    customPresets = customPresets.filter((p) => p.id !== selectedPreset);
    selectedPreset = "default";
    renderPresets();
    update();
    toast("\u5DF2\u5220\u9664\u65B9\u6848\uFF0C\u5F53\u524D\u5916\u89C2\u4FDD\u6301\u4E0D\u53D8");
  });
  $("font-search").addEventListener("input", renderFonts);
  $("font-search").addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      $("font-list").querySelector("button")?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      $("font-list").querySelector("button")?.click();
    }
  });
  $("font-list").addEventListener("keydown", (event) => {
    const items = [...$("font-list").querySelectorAll("button")], i = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      items[(i + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }
  });
  $("load-system-fonts").addEventListener("click", async () => {
    if (typeof window.queryLocalFonts !== "function") {
      $("font-message").textContent = "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u8BFB\u53D6\u7CFB\u7EDF\u5B57\u4F53\u3002\u53EF\u8F93\u5165\u540D\u79F0\uFF0C\u6216\u5728\u684C\u9762\u7248 Chrome / Edge \u4E2D\u6253\u5F00\u3002";
      return;
    }
    const button = $("load-system-fonts");
    button.disabled = true;
    try {
      const available = await window.queryLocalFonts();
      fonts = [...new Set(available.map((font) => font.family).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
      fontsLoaded = true;
      if (activeFontRole)
        renderFonts();
      $("font-message").textContent = "\u5DF2\u8BFB\u53D6 " + fonts.length + " \u4E2A\u5B57\u4F53\u5BB6\u65CF\u3002\u5B57\u4F53\u53EA\u5728\u672C\u673A\u4F7F\u7528\u3002";
      positionFont();
    } catch (error) {
      $("font-message").textContent = "\u672A\u83B7\u5F97\u5B57\u4F53\u8BFB\u53D6\u6743\u9650\u3002\u4F60\u4ECD\u53EF\u76F4\u63A5\u8F93\u5165\u5B57\u4F53\u540D\u79F0\u3002";
    } finally {
      button.disabled = false;
    }
  });
  root.querySelectorAll("[data-close-settings]").forEach((button) => button.addEventListener("click", closeSettings));
  listen(document, "pointerdown", (event) => {
    if (!$("font-popover").hidden && !$("font-popover").contains(event.target) && !event.target.closest("[data-font-role]"))
      closeFont();
    if (!$("choice-popover").hidden && !$("choice-popover").contains(event.target) && !choiceTrigger?.contains(event.target))
      closeChoice();
  });
  listen(document, "keydown", (event) => {
    if (event.key === "Escape") {
      event.stopImmediatePropagation();
      event.preventDefault();
      if (!$("save-overlay").hidden) {
        closeSave();
        return;
      }
      if (!$("choice-popover").hidden) {
        const trigger = choiceTrigger;
        closeChoice();
        trigger?.focus();
        return;
      }
      if (!$("font-popover").hidden) {
        const trigger = fontTrigger;
        closeFont();
        trigger?.focus();
        return;
      }
      void closeSettings();
      return;
    }
    if (event.key === "Tab") {
      const modal = !$("save-overlay").hidden ? $("save-overlay") : true ? !$("font-popover").hidden ? $("font-popover") : !$("choice-popover").hidden ? $("choice-popover") : root : null;
      if (!modal)
        return;
      const focusables = [...modal.querySelectorAll("button:not(:disabled),input,select")].filter((el) => el.getClientRects().length > 0 && !el.closest("[hidden]"));
      if (!focusables.length)
        return;
      const first = focusables[0], last = focusables.at(-1);
      if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  $("settings-scroll").addEventListener("scroll", () => {
    closeFont();
    closeChoice();
  });
  listen(window, "resize", () => {
    closeFont();
    closeChoice();
  });
  listen(systemMedia, "change", () => {
    if (config.mode === "system")
      apply2();
  });
  function receiveState() {
    const state = bridge.snapshot();
    config = clone2(state.config);
    selectedPreset = state.selectedPreset;
    customPresets = clone2(state.presets);
    renderPresets();
    apply2();
    $("save-status").querySelector("span").textContent = state.status;
    root.querySelectorAll("button,input").forEach((el) => {
      if (!el.hasAttribute("data-close-settings") && el.id !== "cancel-save") el.disabled = !state.writable;
    });
  }
  const unsubscribe = bridge.subscribe(receiveState);
  receiveState();
  return () => {
    unsubscribe();
    for (const dispose of listeners)
      dispose();
    clearTimeout(toastTimer);
  };
}

// src/client/appearance.css
var appearance_default = '@scope (.stylebook-page) {\n  :scope {\n    font-family:\n      Inter,\n      "Segoe UI",\n      "Microsoft YaHei UI",\n      "PingFang SC",\n      sans-serif;\n    color: #24262e;\n    background: #e9ebf0;\n    font-synthesis: none;\n    --accent:#4d6bfe;\n    --text:#24262e;\n    --muted:#858a98;\n    --line:#eceef3;\n    --surface:#fff;\n    --subtle:#f8f9fc;\n    --control:#fff;\n    --hover:#f0f2f7;\n    --ui-font:"Segoe UI","Microsoft YaHei UI",sans-serif;\n    --code-font:Consolas,"SFMono-Regular",monospace;\n    --ui-size:14px;\n    --code-size:13px;\n    --ui-weight:400;\n    --code-weight:400;\n    --sidebar:#f5f6fa;\n    --workspace:#ffffff;\n    --tools:#f9fafc;\n    --composer:#f6f7fb;\n    --code:#f5f6fa;\n    --overlay:#ffffff;\n  }\n  * {\n    box-sizing: border-box;\n  }\n  body {\n    margin: 0;\n  }\n  button,\n  input,\n  select {\n    font: inherit;\n  }\n  button {\n    cursor: pointer;\n    color: inherit;\n  }\n  button:disabled {\n    cursor: default;\n  }\n  button,\n  input,\n  select {\n    outline: none;\n  }\n  button:focus-visible,\n  input:focus-visible,\n  select:focus-visible {\n    outline: 3px solid color-mix(in srgb, var(--accent) 38%, transparent);\n    outline-offset: 3px;\n  }\n  button {\n    border: 0;\n    background: none;\n  }\n  svg {\n    width: 18px;\n    height: 18px;\n    fill: none;\n    stroke: currentColor;\n    stroke-width: 1.65;\n    stroke-linecap: round;\n    stroke-linejoin: round;\n    flex-shrink: 0;\n  }\n  button svg {\n    pointer-events: none;\n  }\n  [hidden] {\n    display: none !important;\n  }\n  .symbol-defs {\n    position: absolute;\n    width: 0;\n    height: 0;\n    overflow: hidden;\n  }\n  .muted {\n    color: var(--muted);\n  }\n  .icon-btn {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 32px;\n    height: 32px;\n    border-radius: 8px;\n    color: var(--muted);\n  }\n  .icon-btn:hover {\n    background: var(--hover);\n    color: var(--text);\n  }\n  :scope[data-theme=dark] {\n    color-scheme: dark;\n    --text:#e5e7ef;\n    --muted:#9298aa;\n    --line:#303441;\n    --surface:#222630;\n    --subtle:#1d2029;\n    --control:#292e39;\n    --hover:#313745;\n  }\n  .prototype-bar {\n    height: 43px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 0 22px;\n    background: #f5f6f8;\n    color: #697080;\n    border-bottom: 1px solid #dde1e8;\n    font-size: 12px;\n    position: relative;\n    z-index: 5;\n  }\n  .prototype-brand {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n  }\n  .prototype-brand strong {\n    font-size: 12px;\n    color: #3d4555;\n    font-weight: 600;\n  }\n  .prototype-tag {\n    border: 1px solid #dce0e8;\n    border-radius: 5px;\n    padding: 2px 6px;\n    font-size: 10px;\n    color: #858b98;\n  }\n  .prototype-actions {\n    display: flex;\n    align-items: center;\n    gap: 16px;\n  }\n  .prototype-actions button {\n    font-size: 12px;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    color: #4d5d7a;\n  }\n  .prototype-actions svg {\n    width: 14px;\n    height: 14px;\n  }\n  .live-dot {\n    width: 5px;\n    height: 5px;\n    border-radius: 50%;\n    background: #7c9f86;\n    display: inline-block;\n    margin-right: 6px;\n  }\n  .workspace {\n    --ws-font-size:var(--ui-size);\n    display: grid;\n    grid-template-columns: 216px minmax(0, 1fr) 245px;\n    height: calc(100dvh - 43px);\n    min-height: 580px;\n    background: var(--workspace);\n    font-family: var(--ui-font);\n    font-size: var(--ws-font-size);\n    font-weight: var(--ui-weight);\n    color: var(--text);\n    overflow: hidden;\n  }\n  .ws-sidebar {\n    background: var(--sidebar);\n    padding: 22px 14px 14px;\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    border-right: 1px solid var(--line);\n    min-width: 0;\n  }\n  .wordmark {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    padding: 0 9px;\n    color: var(--text);\n    font-family: "Segoe UI", sans-serif;\n    font-weight: 600;\n    font-size: 23px;\n    letter-spacing: -1px;\n  }\n  .brand-mark {\n    width: 24px;\n    height: 24px;\n    display: grid;\n    place-items: center;\n    background: var(--accent);\n    color: #fff;\n    border-radius: 8px;\n    font-size: 16px;\n    letter-spacing: -1px;\n    font-weight: 700;\n    transform: rotate(-6deg);\n  }\n  .new-chat {\n    border: 1px solid var(--line);\n    border-radius: 9px;\n    background: var(--workspace);\n    padding: 10px 12px;\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    margin-top: 6px;\n    font-size: .93em;\n  }\n  .ws-navigation {\n    display: grid;\n    gap: 4px;\n  }\n  .ws-nav-item {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    padding: 9px 11px;\n    border-radius: 8px;\n    color: var(--muted);\n    font-size: .92em;\n  }\n  .ws-nav-item.selected {\n    background: color-mix(in srgb, var(--accent) 8%, var(--sidebar));\n    color: var(--accent);\n  }\n  .ws-caption {\n    font-size: .8em;\n    color: var(--muted);\n    margin: 14px 11px 8px;\n  }\n  .ws-session {\n    padding: 10px 11px;\n    font-size: .89em;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    border-radius: 8px;\n  }\n  .ws-session.current {\n    background: color-mix(in srgb, var(--accent) 7%, var(--sidebar));\n    color: var(--accent);\n  }\n  .ws-bottom {\n    margin-top: auto;\n    display: grid;\n    gap: 5px;\n  }\n  .ws-settings {\n    display: flex;\n    align-items: center;\n    gap: 9px;\n    padding: 11px;\n    border-radius: 8px;\n    text-align: left;\n    font-size: inherit;\n    width: 100%;\n  }\n  .ws-settings:hover {\n    background: var(--hover);\n  }\n  .ws-account {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    padding: 8px 11px;\n    font-size: 12px;\n    color: var(--muted);\n  }\n  .avatar {\n    display: grid;\n    place-items: center;\n    background: #e3e7f2;\n    color: #727e99;\n    font-size: 10px;\n    font-weight: 600;\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n  }\n  .ws-main {\n    display: flex;\n    flex-direction: column;\n    min-width: 0;\n    background: var(--workspace);\n  }\n  .ws-header {\n    height: 62px;\n    border-bottom: 1px solid var(--line);\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    padding: 0 28px;\n    font-size: .92em;\n  }\n  .ws-header-title {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    min-width: 0;\n  }\n  .ws-header-title span {\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n  .ws-header-actions {\n    display: flex;\n    gap: 14px;\n    color: var(--muted);\n  }\n  .ws-messages {\n    width: min(100%, 760px);\n    margin: 0 auto;\n    padding: 42px 36px;\n    overflow: auto;\n    flex: 1;\n  }\n  .user-message {\n    padding: 13px 18px;\n    border-radius: 16px 16px 4px 16px;\n    background: color-mix(in srgb, var(--accent) 7%, var(--workspace));\n    width: fit-content;\n    max-width: 88%;\n    margin: 0 0 30px auto;\n    line-height: 1.7;\n  }\n  .assistant-heading {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    font-weight: 600;\n    font-size: .95em;\n    margin-bottom: 15px;\n  }\n  .assistant-heading .brand-mark {\n    width: 22px;\n    height: 22px;\n    border-radius: 7px;\n    font-size: 13px;\n  }\n  .assistant-text {\n    line-height: 1.9;\n    margin: 0 0 16px;\n  }\n  .assistant-list {\n    line-height: 1.95;\n    margin: 12px 0 19px;\n    padding-left: 21px;\n  }\n  .assistant-list li {\n    padding-left: 3px;\n  }\n  .ws-code {\n    background: var(--code);\n    border: 1px solid var(--line);\n    border-radius: 10px;\n    overflow: hidden;\n    margin: 17px 0;\n  }\n  .code-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    border-bottom: 1px solid var(--line);\n    color: var(--muted);\n    padding: 8px 13px;\n    font-size: 11px;\n    font-family: "Segoe UI", sans-serif;\n  }\n  .code-header svg {\n    width: 13px;\n    height: 13px;\n  }\n  .code-content {\n    white-space: pre-wrap;\n    padding: 14px 16px;\n    line-height: 1.8;\n    margin: 0;\n    font-family: var(--code-font);\n    font-size: var(--code-size);\n    font-weight: var(--code-weight);\n  }\n  .token-key {\n    color: #8763b6;\n  }\n  .token-string {\n    color: #438476;\n  }\n  .token-number {\n    color: #c28b4b;\n  }\n  .token-comment {\n    color: #9299a7;\n  }\n  .message-actions {\n    display: flex;\n    gap: 15px;\n    color: var(--muted);\n    margin-top: 18px;\n  }\n  .message-actions svg {\n    width: 15px;\n    height: 15px;\n  }\n  .ws-compose-wrap {\n    padding: 0 30px 20px;\n    width: min(100%, 810px);\n    margin: 0 auto;\n  }\n  .ws-compose {\n    border: 1px solid var(--line);\n    background: var(--composer);\n    border-radius: 15px;\n    padding: 16px 16px 12px;\n    box-shadow: 0 2px 5px #00000003;\n  }\n  .compose-placeholder {\n    color: var(--muted);\n    padding: 0 0 30px;\n    font-size: .95em;\n  }\n  .compose-tools {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    color: var(--muted);\n    font-size: .83em;\n  }\n  .compose-tools-left {\n    display: flex;\n    align-items: center;\n    gap: 13px;\n  }\n  .model-chip {\n    display: flex;\n    gap: 5px;\n    align-items: center;\n  }\n  .model-chip svg {\n    width: 12px;\n    height: 12px;\n  }\n  .send-button {\n    width: 29px;\n    height: 29px;\n    background: var(--accent);\n    color: #fff;\n    border-radius: 9px;\n    display: grid;\n    place-items: center;\n  }\n  .workspace-caption {\n    text-align: center;\n    font-size: 10px;\n    color: var(--muted);\n    margin-top: 10px;\n  }\n  .ws-tools {\n    background: var(--tools);\n    border-left: 1px solid var(--line);\n    padding: 19px 14px;\n    color: var(--muted);\n  }\n  .tools-top {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    color: var(--text);\n    font-size: .92em;\n    padding: 3px 4px 17px;\n  }\n  .tools-tabs {\n    display: flex;\n    gap: 15px;\n    font-size: .82em;\n    border-bottom: 1px solid var(--line);\n    padding: 0 4px 11px;\n  }\n  .tools-tabs .active {\n    color: var(--accent);\n    position: relative;\n  }\n  .tools-tabs .active:after {\n    content: "";\n    height: 2px;\n    background: var(--accent);\n    position: absolute;\n    left: 0;\n    right: 0;\n    bottom: -12px;\n  }\n  .file-tree {\n    display: grid;\n    gap: 14px;\n    font-size: .83em;\n    padding: 20px 3px;\n  }\n  .file-item {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    white-space: nowrap;\n    min-width: 0;\n  }\n  .file-item svg {\n    width: 15px;\n    height: 15px;\n  }\n  .file-indent {\n    padding-left: 17px;\n  }\n  .file-current {\n    color: var(--accent);\n  }\n  .file-note {\n    border: 1px solid var(--line);\n    border-radius: 8px;\n    font-size: .78em;\n    line-height: 1.8;\n    margin: 12px 0;\n    padding: 11px;\n  }\n  .file-note strong {\n    color: var(--text);\n    font-weight: 500;\n    display: block;\n    margin-bottom: 3px;\n  }\n  .settings-backdrop {\n    position: fixed;\n    inset: 43px 0 0;\n    z-index: 10;\n    background: rgba(24, 32, 52, .23);\n    backdrop-filter: blur(3px);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 25px 30px;\n  }\n  .settings-window {\n    width: min(900px, 100%);\n    height: min(864px, 100%);\n    min-height: 440px;\n    background: var(--surface);\n    display: grid;\n    grid-template-columns: 162px minmax(0, 1fr);\n    border: 1px solid color-mix(in srgb, var(--line) 75%, white);\n    border-radius: 18px;\n    box-shadow: 0 28px 90px #101a3533, 0 2px 12px #101a3510;\n    overflow: hidden;\n    position: relative;\n    color: var(--text);\n    font-family:\n      "Segoe UI",\n      "Microsoft YaHei UI",\n      "PingFang SC",\n      sans-serif;\n    font-size: 13px;\n    font-weight: 400;\n  }\n  .settings-nav {\n    padding: 25px 12px;\n    background: var(--subtle);\n    border-right: 1px solid var(--line);\n    display: flex;\n    flex-direction: column;\n  }\n  .settings-label {\n    font-size: 17px;\n    font-weight: 600;\n    letter-spacing: .3px;\n    margin: 0 12px 27px;\n  }\n  .nav-items {\n    display: grid;\n    gap: 5px;\n  }\n  .nav-item {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    border-radius: 8px;\n    padding: 11px 13px;\n    color: var(--muted);\n    font-size: 13px;\n    text-align: left;\n    position: relative;\n  }\n  .nav-item svg {\n    width: 17px;\n    height: 17px;\n  }\n  .nav-item.selected {\n    color: var(--accent);\n    background: color-mix(in srgb, var(--accent) 9%, transparent);\n    font-weight: 600;\n  }\n  .nav-item.selected:before {\n    content: "";\n    height: 14px;\n    width: 3px;\n    border-radius: 4px;\n    background: var(--accent);\n    position: absolute;\n    left: 0;\n  }\n  .nav-items button:disabled {\n    opacity: .75;\n  }\n  .nav-foot {\n    margin-top: auto;\n    padding: 14px 12px 0;\n    color: var(--muted);\n    font-size: 11px;\n    line-height: 1.9;\n  }\n  .nav-foot .version {\n    font-size: 10px;\n    color: color-mix(in srgb, var(--muted) 70%, transparent);\n  }\n  .settings-main {\n    min-width: 0;\n    min-height: 0;\n    display: flex;\n    flex-direction: column;\n    background: var(--overlay);\n  }\n  .settings-head {\n    padding: 26px 28px 18px;\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 12px;\n    flex-shrink: 0;\n  }\n  .settings-head h1 {\n    font-size: 23px;\n    line-height: 1.25;\n    letter-spacing: .4px;\n    font-weight: 650;\n    margin: 0 0 8px;\n  }\n  .settings-head p {\n    margin: 0;\n    color: var(--muted);\n    font-size: 12px;\n  }\n  .head-actions {\n    display: flex;\n    gap: 3px;\n  }\n  .settings-close {\n    display: inline-flex;\n  }\n  .settings-scroll {\n    padding: 0 28px 28px;\n    overflow-y: auto;\n    min-height: 0;\n    scrollbar-width: thin;\n    scrollbar-color: color-mix(in srgb, var(--muted) 25%, transparent) transparent;\n  }\n  .preset-bar{display:flex;align-items:center;gap:9px;min-height:40px}\n  \n  \n  .preset-select {\n    position: relative;\n    flex: 1;\n    min-width: 0;\n  }\n  .choice-trigger {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    text-align: left;\n    background: var(--control);\n    border: 1px solid var(--line);\n    border-radius: 8px;\n    padding: 0 11px;\n    min-width: 0;\n    color: var(--text);\n    font-size: 13px;\n  }\n  .choice-trigger:hover {\n    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));\n  }\n  .choice-trigger[aria-expanded=true] {\n    border-color: var(--accent);\n  }\n  .choice-trigger > span {\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .choice-trigger svg {\n    width: 14px;\n    height: 14px;\n    color: var(--muted);\n  }\n  .preset-trigger {\n    height: 38px;\n    width: 100%;\n    font-weight: 500;\n  }\n  .modified-badge {\n    font-size: 10px;\n    color: #b28a47;\n    white-space: nowrap;\n    display: none;\n  }\n  .modified-badge.visible {\n    display: inline;\n  }\n  .small-button {\n    font-size: 11px;\n    white-space: nowrap;\n    padding: 7px 10px;\n    border: 1px solid var(--line);\n    border-radius: 7px;\n    background: var(--control);\n    font-weight: 500;\n  }\n  .small-button:hover {\n    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));\n    color: var(--accent);\n  }\n  .preset-delete {\n    width: 25px;\n    height: 25px;\n  }\n  .preset-delete svg {\n    width: 13px;\n    height: 13px;\n  }\n  .section{margin:0 0 16px;padding:20px;min-width:0;border:1px solid var(--line);border-radius:16px;background:var(--overlay)}\n  .section:last-child {\n    margin-bottom: 0;\n  }\n  .section-heading{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin-bottom:16px}\n  .section-heading h2{font-size:14px;line-height:22px;margin:0;font-weight:600;display:flex;align-items:center;gap:7px}\n  .section-heading h2 svg {\n    width: 15px;\n    height: 15px;\n    color: var(--muted);\n  }\n  .section-note{color:var(--muted);font-size:12px;line-height:18px}\n  .theme-options {\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: 10px;\n  }\n  .theme-option {\n    padding: 0;\n    border: 1px solid var(--line);\n    border-radius: 9px;\n    overflow: hidden;\n    text-align: left;\n    background: var(--control);\n    position: relative;\n    transition: border-color .15s, box-shadow .15s;\n  }\n  .theme-option:hover {\n    border-color: color-mix(in srgb, var(--accent) 50%, var(--line));\n  }\n  .theme-option[aria-pressed=true] {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 1px var(--accent);\n  }\n  .theme-thumb {\n    height: 42px;\n    padding: 8px 10px 0;\n    display: flex;\n    gap: 6px;\n    overflow: hidden;\n    background: #edf0f5;\n  }\n  .theme-thumb.dark {\n    background: #252c3c;\n  }\n  .theme-thumb.system {\n    background:\n      linear-gradient(\n        110deg,\n        #edf0f5 50%,\n        #252c3c 50%);\n  }\n  .theme-mini-sidebar {\n    width: 27%;\n    background: #dce1eb;\n    border-radius: 3px 3px 0 0;\n    padding: 7px 5px;\n    display: grid;\n    align-content: start;\n    gap: 4px;\n  }\n  .theme-mini-sidebar:before,\n  .theme-mini-sidebar:after {\n    content: "";\n    height: 3px;\n    border-radius: 2px;\n    background: #b6c0d2;\n  }\n  .theme-mini-main {\n    background: #fff;\n    border-radius: 3px 3px 0 0;\n    flex: 1;\n    padding: 8px;\n    display: grid;\n    align-content: start;\n    gap: 5px;\n  }\n  .theme-mini-main:before,\n  .theme-mini-main:after {\n    content: "";\n    height: 3px;\n    border-radius: 2px;\n    background: #d9dfeb;\n    width: 70%;\n  }\n  .theme-mini-main:after {\n    width: 45%;\n  }\n  .theme-thumb.dark .theme-mini-sidebar {\n    background: #343e52;\n  }\n  .theme-thumb.dark .theme-mini-sidebar:before,\n  .theme-thumb.dark .theme-mini-sidebar:after {\n    background: #53627c;\n  }\n  .theme-thumb.dark .theme-mini-main {\n    background: #1d2433;\n  }\n  .theme-thumb.dark .theme-mini-main:before,\n  .theme-thumb.dark .theme-mini-main:after {\n    background: #3c4a65;\n  }\n  .theme-thumb.system .theme-mini-main {\n    background:\n      linear-gradient(\n        110deg,\n        #fff 35%,\n        #1d2433 35%);\n  }\n  .theme-option-label {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 8px 10px;\n    font-size: 11px;\n    font-weight: 500;\n  }\n  .theme-option-label > span {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n  }\n  .theme-option-label svg {\n    width: 12px;\n    height: 12px;\n  }\n  .theme-check {\n    width: 14px;\n    height: 14px;\n    border: 1px solid var(--line);\n    border-radius: 50%;\n    display: grid;\n    place-items: center;\n    color: transparent;\n  }\n  .theme-option[aria-pressed=true] .theme-check {\n    background: var(--accent);\n    color: #fff;\n    border-color: var(--accent);\n  }\n  .theme-check svg {\n    width: 10px;\n    height: 10px;\n  }\n  \n  .type-row{display:grid;grid-template-columns:76px minmax(0,1fr) 70px 112px;gap:9px;align-items:center;min-height:60px;padding:10px 0;margin:0}\n  .type-field {\n    min-width: 0;\n    position: relative;\n  }\n  \n  .font-select-btn {\n    width: 100%;\n    height: 40px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    border: 1px solid var(--line);\n    border-radius: 7px;\n    padding: 0 10px;\n    background: var(--control);\n    text-align: left;\n    font-size: 14px;\n  }\n  .font-select-btn:hover {\n    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));\n  }\n  .font-select-btn .font-name {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    flex: 1;\n  }\n  .font-select-btn .font-glyph {\n    color: var(--muted);\n    font-family: Georgia, serif;\n    font-size: 14px;\n  }\n  .font-select-btn svg {\n    width: 13px;\n    height: 13px;\n    color: var(--muted);\n  }\n  .number-field {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    border: 1px solid var(--line);\n    height: 40px;\n    border-radius: 8px;\n    background: var(--control);\n    padding: 0 12px;\n  }\n  .number-field input {\n    border: 0;\n    background: none;\n    color: var(--text);\n    padding: 0;\n    width: 100%;\n    min-width: 0;\n    flex: 1;\n    font-size: 16px;\n    font-weight: 400;\n    font-variant-numeric: tabular-nums;\n    appearance: textfield;\n    -moz-appearance: textfield;\n  }\n  .number-field input::-webkit-inner-spin-button,\n  .number-field input::-webkit-outer-spin-button {\n    appearance: none;\n    margin: 0;\n  }\n  .number-field .unit {\n    font-size: 12px;\n    color: var(--muted);\n  }\n  .number-field:focus-within {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);\n  }\n  .number-field input:focus-visible {\n    outline: none;\n  }\n  .weight-select {\n    height: 40px;\n    width: 100%;\n    font-size: 13px;\n  }\n  .type-sample{margin-top:16px;background:var(--subtle);border-radius:8px;padding:12px 14px;border:1px solid var(--line);display:grid;gap:7px;overflow:hidden}\n  .type-sample-ui {\n    font-family: var(--ui-font);\n    font-size: var(--ui-size);\n    font-weight: var(--ui-weight);\n    line-height: 1.5;\n    overflow-wrap: anywhere;\n  }\n  .type-sample-code {\n    font-family: var(--code-font);\n    font-size: var(--code-size);\n    font-weight: var(--code-weight);\n    line-height: 1.6;\n    overflow-wrap: anywhere;\n  }\n  .type-sample-code span:first-child {\n    color: var(--accent);\n  }\n  \n  \n  \n  .color-value {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    height: 32px;\n    padding: 0 9px;\n    border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);\n    border-radius: 999px;\n    background: var(--surface);\n    flex: 0 0 auto;\n    transition: border-color .15s, box-shadow .15s;\n  }\n  .color-value:hover {\n    border-color: color-mix(in srgb, var(--text) 24%, transparent);\n  }\n  .color-value:focus-within {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 2px var(--accent);\n  }\n  .color-swatch {\n    position: relative;\n    width: 14px;\n    height: 14px;\n    border-radius: 50%;\n    flex-shrink: 0;\n    overflow: hidden;\n    border: 1px solid #80808028;\n    background: var(--swatch);\n  }\n  .color-swatch input {\n    position: absolute;\n    inset: 0;\n    width: 100%;\n    height: 100%;\n    padding: 0;\n    border: 0;\n    opacity: 0;\n    cursor: pointer;\n  }\n  .hex-input {\n    width: 68px;\n    min-width: 0;\n    font: 600 14px/20px var(--ui-font);\n    letter-spacing: 0;\n    border: 0;\n    background: transparent;\n    color: var(--text);\n    padding: 0;\n    text-transform: uppercase;\n    text-align: left;\n    border-radius: 0;\n  }\n  .hex-input:focus-visible {\n    outline: none;\n  }\n  \n  .color-footnote {\n    font-size: 10px;\n    color: var(--muted);\n    margin: 10px 0 0;\n    display: flex;\n    gap: 5px;\n    align-items: flex-start;\n    line-height: 1.65;\n  }\n  .color-footnote svg {\n    width: 12px;\n    height: 12px;\n    margin-top: 2px;\n  }\n  .color-footnote.warning {\n    color: #b58b4b;\n  }\n  .footer {\n    margin-top: auto;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    border-top: 1px solid var(--line);\n    padding: 15px 28px;\n    background: var(--overlay);\n    min-height: 65px;\n    flex-shrink: 0;\n  }\n  .reset-btn {\n    font-size: 11px;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    color: var(--muted);\n    padding: 5px 0;\n  }\n  .reset-btn:hover {\n    color: var(--accent);\n  }\n  .reset-btn svg {\n    width: 13px;\n    height: 13px;\n  }\n  .footer-right {\n    display: flex;\n    gap: 14px;\n    align-items: center;\n  }\n  .save-status {\n    font-size: 10px;\n    color: var(--muted);\n    display: flex;\n    align-items: center;\n    gap: 4px;\n  }\n  .save-status svg {\n    width: 12px;\n    height: 12px;\n    color: #83a28c;\n  }\n  .primary-btn {\n    background: var(--accent);\n    color: white;\n    border-radius: 7px;\n    padding: 9px 21px;\n    font-size: 12px;\n    font-weight: 500;\n    white-space: nowrap;\n  }\n  .primary-btn:hover {\n    filter: brightness(1.06);\n  }\n  .font-popover {\n    position: fixed;\n    width: 285px;\n    background: var(--surface);\n    color: var(--text);\n    border: 1px solid var(--line);\n    border-radius: 11px;\n    box-shadow: 0 12px 45px #18213b30;\n    z-index: 30;\n    padding: 9px;\n    overflow: hidden;\n  }\n  .font-search {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    background: var(--subtle);\n    border: 1px solid var(--line);\n    border-radius: 9px;\n    padding: 10px;\n    margin-bottom: 8px;\n    transition: border-color .15s, box-shadow .15s;\n  }\n  .font-search:focus-within {\n    border-color: var(--accent);\n    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);\n  }\n  .font-search input:focus-visible {\n    outline: none;\n  }\n  .font-search svg {\n    width: 14px;\n    height: 14px;\n    color: var(--muted);\n  }\n  .font-search input {\n    border: 0;\n    background: none;\n    color: var(--text);\n    width: 100%;\n    min-width: 0;\n    font-size: 13px;\n  }\n  .font-list-label {\n    font-size: 10px;\n    color: var(--muted);\n    padding: 4px 7px 7px;\n  }\n  .font-list {\n    max-height: 205px;\n    overflow: auto;\n    scrollbar-width: thin;\n  }\n  .font-option {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 8px;\n    font-size: 12px;\n    width: 100%;\n    padding: 9px 8px;\n    border-radius: 6px;\n    text-align: left;\n    line-height: 1.3;\n  }\n  .font-option:hover,\n  .font-option:focus {\n    background: var(--hover);\n  }\n  .font-option.selected {\n    color: var(--accent);\n    background: color-mix(in srgb, var(--accent) 7%, transparent);\n  }\n  .font-option svg {\n    width: 13px;\n    height: 13px;\n  }\n  .font-option .font-option-text {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  .font-custom {\n    border-top: 1px solid var(--line);\n    margin-top: 4px;\n  }\n  .font-loader {\n    border-top: 1px solid var(--line);\n    margin-top: 7px;\n    padding-top: 8px;\n  }\n  .font-loader button {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 6px;\n    font-size: 11px;\n    width: 100%;\n    padding: 7px;\n    color: var(--accent);\n  }\n  .font-loader svg {\n    width: 13px;\n    height: 13px;\n  }\n  .font-message {\n    font-size: 10px;\n    color: var(--muted);\n    line-height: 1.6;\n    padding: 3px 7px 4px;\n  }\n  .empty-font {\n    padding: 15px 8px;\n    color: var(--muted);\n    font-size: 12px;\n  }\n  .save-overlay {\n    position: fixed;\n    inset: 0;\n    z-index: 40;\n    background: #10182745;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 20px;\n  }\n  .save-dialog {\n    background: var(--surface);\n    color: var(--text);\n    border: 1px solid var(--line);\n    border-radius: 14px;\n    width: 360px;\n    box-shadow: 0 20px 80px #0003;\n    padding: 24px;\n  }\n  .save-dialog h2 {\n    font-size: 17px;\n    margin: 0 0 8px;\n  }\n  .save-dialog p {\n    font-size: 12px;\n    line-height: 1.7;\n    color: var(--muted);\n    margin: 0 0 22px;\n  }\n  .save-dialog label {\n    font-size: 11px;\n    display: block;\n    margin-bottom: 7px;\n    color: var(--muted);\n  }\n  .save-dialog input {\n    width: 100%;\n    border: 1px solid var(--line);\n    background: var(--control);\n    padding: 11px;\n    border-radius: 7px;\n    color: var(--text);\n    font-size: 13px;\n  }\n  .dialog-buttons {\n    display: flex;\n    justify-content: flex-end;\n    gap: 8px;\n    margin-top: 23px;\n  }\n  .secondary-btn {\n    padding: 9px 16px;\n    border: 1px solid var(--line);\n    border-radius: 7px;\n    font-size: 12px;\n    background: var(--control);\n  }\n  .dialog-error {\n    color: #c26565;\n    font-size: 11px;\n    min-height: 16px;\n    margin-top: 7px;\n  }\n  .toast {\n    position: fixed;\n    bottom: 26px;\n    left: 50%;\n    transform: translate(-50%, 12px);\n    z-index: 60;\n    pointer-events: none;\n    background: #283144;\n    color: #fff;\n    border: 1px solid #ffffff20;\n    padding: 11px 18px;\n    border-radius: 9px;\n    font-size: 12px;\n    box-shadow: 0 6px 24px #0002;\n    opacity: 0;\n    transition: opacity .16s, transform .16s;\n    max-width: calc(100vw - 32px);\n    text-align: center;\n    line-height: 1.6;\n  }\n  .toast.visible {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n  .choice-popover {\n    position: fixed;\n    z-index: 31;\n    background: var(--surface);\n    color: var(--text);\n    border: 1px solid var(--line);\n    border-radius: 11px;\n    padding: 7px;\n    box-shadow: 0 12px 45px #18213b26;\n    overflow: hidden;\n  }\n  .choice-list {\n    max-height: 280px;\n    overflow: auto;\n    scrollbar-width: thin;\n  }\n  .choice-group-label {\n    font-size: 11px;\n    color: var(--muted);\n    padding: 7px 10px 6px;\n  }\n  .choice-group-label:not(:first-child) {\n    border-top: 1px solid var(--line);\n    margin-top: 5px;\n    padding-top: 12px;\n  }\n  .choice-option {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    width: 100%;\n    min-height: 38px;\n    padding: 9px 10px;\n    border-radius: 7px;\n    text-align: left;\n    font-size: 13px;\n  }\n  .choice-option:hover,\n  .choice-option:focus-visible {\n    background: var(--hover);\n  }\n  .choice-option[aria-selected=true] {\n    color: var(--accent);\n    background: color-mix(in srgb, var(--accent) 8%, transparent);\n  }\n  .choice-option svg {\n    width: 14px;\n    height: 14px;\n  }\n  .choice-option span {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n  @media (min-width: 1600px) {\n    .settings-window {\n      width: 940px;\n      grid-template-columns: 172px minmax(0, 1fr);\n    }\n  }\n  @media (max-width: 930px) {\n    .settings-backdrop {\n      padding: 18px;\n    }\n    .settings-window {\n      grid-template-columns: 145px minmax(0, 1fr);\n    }\n    .settings-nav {\n      padding: 24px 10px;\n    }\n    .nav-item {\n      padding: 11px;\n    }\n    .settings-head {\n      padding: 24px 26px 20px;\n    }\n    .settings-scroll {\n      padding: 0 26px 25px;\n    }\n    .footer {\n      padding: 15px 26px;\n    }\n    .workspace > .ws-tools {\n      display: none;\n    }\n    .workspace {\n      grid-template-columns: 190px minmax(0, 1fr);\n    }\n  }\n  @media (max-width: 620px) {\n    .prototype-bar {\n      padding: 0 12px;\n      height: 38px;\n    }\n    .prototype-brand strong {\n      font-size: 11px;\n    }\n    .prototype-actions .prototype-autosave {\n      display: none;\n    }\n    .prototype-tag {\n      font-size: 9px;\n    }\n    .prototype-actions {\n      gap: 5px;\n    }\n    .prototype-actions button {\n      font-size: 10px;\n    }\n    .workspace {\n      height: calc(100dvh - 38px);\n      grid-template-columns: 1fr;\n    }\n    .workspace > .ws-sidebar {\n      display: none;\n    }\n    .ws-messages {\n      padding: 24px;\n    }\n    .ws-header {\n      padding: 0 20px;\n    }\n    .ws-compose-wrap {\n      padding: 0 18px 20px;\n    }\n    .settings-backdrop {\n      inset: 38px 0 0;\n      padding: 12px;\n    }\n    .settings-window {\n      grid-template-columns: 1fr;\n      max-width: 500px;\n      border-radius: 13px;\n    }\n    .settings-nav {\n      display: none;\n    }\n    .settings-head {\n      padding: 23px 22px 19px;\n    }\n    .settings-head h1 {\n      font-size: 22px;\n    }\n    .settings-scroll {\n      padding: 0 22px 22px;\n    }\n    .footer {\n      padding: 14px 22px;\n    }\n    .save-status {\n      display: none;\n    }\n    \n    \n    \n    \n    \n    .prototype-brand {\n      gap: 6px;\n    }\n  }\n  @media (max-width: 440px) {\n    .settings-backdrop {\n      padding: 0;\n    }\n    .settings-window {\n      border: 0;\n      border-radius: 0;\n      width: 100%;\n      height: 100%;\n    }\n    .settings-head {\n      padding: 21px 17px 19px;\n    }\n    .settings-scroll {\n      padding: 0 17px 23px;\n    }\n    .footer {\n      padding: 14px 17px;\n    }\n    \n    \n    \n    \n    .theme-options {\n      gap: 8px;\n    }\n    \n    \n    .modified-badge {\n      font-size: 9px;\n    }\n    .small-button {\n      padding: 7px 8px;\n    }\n    .preset-trigger {\n      font-size: 12px;\n      padding: 0 9px;\n    }\n    .number-field {\n      padding: 0 10px;\n    }\n  }\n  .ws-main,\n  .ws-messages {\n    min-height: 0;\n  }\n  .ws-compose-wrap {\n    flex-shrink: 0;\n  }\n  @media (prefers-reduced-motion: reduce) {\n    *,\n    *:before,\n    *:after {\n      transition: none !important;\n      scroll-behavior: auto !important;\n    }\n  }\n  :scope {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 0;\n    background: var(--overlay);\n    color: var(--text);\n    font-size: 13px;\n    overflow: hidden;\n  }\n  .settings-main {\n    height: 100%;\n  }\n  .settings-scroll {\n    flex: 1;\n  }\n  .settings-close {\n    display: flex;\n  }\n  .save-overlay {\n    z-index: 1200;\n  }\n  .font-popover,\n  .choice-popover {\n    z-index: 1201;\n  }\n  .toast {\n    z-index: 1202;\n  }\n  \n\n.color-grid{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line)}\n.color-control{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:54px;padding:10px 0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;min-width:0}\n.color-label{font-size:14px;font-weight:500;line-height:22px;flex:1;min-width:0}\n.ws-sidebar,.ws-tools,.settings-nav{--text:var(--sidebar-text);--muted:var(--sidebar-muted);--line:var(--sidebar-line);color:var(--sidebar-text)}\n.settings-nav{background:var(--sidebar)}\n.primary-btn,.send-button{color:var(--accent-text)}\n.theme-option[aria-pressed="true"] .theme-check{color:var(--accent-text)}\n.type-sample{color:var(--subtle-text)}\n\n.type-row + .type-row{border-top:1px solid var(--line)}\n\n@media(max-width:620px){.section{padding:16px}}\n\n.type-label{font-size:14px;font-weight:500;line-height:22px;color:var(--text);white-space:nowrap}\n@media(max-width:760px){\n  .type-row{grid-template-columns:76px minmax(0,1fr) minmax(0,1fr)}\n  .type-label{grid-column:1;grid-row:1}\n  .type-font{grid-column:2/-1;grid-row:1}\n  .type-size{grid-column:2;grid-row:2}\n  .type-weight{grid-column:3;grid-row:2}\n}\n}\n';

// src/client/view.html
var view_default = '<svg class="symbol-defs" aria-hidden="true"><defs>\n<symbol id="sb-i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>\n<symbol id="sb-i-chevron" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></symbol>\n<symbol id="sb-i-up" viewBox="0 0 24 24"><path d="m7 14 5-5 5 5"/></symbol>\n<symbol id="sb-i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>\n<symbol id="sb-i-settings" viewBox="0 0 24 24"><path d="m9 3-.6 2.5-2.2 1.3-2.4-.7-2 3.5 1.8 1.8v2.6l-1.8 1.8 2 3.5 2.4-.7 2.2 1.3L9 22h4l.6-2.6 2.2-1.3 2.4.7 2-3.5-1.8-1.8v-2.6l1.8-1.8-2-3.5-2.4.7-2.2-1.3L13 3z" transform="translate(1 -1) scale(.96)"/><circle cx="12" cy="12" r="3"/></symbol>\n<symbol id="sb-i-palette" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18h1.2a2.1 2.1 0 0 0 1.6-3.4 1.5 1.5 0 0 1 1.2-2.5h1a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"/><circle cx="7" cy="11" r=".65" fill="currentColor"/><circle cx="10" cy="7.5" r=".65" fill="currentColor"/><circle cx="15" cy="7.5" r=".65" fill="currentColor"/></symbol>\n<symbol id="sb-i-sliders" viewBox="0 0 24 24"><path d="M4 6h4m4 0h8M4 12h10m4 0h2M4 18h2m4 0h10"/><circle cx="10" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></symbol>\n<symbol id="sb-i-model" viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></symbol>\n<symbol id="sb-i-puzzle" viewBox="0 0 24 24"><path d="M9 3h6v4a2 2 0 1 1 4 0v2h2v6h-4a2 2 0 1 0 0 4v2H9v-4a2 2 0 1 1-4 0H3V9h4a2 2 0 1 0 0-4V3Z"/></symbol>\n<symbol id="sb-i-keyboard" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 15h10"/></symbol>\n<symbol id="sb-i-folder" viewBox="0 0 24 24"><path d="M3 7V5h6l2 2h10v12H3Z"/></symbol>\n<symbol id="sb-i-message" viewBox="0 0 24 24"><path d="M4 4h16v12H9l-5 4Z"/></symbol>\n<symbol id="sb-i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></symbol>\n<symbol id="sb-i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>\n<symbol id="sb-i-expand" viewBox="0 0 24 24"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></symbol>\n<symbol id="sb-i-monitor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></symbol>\n<symbol id="sb-i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></symbol>\n<symbol id="sb-i-moon" viewBox="0 0 24 24"><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/></symbol>\n<symbol id="sb-i-type" viewBox="0 0 24 24"><path d="M4 19 10 5l6 14M6 14h8m3-6h5m-2.5 0v11"/></symbol>\n<symbol id="sb-i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18m0-12h12"/></symbol>\n<symbol id="sb-i-rotate" viewBox="0 0 24 24"><path d="M3 10a9 9 0 1 1 2 9M3 4v6h6"/></symbol>\n<symbol id="sb-i-file" viewBox="0 0 24 24"><path d="M5 3h9l5 5v13H5Z"/><path d="M14 3v6h5M9 14h6m-6 3h4"/></symbol>\n<symbol id="sb-i-code" viewBox="0 0 24 24"><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16"/></symbol>\n<symbol id="sb-i-terminal" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/></symbol>\n<symbol id="sb-i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></symbol>\n<symbol id="sb-i-arrow" viewBox="0 0 24 24"><path d="M12 20V4m-6 6 6-6 6 6"/></symbol>\n<symbol id="sb-i-thumb" viewBox="0 0 24 24"><path d="M7 10H3v11h4Zm0 0 5-8 2 1-1 6h7l1 2-2 10H7"/></symbol>\n<symbol id="sb-i-bookmark" viewBox="0 0 24 24"><path d="M5 3h14v18l-7-4-7 4Z"/></symbol>\n<symbol id="sb-i-trash" viewBox="0 0 24 24"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></symbol>\n<symbol id="sb-i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/></symbol>\n<symbol id="sb-i-pointer" viewBox="0 0 24 24"><path d="m4 3 6 18 3-8 8-3Z"/></symbol>\n<symbol id="sb-i-download" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></symbol>\n</defs></svg>  <main class="settings-main">\n   <header class="settings-head"><div><h1>\u5916\u89C2</h1><p>\u8C03\u6574\u5B57\u4F53\u4E0E\u8272\u5F69\uFF0C\u627E\u5230\u8212\u670D\u7684\u5DE5\u4F5C\u72B6\u6001\u3002</p></div><div class="head-actions"><button type="button" class="icon-btn settings-close" data-close-settings aria-label="\u5173\u95ED\u8BBE\u7F6E"><svg><use href="#sb-i-close"/></svg></button></div></header>\n   <div class="settings-scroll" id="settings-scroll">\n    <section class="section" aria-labelledby="preset-heading"><div class="section-heading"><h2 id="preset-heading"><svg><use href="#sb-i-bookmark"/></svg>\u5916\u89C2\u65B9\u6848</h2></div><div class="preset-bar"><div class="preset-select"><button type="button" id="preset-select" class="choice-trigger preset-trigger" aria-label="\u5916\u89C2\u65B9\u6848" aria-haspopup="listbox" aria-controls="choice-list" aria-expanded="false"><span id="preset-name-label">\u9ED8\u8BA4 \xB7 Harness</span><svg aria-hidden="true"><use href="#sb-i-chevron"/></svg></button></div><span class="modified-badge" id="modified-badge">\u5DF2\u4FEE\u6539</span><button type="button" class="small-button" id="save-preset">\u53E6\u5B58\u4E3A\u65B9\u6848</button><button type="button" class="icon-btn preset-delete" id="delete-preset" aria-label="\u5220\u9664\u5F53\u524D\u81EA\u5B9A\u4E49\u65B9\u6848" hidden><svg><use href="#sb-i-trash"/></svg></button></div></section>\n    <section class="section" aria-labelledby="theme-heading"><div class="section-heading"><h2 id="theme-heading">\u4E3B\u9898\u6A21\u5F0F</h2><span class="section-note">\u660E\u6697\u4E4B\u95F4\uFF0C\u81EA\u5728\u5207\u6362</span></div><div class="theme-options" id="theme-options">\n     <button type="button" class="theme-option" data-mode="light" aria-pressed="true"><div class="theme-thumb"><div class="theme-mini-sidebar"></div><div class="theme-mini-main"></div></div><div class="theme-option-label"><span><svg><use href="#sb-i-sun"/></svg>\u6D45\u8272</span><span class="theme-check"><svg><use href="#sb-i-check"/></svg></span></div></button>\n     <button type="button" class="theme-option" data-mode="dark" aria-pressed="false"><div class="theme-thumb dark"><div class="theme-mini-sidebar"></div><div class="theme-mini-main"></div></div><div class="theme-option-label"><span><svg><use href="#sb-i-moon"/></svg>\u6DF1\u8272</span><span class="theme-check"><svg><use href="#sb-i-check"/></svg></span></div></button>\n     <button type="button" class="theme-option" data-mode="system" aria-pressed="false"><div class="theme-thumb system"><div class="theme-mini-sidebar"></div><div class="theme-mini-main"></div></div><div class="theme-option-label"><span><svg><use href="#sb-i-monitor"/></svg>\u8DDF\u968F\u7CFB\u7EDF</span><span class="theme-check"><svg><use href="#sb-i-check"/></svg></span></div></button>\n    </div></section>\n    <section class="section" aria-labelledby="font-heading"><div class="section-heading"><h2 id="font-heading"><svg><use href="#sb-i-type"/></svg>\u5B57\u4F53</h2></div><div id="typography-controls"></div><div class="type-sample"><div class="type-sample-ui">\u6E05\u6670\u7684\u6587\u5B57\uFF0C\u8BA9\u601D\u8DEF\u66F4\u6D41\u7545\u3002</div><div class="type-sample-code"><span>const</span> appearance = <span class="token-string">"just right"</span>;</div></div></section>\n    <section class="section" aria-labelledby="color-heading"><div class="section-heading"><h2 id="color-heading"><svg><use href="#sb-i-grid"/></svg>\u914D\u8272</h2></div><div class="color-grid" id="color-controls"></div><p class="color-footnote" id="color-note"><svg><use href="#sb-i-info"/></svg><span>\u6D45\u8272\u4E0E\u6DF1\u8272\u914D\u8272\u5206\u522B\u4FDD\u5B58\u3002\u7559\u7A7A\u6216\u91CD\u7F6E\u53EF\u6062\u590D\u9ED8\u8BA4\u3002</span></p></section>\n   </div>\n   <footer class="footer"><button type="button" class="reset-btn" id="reset"><svg><use href="#sb-i-rotate"/></svg>\u6062\u590D\u9ED8\u8BA4</button><div class="footer-right"><span class="save-status" id="save-status" aria-live="polite"><svg><use href="#sb-i-check"/></svg><span>\u66F4\u6539\u81EA\u52A8\u4FDD\u5B58</span></span><button type="button" class="primary-btn" data-close-settings>\u5B8C\u6210</button></div></footer>\n  </main><div class="choice-popover" id="choice-popover" hidden><div class="choice-list" id="choice-list" role="listbox" aria-label="\u9009\u9879"></div></div>\n<div class="font-popover" id="font-popover" hidden><div class="font-search"><svg><use href="#sb-i-search"/></svg><input type="search" id="font-search" placeholder="\u641C\u7D22\u6216\u8F93\u5165\u5B57\u4F53\u540D\u79F0" aria-label="\u641C\u7D22\u5B57\u4F53" autocomplete="off"></div><div class="font-list-label" id="font-list-label">\u5E38\u7528\u5B57\u4F53</div><div class="font-list" id="font-list" role="listbox" aria-label="\u5B57\u4F53\u9009\u9879"></div><div class="font-loader"><button type="button" id="load-system-fonts"><svg><use href="#sb-i-download"/></svg>\u8BFB\u53D6\u7CFB\u7EDF\u5B57\u4F53</button><div class="font-message" id="font-message">\u4E5F\u53EF\u4EE5\u76F4\u63A5\u8F93\u5165\u5DF2\u5B89\u88C5\u7684\u5B57\u4F53\u540D\u79F0\u3002</div></div></div>\n<div class="save-overlay" id="save-overlay" hidden><form class="save-dialog" id="save-form" role="dialog" aria-modal="true" aria-labelledby="save-title"><h2 id="save-title">\u4FDD\u5B58\u5916\u89C2\u65B9\u6848</h2><p>\u8BB0\u4F4F\u6B64\u523B\u7684\u5B57\u4F53\u4E0E\u914D\u8272\uFF0C\u4E0B\u6B21\u4E00\u952E\u5207\u6362\u3002</p><label for="preset-name">\u65B9\u6848\u540D\u79F0</label><input id="preset-name" maxlength="24" placeholder="\u4F8B\u5982\uFF1A\u6211\u7684\u4E13\u6CE8\u6A21\u5F0F" autocomplete="off"><div class="dialog-error" id="preset-error" aria-live="polite"></div><div class="dialog-buttons"><button type="button" class="secondary-btn" id="cancel-save">\u53D6\u6D88</button><button type="submit" class="primary-btn">\u4FDD\u5B58\u65B9\u6848</button></div></form></div>\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n';

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var inject = ["slots", "configForms", "theme"];
function apply(ctx) {
  const bridge = new StylebookSettings(ctx);
  const style = document.createElement("style");
  style.dataset.stylebook = "page";
  style.textContent = appearance_default + `
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
  ctx.effect(() => () => {
    bridge.dispose();
    style.remove();
  });
  function Page({ close }) {
    const ref = (0, import_react.useRef)(null);
    (0, import_react.useLayoutEffect)(() => {
      const root = ref.current;
      const panel = root.closest('[data-shortcut-modal="settings"]');
      panel?.setAttribute("data-stylebook-panel", "");
      root.innerHTML = view_default;
      const dispose = mountPage(root, bridge, close);
      return () => {
        dispose();
        panel?.removeAttribute("data-stylebook-panel");
      };
    }, [close]);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: "stylebook-page" });
  }
  ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "stylebook", order: 5, label: "\u5916\u89C2" }, Page)));
}

return module.exports;}});
