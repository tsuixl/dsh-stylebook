// src/index.ts
import z2 from "@deepseek-ai/schemastery";

// src/model/schema.ts
import z from "@deepseek-ai/schemastery";

// src/model/defaults.ts
var defaults = { mode: "light", uiFont: "", codeFont: "Consolas", uiSize: 14, codeSize: 13, uiWeight: 400, codeWeight: 400, palettes: { light: { theme: "#ffffff", sidebar: "#f5f6fa", accent: "#4d6bfe" }, dark: { theme: "#242934", sidebar: "#1c202a", accent: "#8396ff" } } };
var builtins = [
  { id: "default", name: "\u9ED8\u8BA4 \xB7 Harness", value: structuredClone(defaults) },
  { id: "paper", name: "\u6696\u7EB8 \xB7 \u8F7B\u9605\u8BFB", value: { ...structuredClone(defaults), palettes: { light: { theme: "#fffdf8", sidebar: "#f3efe7", accent: "#a07b4a" }, dark: { theme: "#302d27", sidebar: "#25231f", accent: "#c3a172" } } } },
  { id: "ocean", name: "\u6DF1\u6D77 \xB7 \u4E13\u6CE8", value: { ...structuredClone(defaults), mode: "dark", palettes: { light: { theme: "#fbfdff", sidebar: "#edf3f9", accent: "#497dac" }, dark: { theme: "#1b2b3c", sidebar: "#14202d", accent: "#79a9d5" } } } },
  { id: "forest", name: "\u82D4\u7EFF \xB7 \u5B89\u9759", value: { ...structuredClone(defaults), palettes: { light: { theme: "#fcfdf9", sidebar: "#eef2ed", accent: "#638264" }, dark: { theme: "#25322a", sidebar: "#1d2722", accent: "#94b196" } } } }
];

// src/model/appearance.ts
var clone = (value) => structuredClone(value);
function withoutMode(value) {
  const { mode, ...current2 } = value;
  return clone(current2);
}
var defaultState = { version: 2, current: withoutMode(defaults), selectedPreset: "default", presets: [], legacyBackup: null };

// src/model/schema.ts
var family = () => z.string().max(256);
var size = () => z.number().min(10).max(22).step(1);
var weight = () => z.union([400, 500, 600, 700]);
var legacyKeys = ["sidebar", "workspace", "tools", "composer", "code", "overlay", "accent"];
var palette = (keys) => z.object(Object.fromEntries(keys.map((k) => [k, z.string().pattern(/^#[\da-f]{6}$/i)])));
var current = (keys) => z.object({ uiFont: family(), codeFont: family(), uiSize: size(), codeSize: size(), uiWeight: weight(), codeWeight: weight(), palettes: z.object({ light: palette(keys), dark: palette(keys) }) });
var snapshot = (keys) => current(keys).set("mode", z.union(["light", "dark", "system"]));
var state = (version, keys) => z.object({
  version: z.const(version),
  current: current(keys),
  selectedPreset: z.string().min(1),
  presets: z.array(z.object({ id: z.string().pattern(/^custom-/), name: z.string().min(1).max(24), value: snapshot(keys) })).max(100)
});
var legacySchema = state(1, legacyKeys);
var currentSchema = state(2, ["theme", "sidebar", "accent"]).set("legacyBackup", z.union([z.const(null), legacySchema]).default(null));
var storedSchema = z.union([currentSchema, legacySchema]).default(defaultState);

// src/index.ts
var Config = z2.object({ data: storedSchema.volatile() });
function apply(ctx, _config) {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}
export {
  Config,
  apply
};
