# dsh-stylebook 开发计划

日期：2026-10-31  
状态：dev.8 已修复保存竞争并完成本机桌面重启、停用、重新启用、卸载和重装验收；CI、文档和打包检查已补齐，未推送或发布。详见 [验证记录](validation.md)。  
目标仓库：<https://github.com/tsuixl/dsh-stylebook>

## 1. 目标与设计依据

开发一个可通过 DSH 插件索引发现、安装的外观插件，在「设置 → 外观」中管理字体、字号、字重、分区配色和命名外观方案。采用一个 npm 包、一个版本序列，优先完成 Windows 桌面端验收，并保持 Web、macOS、Linux 共用实现的能力。

**当前测试决策：按用户要求，使用本机已安装的 Windows DSH 桌面端进行真实宿主验收。** 不要求先部署 DSH Web 实例，也不要求下载或编译 DSH 源码。仓库内的类型检查、构建和针对性逻辑测试作为安装前检查保留；Web、macOS、Linux 的实际宿主验收留待后续具备环境时补充，不作为当前桌面版完成的前置条件。

**所有插件自有界面及功能，以 [第二版 HTML 原型](design/appearance.html) 为唯一设计基准。** [设计约束与状态清单](design/README.md) 是实现和验收时的对照表。

- 原型现有的界面结构、控件、文案、默认值、菜单、弹窗、交互和响应式行为都要逐项实现。
- 不只还原静态首页，还要还原展开菜单、搜索、选中、焦点、已修改、保存及删除方案等状态。
- 不因组件库默认样式、宿主接入困难或实现方便，改用另一套界面。
- 新增或调整可见行为时，先更新原型并由用户确认，再同步实现和验收基准。
- 当前用户已要求功能基于完整原型实现，因此原型中的命名方案管理纳入首个完整版本，不再作为可随意省略的可选功能。

原型中的「设计稿 02」演示条、模拟会话、模拟文件树和其他设置栏目属于演示环境；生产插件使用真实 DSH 宿主对应界面，不再复制一个 Harness。插件自有的外观页、菜单、弹窗和提示必须与原型一致。

## 2. 功能实现范围

| 编号 | 功能 | 实现要求与完成条件 |
| --- | --- | --- |
| F01 | 独立外观页 | 通过 `settings.section` 注册「外观」入口；导航与内容两栏。方案、主题模式、字体、配色分别用含标题的圆角容器包裹，遵循用户确认的参考图与 HTML，不恢复实时预览。 |
| F02 | 明暗模式 | 浅色、深色、跟随系统三种选择；选中卡片、图示、边框和勾选状态遵循原型；跟随系统时响应系统变化。 |
| F03 | 字体选择 | 界面文字与代码分别设置；角色名称和字体/字号/字重按原型同行排列，名称为 14px，与配色一致，不重复显示字段标题。支持搜索、手动名称、系统默认、读取系统字体，保留圆角菜单及搜索焦点样式。 |
| F04 | 字号 | 两种角色均为整数 `10–22 px`；默认界面 `14`、代码 `13`；数字输入自身为 `16px`、常规字重 `400`，无可见上下箭头。非法或未完成输入不写入持久配置。 |
| F05 | 字重 | 显示 `Regular`、`Medium`、`SemiBold`、`Bold`，分别对应 `400/500/600/700`；采用与方案菜单一致的自定义菜单，不退回原生 select 弹层。 |
| F06 | 字体示例 | 保留字体区下方的简短中文及代码示例，并随字体、字号、字重变化；它不是已删除的右侧实时预览栏。 |
| F07 | 三项配色 | 主题底色、侧边栏、强调色；其余区域自动派生。按 Codex 参考图采用单列分隔行、左侧 14px 名称及右侧颜色胶囊，取色器和 HEX 输入双向一致。 |
| F08 | 双模式色板 | 分别保存浅色、深色配色；颜色编辑作用于当前有效模式；保留原型的对比度提示和回退行为，分区标题旁不显示重复模式标签。 |
| F09 | 内置及自定义方案 | 实现四个内置方案、方案切换、另存为、删除自定义方案，以及「已修改」状态。具体名称、颜色和交互以原型为准。 |
| F10 | 保存与恢复 | 修改即时应用，自动持久化；重启恢复；「恢复默认」恢复默认外观但保留自定义方案；「完成」和关闭按钮关闭真实设置面板。 |
| F11 | 键盘与响应式 | 保留 Escape、菜单方向键、焦点回收、弹窗焦点约束；宽窄窗口布局按原型变换，不挤压或截断关键控件。 |
| F12 | 插件生命周期 | 启用后注册界面并应用配置；禁用、卸载、热重载时撤销该插件的界面、样式覆盖及监听；重新启用可恢复保存的配置。 |

### 2.1 字体行为

1. 首先支持浏览器标准的 `queryLocalFonts()`，由用户点击「读取系统字体」触发；按字体家族合并、排序和搜索。
2. 未读取时明确展示常用字体列表，不能把推荐名称冒充本机已安装字体。
3. API 不可用或权限被拒绝时，使用原型菜单内的提示和手动输入路径；不新增独立系统弹窗。
4. 字体列表属于当前客户端设备，不从远程 DSH Host 枚举字体，也不上传完整字体清单或字体文件。
5. 配置保存字体名称；缺失字体或缺少中文字形时走回退字体链。跨平台不安装、复制或捆绑用户字体。
6. 字重按 CSS 语义应用，实际字形取决于字体支持；保留标题、强调文字和普通文本的层级。
7. 代码范围包括代码块、行内代码、文件代码视图。首版不新增终端字体控件，也不修改终端独立配置。

### 2.2 配色和方案行为

- 保留原型默认色值和内置方案：`default`、`paper`、`ocean`、`forest`，分别显示「默认 · Harness」「暖纸 · 轻阅读」「深海 · 专注」「苔绿 · 安静」。
- 只保存主题底色、侧边栏、强调色三项。主题底色统领内容与设置浮层，输入框和代码块保留派生层级；侧边栏覆盖左右侧栏；文字、辅助文字和边框自动计算。
- 颜色输入支持取色器、六位 HEX，以及原型在提交时支持的三位 HEX；合法值规范化后保存，非法值恢复最近的有效值并提示。
- 单项颜色输入清空后，按原型恢复当前明暗模式下的默认颜色。
- 方案包含主题模式、两类字体设置、两套色板的完整快照。切换时使用快照，不能只更新方案名称。
- 内置方案不可删除；用户方案名称去除首尾空格，不能为空、不得重名，长度沿用原型 `maxLength=24`。
- 「另存为」创建新方案并选中它；调整当前外观不自动覆盖已保存方案。
- 「已修改」由当前有效外观与所选方案比较得出，不作为独立持久状态。
- 删除所选用户方案时保留当前外观，将选中身份回到默认方案；当前值不等于默认时继续显示「已修改」。
- 恢复默认保留用户方案。重命名、覆盖方案、JSON 导入导出均不在当前原型中，首版不新增对应操作。

### 2.3 首版不扩展的范围

不增加壁纸、视频、透明度、毛玻璃、图标替换、云同步、工作区独立外观、终端专用设置或自建插件市场。新需求先进入原型设计流程。

## 3. 目录设计

仓库保持单包结构，当前实际目录如下。市场图标、截图清单及发布 CI 在发布阶段补充，不提前创建空模块。

```text
dsh-stylebook/
├─ package.json / pnpm-lock.yaml / pnpm-workspace.yaml
├─ cordis.patch.yml / tsconfig.json
├─ README.md / README.en.md / LICENSE
├─ locale/                          # 插件展示元数据
├─ scripts/
│  ├─ build.mjs                     # Host ESM + lazy-CJS 客户端工厂
│  └─ sync-design.mjs               # 共享模型同步到独立 HTML
├─ src/
│  ├─ index.ts                      # Host Config 与设置策略
│  ├─ model/
│  │  ├─ appearance.ts              # 类型、校验、比较、v1 → v2 迁移
│  │  ├─ defaults.ts                # 默认值、内置方案、控件选项
│  │  ├─ colors.ts                  # 三色派生区域、前景和边框
│  │  ├─ schema.ts                  # 可序列化结构 schema
│  │  └─ browser.ts                 # 独立原型模型入口及旧浏览器格式兼容
│  └─ client/
│     ├─ index.tsx                  # React 设置插槽挂载与释放
│     ├─ view.html                  # 已确认原型 DOM 片段及图标
│     ├─ appearance.css             # 作用域原型样式
│     ├─ page.js                    # 字体/方案/字重菜单及局部交互
│     ├─ assets.d.ts                # HTML/CSS 导入声明
│     └─ dsh/
│        ├─ settings.ts             # Host 共享表单、迁移与保存状态
│        └─ theme.ts                # token 覆盖、语义区域适配和撤销
├─ tests/
│  ├─ appearance.test.ts / colors.test.ts / migration.test.ts
│  ├─ page.test.mjs / settings.test.mjs / theme.test.mjs
│  └─ fixtures.ts                   # 旧版配置测试样本
├─ docs/
│  ├─ development-plan.md / validation.md
│  └─ design/                       # HTML、设计约束、用户参考图
├─ lib/                             # 构建产物，Git 忽略
└─ .local/                          # 本地包、备份、检查截图，Git 忽略
```

- `model` 和 `client/dsh` 使用 TypeScript；局部交互保留经过确认的 DOM 控制器，并通过真实 DOM 测试验证，尚未完成严格类型化。
- React 只挂载原型片段，不重写另一套组件树；实际复用的业务规则集中到模型中，不为了未来扩展铺设空接口。
- `docs/design` 不进入 npm 运行包；真实市场截图在桌面验收后生成，不能用原型截图冒充。
- 模型更新后运行 `pnpm design:sync`；页面 DOM/CSS 的可见修订同时更新 HTML 与插件，并核对状态和布局。

## 4. 代码设计

### 4.1 技术选择与依赖方向

使用 TypeScript、React、Cordis 和 DSH 的公开服务。优先复用宿主组件和依赖；若宿主组件不能还原原型，则在插件内实现小范围组件，不另外引入整套 UI 框架。

```text
Host Config ──────────────── DSH 配置持久化
     │                           │
     └── model             client/dsh/settings
                                 │
                             page.js
                             │        │
                        view.html    client/dsh/theme
                             │        │
                      局部交互     DSH 主题 / CSS 覆盖
```

- `model` 不依赖 DOM、React、文件系统、网络或 Cordis；业务规则能独立验证。
- React 负责设置插槽挂载，`page.js` 负责局部交互；页面不直接写 Cordis YAML，主题副作用集中在适配层。
- 所有 DSH 版本差异集中在 `client/dsh`；组件不散落上游包名、DOM 选择器和配置字段。
- 字体枚举仅在客户端交互控制器中运行，Host 不调用 Windows 注册表、PowerShell、字体扫描程序等平台专属路径。
- 不为每种设置创建接口、工厂或插件注册中心；只有已有多个消费方且有真实变化点的逻辑才共享。

### 4.2 配置所有权

**DSH 原生主题模式由宿主管理；Stylebook 自己的排版、分区覆盖和用户方案由一个插件配置条目管理。**

插件配置条目 id 为 `stylebook`；原生模式仍读取 `ui-theme`。

| 数据 | 唯一持久所有者 | 客户端职责 |
| --- | --- | --- |
| 浅色/深色/跟随系统 | DSH 原生 `ui-theme` | 读取、调用现有服务或共享配置表单写入，订阅接受后的状态 |
| 字体、字号、字重覆盖 | Stylebook Config | 读取并应用插件覆盖层，不再向 `ui-theme` 字体字段双写副本 |
| 浅色/深色三项色板 | Stylebook Config | 按当前有效主题派生完整表面与前景 |
| 用户方案、所选方案 id | Stylebook Config | CRUD；保存时采集原生模式与插件设置的完整快照 |
| 字体枚举结果、搜索词、开关菜单 | 当前客户端内存 | 不进入共享配置 |
| 已修改状态、有效明暗模式 | 派生状态 | 不重复保存 |
| 尚未校验通过的输入、保存中的草稿 | 当前客户端内存 | 保留用户输入，成功后由 Host 接受值确认 |

此划分是为了满足原型里的完整字号范围和撤销要求。初期分析中的“直接调用原生字体 setter”不能原样覆盖本原型：原生代码字号上限较低，且原生正文字号不等于全界面字号。正式实现应复用主题和配置机制，通过一层可撤销的排版覆盖完成扩展。

当前模型如下（完整定义见 `src/model/appearance.ts`）：

```ts
type Mode = 'light' | 'dark' | 'system'
type Weight = 400 | 500 | 600 | 700
type Palette = Record<'theme' | 'sidebar' | 'accent', string>
interface Appearance {
  mode: Mode
  uiFont: string; codeFont: string
  uiSize: number; codeSize: number
  uiWeight: Weight; codeWeight: Weight
  palettes: Record<'light' | 'dark', Palette>
}
interface StoredState {
  version: 2
  current: Omit<Appearance, 'mode'>
  selectedPreset: string
  presets: Array<{ id: string; name: string; value: Appearance }>
  legacyBackup?: LegacyStoredState | null
}
```

- 默认值、方案、颜色派生和迁移只有一份业务定义；HTML 通过 `scripts/sync-design.mjs` 内嵌同一模型，保留直接打开原型的能力。
- v1 → v2：原 `workspace` 迁移为 `theme`，保留 `sidebar`、`accent`、字体和方案身份；当前设置及所有用户方案同时迁移。完整原始 v1 保存为 `legacyBackup`，不再参与渲染；原独立工具、输入、代码和浮层色改为自动派生。
- 只有可写且合法的 v1 Host 配置才自动提交迁移，写入带原修订号；只读时可显示迁移结果但不落盘。失败展示真实状态，避免覆盖其他窗口的修改。
- 在持久化和跨进程边界校验数字范围、字体名称、色值、方案结构及配置版本；未知版本或损坏数据保留并提示，不按默认值静默覆盖。
- 新增迁移只处理插件自己的条目，不接管整个 DSH 配置文件。

### 4.3 保存流程与状态

```text
控件输入 → 校验/规范化 → 即时应用草稿 → DSH 配置表单写入
                                             │
                         接受：更新有效配置和保存状态
                         拒绝：保留编辑信息，展示错误/冲突
```

1. Host 通过 `.volatile()` 声明可实时编辑字段；使用当前 DSH 的 Config/schema 和共享配置表单机制。
2. 客户端通过 `ctx.configForms` 使用 Host 的读写队列、修订号及接受结果，不重复实现文件锁或第二套持久化队列。
3. 修改只提交受影响字段；校验失败或修订冲突不得覆盖其他窗口的新值。
4. 写入成功后才显示已保存；保存失败、只读或断线不能显示成功状态。提示沿用原型现有状态区、消息和弹窗，不增加另一套页面。
5. 初始化从已接受配置恢复；连接恢复时重新读取。不得让较早保存的回声覆盖较晚编辑。
6. 「完成」应处理尚未完成的保存，不能单靠浏览器 `pagehide` 异步保存保证落盘。
7. 方案应用涉及原生主题和 Stylebook 两个配置条目，**不宣称跨条目原子事务**。分别确认结果，只有目标快照完全生效才算应用成功；部分失败保留实际状态并显示失败/已修改，禁止静默宣称成功或无条件回滚其他窗口的更新。

原型的 `localStorage` 仅用于演示，正式插件不把它作为配置真源，也不另外手工写 `settings.yaml`。

### 4.4 主题、排版与区域应用

- 颜色优先使用 `ctx.theme.overrideTokens()`，以固定插件标识注册覆盖层；同时提供浅色和深色值。
- 排版先映射现有 CSS 变量及语义排版 token；需要额外规则时，使用插件持有的样式节点和作用域标记。
- 所有覆盖、监听和注册都具有明确 disposer，挂到 Cordis effect 生命周期。卸载只撤销本插件覆盖，不重写其他插件或宿主偏好。
- 界面字体覆盖导航、设置、对话正文和输入区；代码字体覆盖对应代码显示区域。禁止用 `* { font: ... !important }` 抹掉排版层级。
- 调整字号时兼顾行高、控件最小高度和文本换行。用户字体不能被设置面板内部的固定字体意外覆盖。
- 三项颜色集中解析：主题底色映射内容、设置及菜单表面，输入框和代码块使用派生层级；侧边栏映射左右侧栏；强调色映射重点交互。按区域计算前景、辅助文字、边框及悬停色，不保存隐形的旧分区覆盖。
- 浮层可能 portal 到 `body`，文件代码视图可能有专用渲染器，需要分别验证；不承诺能修改 iframe 内网页或原生操作系统对话框。
- 主题底色也用于设置与浮层内部的控件、卡片及菜单，不能只改外壳而保留固定白色。原生菜单的独立语义变量一起处理；侧栏的前景覆盖限制在对应容器中。
- 优先使用稳定属性和公开插槽，不匹配构建生成的随机 CSS hash，不常驻扫描整个 DOM。
- 同类插件可能覆盖同一 token。按 DSH 层叠机制共存；验证启停顺序，不通过定时器或反复重注册抢占优先级。
- 「恢复默认」恢复原型定义的 Stylebook 默认外观；禁用插件则撤掉覆盖、显露宿主原设置。这两个动作语义不同。

### 4.5 构建与装载

- 一个 npm 包同时提供 Host 根入口和浏览器 `./client` 导出，bundle patch 挂载包根名称。
- `dsh.bundle.patch` 和对应补丁必须随包发布；仅声明 `dsh.client` 不满足可安装要求。
- 浏览器产物必须符合 DSH 的 lazy-CJS factory 格式，不能把普通 ESM/Vite 页面产物当成客户端插件包。
- 上游 `clientBundle` 构建 preset 当前位于源码仓库内，未作为独立公开包发布；本仓库需要小型、可验证的独立构建配置，不能依赖用户机器上的上游源码路径。
- 宿主提供的 DSH、Cordis、React 等依赖按实际共享模块约定声明 peer/external，避免捆绑第二份服务或 React。非基线请求按需列入 `dsh.client.external`。
- 使用同一 TypeScript 配置核对 Host 和客户端入口；构建分别指定 Node/Browser 平台和 external，避免 Node API 进入浏览器产物。

## 5. 实施顺序与交付门槛

以下保留阶段门槛；阶段整体完成前不因部分代码或模拟测试通过而勾选。当前代码、构建和有限桌面实测结果见 [验证记录](validation.md)。

### P0：原型冻结与宿主适配验证

已完成：

- [x] 将第二版 HTML 和参考图归档到 `docs/design`。
- [x] 记录用户批注、功能边界和插件索引提交方式。

待实施：

- [ ] 以本机 `DSH 0.2.1-rc.5` 为首个候选基线，固定开发依赖；不把 `master` 当成已发布兼容版本。
- [ ] 构建最小 Host/Client bundle，打包后安装到本机 DSH 桌面端，验证「外观」页注册、表单读写、样式挂载及禁用清理。
- [ ] 验证下面四个原型与宿主差异，形成可运行证据。

| 前置差异 | 原型要求 | 处理原则 |
| --- | --- | --- |
| 代码字号 | `10–22`，默认 `13` | 当前上游原生范围 `10–16`、默认 `11`；验证插件排版覆盖，不缩小原型范围或吞掉超限值。 |
| 界面字号 | 界面与正文有完整作用范围 | 原生 text 字号主要是对话内容；列出导航、菜单、设置、输入和正文的实际覆盖点。 |
| 设置窗口尺寸 | 两栏，普通宽屏最大宽 `900px`，更宽屏 `940px` | 宿主拥有设置 shell；先核对公开扩展能力，适配只影响外观页。无法还原时作为设计阻塞项提出，不能静默换版。 |
| 保存状态文案 | 原型保存后显示「已保存到此浏览器」 | 正式插件写 Host，成功显示「已保存」。当前保留并记录此演示差异，最终设计验收时确认；不得把浏览器保存当成 Host 成功。 |

本阶段完成前不大规模铺 UI 代码。宿主限制若确实要求修改设计，先展示具体差异并更新 HTML 基准。

### P1：基础包与状态模型

- [ ] 建立包清单、bundle patch、Host/Client 构建和类型检查。
- [ ] 实现配置 schema、默认值、内置方案、比较与用户方案纯函数。
- [ ] 建立 Host 配置条目、客户端共享表单读取和状态订阅。
- [ ] 建立安全的命名空间、CSS 作用域及资源撤销流程。

完成门槛：可通过真实 DSH 加载、读取和保存合法配置；非法配置被拒绝；禁用后无残留样式和页面。

### P2：按原型实现完整界面

- [ ] 还原两栏布局、主题卡片、字体控件、三项配色及派生区域、字体示例和底部操作。
- [ ] 实现字体搜索、读取权限、手动输入、缺失字体回退。
- [ ] 实现共用圆角菜单、英文权重选项、无箭头的大字号输入、圆角搜索焦点。
- [ ] 实现方案菜单、另存为弹窗、重复名称校验、删除和已修改状态。
- [ ] 实现键盘操作和原型响应式断点。

完成门槛：F01–F11 的全部原型状态可操作，不能仅用静态组件通过截图验收。

### P3：真实应用与持久化闭环

- [ ] 将控件接入真实主题模式、排版覆盖和区域配色。
- [ ] 验证保存、刷新、进程重启、连接恢复、多窗口冲突及保存失败。
- [ ] 验证方案应用、默认恢复、禁用、重新启用和卸载。
- [ ] 在本机桌面端的 `desktop` profile 中验收；测试前记录现有外观和插件启用状态，按第 6 节准备备份及回退。
- [ ] 先验证 Stylebook 自身，再验证与已有同类插件的叠加和撤销；若测试需要临时切换其他插件状态，结束后恢复原状态并记录结果。

完成门槛：设置实际影响 DSH，重启可恢复；方案名称与实际状态一致；插件移除后宿主可正常使用。

### P4：界面一致性与平台验收

- [ ] 按 [设计状态清单](design/README.md#验收清单) 对照 HTML 与真实插件。
- [ ] 在相同字体、配置、明暗模式、窗口尺寸下进行截图及行为检查。
- [ ] 在本机 Windows 桌面版完成字体读取及降级、界面交互、配色、Host 设置保存和生命周期验收。
- [ ] Web、macOS、Linux 实际宿主验收列为后续补充；当前不为测试另装 Web 版，不把未运行的平台标记为已验证。
- [ ] 建立最小兼容版本矩阵，并据此填写 `engines.dsh`。

完成门槛：本机 Windows 桌面端不得存在未经确认的界面差异、必需功能缺失或错误的保存成功状态。兼容性说明只列明实际验收的平台和版本。

### P5：发布包与社区索引

- [ ] 补齐公开源码、许可证、包元数据、中英文说明、图标及真实运行截图。
- [ ] 检查预构建 npm tarball 的文件清单，使用准备发布的同一份 tarball 在本机桌面端安装、启动、禁用和卸载。
- [ ] 发布同一份已验收产物到 npm；GitHub Release 记录版本、兼容范围和实际测试平台。
- [ ] 先申请 Open Plugin Market 收录，再向 Awesome DSH Plugin 提交 PR。
- [ ] 收录后从各源的实际 `index.json` 查到正确包名、版本、安装来源及兼容范围，再通过发现页面验证安装路径。
- [ ] 将发布地址、收录 Issue/PR、实际结果写入 `docs/release-checklist.md`。

发布和提交收录不包含在本次“编写开发计划”任务中，执行到发布阶段时按当时用户授权办理。

## 6. 测试策略

### 6.1 当前主流程：本机桌面端验收

```text
仓库内针对性检查 → 构建预编译 .tgz → 本机桌面端安装
                                     ↓
                    按 HTML 核对界面及真实功能
                                     ↓
                    重启恢复 → 禁用/启用 → 卸载清理
```

不需要先发布 npm、先申请插件源收录，或编译一套 DSH 应用。HTML 负责设计对照，实际效果以安装插件后的 DSH 桌面端为准。

当前已核查的本机入口如下，每轮测试开始时重新确认实际版本及路径：

| 项目 | 当前值 |
| --- | --- |
| DSH 版本 | `0.2.1-rc.5` |
| 应用 | `D:\Soft\DeepSeekHarness\DeepSeek Harness.exe` |
| 桌面自带 CLI | `D:\Soft\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd` |
| 测试 profile | `desktop`，由桌面应用管理 |
| profile 目录 | `C:\Users\tsuixl\.dsh\profiles\desktop`，实际以生效的 `DSH_HOME` 为准 |

桌面 profile 固定为 `desktop`，不把任意新建 profile 当作另一套桌面测试实例，也不用 npm 安装的另一套 dsh 管理它。

### 6.2 每轮桌面验收步骤

1. **记录基线。** 记录 DSH 版本、现有主题/字体/配色、其他外观插件及启用状态。安排在当前工作结束后安装或重启，不强制终止正在运行的任务。
2. **准备回退。** 在应用完全退出后备份当前 profile 的配置和包管理文件，包括 `package.json`、`pnpm-lock.yaml`、`cordis.patch.yml`、`cordis.yml`、`pnpm-workspace.yaml` 中实际存在的文件。记录上一个可用的 Stylebook 包；本地备份放在 Git 忽略的目录中，不提交用户配置、会话或凭据。
3. **构建插件包。** 运行本次改动需要的类型/逻辑检查和构建，检查 tarball 包含入口、客户端工厂产物、CSS、补丁及元数据。开发包使用可区分的版本和文件名，记录版本与哈希，避免误测旧缓存。
4. **安装并启动。** 完全退出 DSH（仅关闭到托盘不算退出），使用桌面应用自带 CLI 将本地 `.tgz` 安装到 `desktop`，完成后重新打开应用。不要修改 `app.asar`、替换应用文件或绕过版本兼容检查。
5. **对照原型验收。** 在真实「设置 → 外观」中检查全部控件、展开菜单和弹窗；实际验证字体搜索及读取、10–22 字号、四档字重、三项配色及派生区域、明暗切换、方案保存/切换/删除、默认恢复以及键盘操作。
6. **验证持久化。** 等待保存确认，关闭并重开设置，再完全退出和重新启动应用，核对实际配置与界面一致。失败及冲突场景优先通过仓库集成测试注入；真实桌面中只使用可控场景，不破坏用户配置来制造错误。
7. **验证生命周期。** 检查禁用后样式和入口撤销、重新启用后设置恢复，以及卸载后宿主正常使用。每轮结束记录插件最终保留或移除的状态，恢复为测试临时改变的其他插件状态。
8. **必要时回退。** 优先用插件管理功能或桌面自带 CLI 移除故障版本、安装上一个可用包。需要恢复备份时先退出应用并核对配置差异，不能用整份旧备份覆盖测试期间发生的无关修改。

开发包生成后的安装命令示例（版本和文件名届时以实际产物为准；本计划不会执行该命令）：

```powershell
& 'D:\Soft\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'G:\Dev\Github\dsh-stylebook\.local\packages\dsh-stylebook-0.1.0-dev.1.tgz'
```

实施时将 `.local/` 加入 `.gitignore`，用于本地包、备份及测试记录；目前不创建空测试环境或备份目录。

### 6.3 辅助检查与验证边界

| 层级 | 重点验证 | 不用它替代什么 |
| --- | --- | --- |
| 纯函数 | 字号/颜色规范化、方案 CRUD、已修改判定、迁移 | 不替代真实 Host 保存 |
| 配置集成 | 修订冲突、错误不落盘、连接恢复、两条目方案部分失败 | 不替代视觉验收 |
| 桌面界面交互 | 自定义菜单选择与键盘、字体读取及降级、HEX 编辑、弹窗及窗口缩放 | 不只看独立 HTML 的交互 |
| 桌面宿主集成 | 侧栏/正文/代码/工具区的应用、重启、启停、卸载 | 不只看原型 DOM 或模拟服务 |
| 桌面发布包冒烟 | 实际 tarball 的入口、依赖、CSS、元数据、预构建产物 | 不只运行工作区源码 |

测试采用与改动相匹配的最小范围。依赖版本、适配规则或失败问题没有变化时，不重复全量检查。视觉比较在同一 OS、同一字体环境和相同有效内容尺寸下进行，记录桌面窗口的最小尺寸限制。

当前验收记录至少包含：DSH 版本、插件版本/包哈希、实际安装来源、通过/失败/未测条目、原型对照结果、重启与卸载结果，以及最终保留的插件状态。读取配置文件或命令返回成功，不能替代真实界面验证。

Web、macOS、Linux 后续有环境时再补测；跨平台代码结构继续保留。DSH 源码仅在查接口或定位宿主问题时参考，不作为本项目日常构建和桌面测试依赖。

## 7. 插件索引规范与发布准备

### 7.1 发布渠道和收录顺序

使用 npm 分发预构建安装包，GitHub 托管源码、版本记录和资源。两个社区索引指向同一个 npm 包，不维护不同的市场专用版本，也不需要自建索引站点。

| 索引 | 当前本机已配置的入口 | 本项目提交方式 |
| --- | --- | --- |
| Open Plugin Market | <https://dshopen.org/index.json> | 提交插件收录 Issue；建议外观分类，提供 npm 包、源码、许可证、Logo、截图及实测情况。 |
| Awesome DSH Plugin | <https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json> | PR 新增 `data/plugins/tsuixl__dsh-stylebook.yml`，分类 `theme`，填写准确的中英文描述。 |

规范核查日期：2026-10-31。发布当天应重新核对维护者规则。

### 7.2 共同要求

- 真实可安装、可运行的代码；当前文档和 HTML 原型本身不构成可收录插件。
- `package.json` 声明 `dsh.bundle.patch`；引用的补丁、Host 入口、客户端工厂产物、样式及必要元数据均在发布包内。
- 公开源码和明确许可证；准确填写 `name`、`version`、`description`、`author`、`repository`、`homepage`、`license`、`keywords`。
- 声明实际验证过的 `engines.dsh` 和 peer 范围，特别测试 `0.2.1-rc.5` 这样的预发布版本，不用看似宽泛但排除 prerelease 的范围。
- 发布预构建产物，减少用户安装时从源码构建的步骤；不将原型、测试、开发缓存或私人配置装进运行包。
- 说明与现有 `dsh-fonttune`、`dsh-ui-appearance` 的实际差异，不将“首个”“完全兼容”“已安全审计”等未证实宣传作为描述。
- 对跨平台、启动恢复及卸载清理的描述必须与实测结果一致。

### 7.3 各索引额外要求

**Open Plugin Market**：

- 通过 GitHub Issue 提供包名/仓库和简短介绍，维护者处理收录配置。
- 默认跟踪 npm `latest`；固定版本或 Git 提交需维护者重新核查。
- 非 npm 安装需提供维护者认可的固定 Git 提交和完整可安装目录。
- GitHub Release 附件可供下载，但不能单独充当当前 DSH format-1 索引的安装来源。

**Awesome DSH Plugin**：

- 仓库创建满一天，添加 `dsh-plugin` topic，包含真实可用代码。
- 投稿修改单个条目 YAML，不手工修改生成的 README。
- 会检查与既有条目是否重复；准确说明 Stylebook 的统一外观管理及已实现差异。
- 市场图标使用 GitHub 托管 PNG/JPG/WebP 等位图；插件内部 SVG 图标另行保留。
- `screenshots.json` 放在本仓库 `package.json` 旁边，声明 1–8 张图片的仓库相对路径。
- 上架截图必须取自实际插件，不把 `docs/design` 原型截图当作已实现功能的证明。

## 8. 资料来源

- [DSH 设置扩展与共享配置表单](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-settings/README.md)
- [实时配置声明及客户端构建约定](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-settings-card.md)
- [客户端模块加载协议](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/modules/README.md)
- [主题及字体能力](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-theme/README.md)
- [当前上游字号边界与默认值](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-theme/src/theme-settings.ts)
- [Host 配置服务及持久化](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/settings/settings/README.md)
- [桌面版自带 CLI 与 profile 管理要求](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md#bundled-command-runtime)
- [DSH 插件索引与格式](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md)
- [Open Plugin Market 贡献指南](https://github.com/polang233/dsh-plugin-index/blob/main/.github/CONTRIBUTING.md)
- [Open Plugin Market 收录申请](https://github.com/polang233/dsh-plugin-index/issues/new?template=plugin-add.yml)
- [Awesome DSH Plugin 贡献指南](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)
- [Chromium Local Font Access API](https://developer.chrome.com/docs/capabilities/web-apis/local-fonts)

上游 `master` 文档用于定位接口，实际实施仍须以选定 DSH 发布版本的代码和安装包为准。
