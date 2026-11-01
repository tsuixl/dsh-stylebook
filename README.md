# Stylebook

DeepSeek Harness 外观插件：分别设置界面与代码字体，用三项颜色调整主题，并保存命名外观方案。

## 功能

- 界面文字、代码字体分别选择字体、字号和字重；支持搜索字体名称、读取系统字体和手动输入。
- 字号范围为 10–22 px，字重为 Regular / Medium / SemiBold / Bold。
- 调整主题底色、侧边栏、强调色，其他表面、文字和边框自动派生；浅色与深色色板分别保存。
- 支持浅色、深色、跟随系统，以及四个内置方案、自定义方案的保存、选择和删除。
- 修改即时应用并保存到 DSH Host。恢复默认保留自定义方案，停用插件撤销 Stylebook 的界面和样式覆盖。

## 兼容性与状态

首个预览版本为 **`0.1.0-beta.1`**，通过 [GitHub Releases](https://github.com/tsuixl/dsh-stylebook/releases) 分发预构建安装包。尚未发布到 npm 或插件源；兼容范围暂定为 **DSH `0.2.1-rc.5`**。

本项目以 Windows 桌面版验收为准；Web、macOS、Linux 尚未实测。代码共用不代表其他平台已通过验收。桌面实测与未测项目见 [验证记录](docs/validation.md)。

## 安装

从 [v0.1.0-beta.1 Release](https://github.com/tsuixl/dsh-stylebook/releases/tag/v0.1.0-beta.1) 下载 `.tgz`，也可以自行构建。安装和移除前应从托盘**完整退出 DSH**。

在 PowerShell 中将路径替换为自己的桌面应用安装目录与安装包位置，使用该桌面版本自带的 CLI：

```powershell
$dshCli = 'C:\path\to\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop add 'C:\Downloads\dsh-stylebook-0.1.0-beta.1.tgz'
```

重新打开 DSH，进入「设置 → 外观」。不要使用另一套 npm DSH 管理桌面的保留 profile，也不要修改应用的 app.asar。

## 使用

1. 在「主题模式」选择浅色、深色或跟随系统。
2. 在「字体」分别调整界面文字和代码字体。点击字体菜单中的「读取系统字体」由当前设备读取字体家族；环境不支持或未授权时，可以搜索或输入名称。
3. 在「配色」点击圆形色块取色，也可编辑 HEX。主题底色统领主内容和浮层；侧边栏用于左右侧栏；其余区域自动派生。
4. 在「外观方案」选择已有方案，或「另存为方案」。修改不会覆盖原方案；仅自定义方案可删除。
5. 等待「已保存」后完成设置。写入失败会显示失败状态，并以宿主实际接受值为准；可以重新编辑重试。

快速连续修改按顺序保存，「完成」会等待期间新增的保存请求。方案涉及插件配置与原生主题两个条目，不提供跨条目原子事务；部分写入失败时会明确提示。

字体名称会保存，字体文件不会打包或上传。换设备后缺少对应字体时使用回退字体；终端独立字体不在当前设置范围内。

## 停用、卸载与恢复

可在 DSH 的插件管理中停用或重新启用 Stylebook。停用撤销插件入口、排版和配色覆盖；原生明暗模式属于用户偏好，会保留。

卸载前完整退出 DSH，然后运行：

```powershell
& $dshCli plugin --profile desktop remove dsh-stylebook
```

卸载由 DSH 及其 profile 包管理机制处理。需要保留或恢复个人方案时，先备份该 profile 的配置文件，尤其是 `cordis.patch.yml`，以及上一个可用的 `.tgz`。恢复时核对插件条目，不用整份旧 profile 覆盖期间发生的其他修改。

从旧七色版本升级时，主内容区颜色迁移为主题底色，侧边栏和强调色保留；其他区域改为派生。完整旧设置和用户方案保留在插件自己的 `legacyBackup` 字段中。未知版本或损坏数据不静默覆盖。

## 本地开发与检查

需要 Node.js **24.9.0 或更高版本**、**pnpm 11.25.0** 和 `tar`（Windows 自带 bsdtar，Linux 使用系统 tar）。仓库固定包管理器版本，不需要 DSH 源码。

```powershell
pnpm install --frozen-lockfile
pnpm verify
```

`verify` 依次运行类型检查、原型模型同步检查、测试和实际打包检查。通过后，安装包位于 Git 忽略的 `.local/packages/`。`prepack` 自动构建 Host ESM 和 DSH lazy-CJS 客户端，避免从干净检出打出缺入口的包。

常用命令：

| 命令 | 用途 |
| --- | --- |
| `pnpm check` | TypeScript 检查 |
| `pnpm test` | 配置、界面、异步保存、迁移、生命周期和归档校验测试 |
| `pnpm design:sync` | 模型变更后同步独立 HTML |
| `pnpm design:check` | 只检查原型模型是否与源码一致 |
| `pnpm build` | 构建运行产物 |
| `pnpm pack:local` | 构建、打包并验证实际安装包 |

GitHub Actions 在 Windows、Linux 上使用相同检查；工作流只有读取仓库权限，不配置发布或推送步骤。本地通过不等于远端 Actions 已运行。

## 设计与实现边界

[HTML 原型](docs/design/appearance.html) 是插件界面的设计基准，[设计说明](docs/design/README.md) 记录已确认修订。修改界面时同步 HTML 与插件 DOM/CSS；业务模型集中在 `src/model`，Host 写入与主题适配集中在 `src/client/dsh`。

原型使用 localStorage 预览；正式插件使用 DSH Host 配置。`src/client/page.js` 的局部交互通过 DOM 测试验证，尚未开启严格 JavaScript 类型检查。

真实市场截图与图标尚未准备，不将原型截图或含私人会话的验收画面作为发布素材。完整计划见 [开发计划](docs/development-plan.md)，修订记录见 [CHANGELOG](CHANGELOG.md)。

许可证：[MIT](LICENSE)。
