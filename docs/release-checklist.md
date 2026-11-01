# 首次发布检查与记录

日期：2026-11-01；版本：**0.1.0-beta.1**；用户已授权提交、推送及 GitHub 版本发布。

- [源码仓库](https://github.com/tsuixl/dsh-stylebook)
- [版本与下载](https://github.com/tsuixl/dsh-stylebook/releases/tag/v0.1.0-beta.1)
- [Windows/Linux CI](https://github.com/tsuixl/dsh-stylebook/actions/workflows/ci.yml)

GitHub Release 在远端 Windows/Linux CI 通过后发布。实际发布状态、提交及附件以这些页面为准。

| 检查 | 结果或发布要求 |
| --- | --- |
| 本地类型、原型模型、逻辑/DOM 测试 | 通过，共 18 项测试 |
| 主题保存竞争、失败重试与释放清理 | 已修复并有异步回归测试 |
| prepack 与实际 .tgz 校验 | 通过，缺入口或误带私人文件会被拒绝 |
| Windows 桌面重启、停用、重新启用、卸载与重装 | dev.8 验收通过 |
| beta.1 与已验收包 | Host/Client 入口逐字节一致，仅版本与发行文档调整 |
| 用户设置与其他插件 | 桌面验收结束恢复到原有状态 |
| 中英文 README、CHANGELOG | 已整理 |
| 行尾一致性 | Git 强制文本 LF，保证 Windows/Linux 原型同步检查一致 |
| GitHub CI | 作为发布门槛，最新结果见上方工作流页面 |
| GitHub 附件 | 预构建 .tgz 与 SHA256SUMS，不包含个人配置或验收截图 |
| npm / 插件源投稿 | 本轮不执行 |

安装包：`dsh-stylebook-0.1.0-beta.1.tgz`  
SHA-256：`ae754b578d686dff56e5d57ef81b4f937df04680afdcc888d2ded6bb531eba7a`

图标和干净的真实展示截图后续单独准备；不把它们当作两个插件源共同的硬门槛，也不将未经宿主验收的平台写成已支持。

桌面证据见 [验证记录](validation.md)，功能与目录依据见 [开发计划](development-plan.md)。
