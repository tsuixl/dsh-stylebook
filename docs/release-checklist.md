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
| npm | 尚未发布 |
| 插件源收录 | 已提交开放插件市场 Issue #185 与 Awesome PR #11128，审核及索引状态以上游为准 |

安装包：`dsh-stylebook-0.1.0-beta.1.tgz`  
SHA-256：`ae754b578d686dff56e5d57ef81b4f937df04680afdcc888d2ded6bb531eba7a`

图标和干净的真实展示截图后续单独准备；不把它们当作两个插件源共同的硬门槛，也不将未经宿主验收的平台写成已支持。

桌面证据见 [验证记录](validation.md)，功能与目录依据见 [开发计划](development-plan.md)。

## 插件源收录申请（2026-11-01）

- 开放插件市场：[收录 Issue #185](https://github.com/polang233/dsh-plugin-index/issues/185)。申请使用固定 Git 来源，选定仓库根目录，提交为 `ec4f74a281100faf270afb9dc208fa1d1ac90f7b`。
- 固定 Git 安装目录：[codex/catalog-v0.1.0-beta.1](https://github.com/tsuixl/dsh-stylebook/tree/ec4f74a281100faf270afb9dc208fa1d1ac90f7b)。从已验证 Release 复制运行文件，移除开发脚本与 devDependencies，保留运行依赖、peerDependencies、DSH 清单和入口；SOURCE.md 链接原开发源码。独立目录安装检查及运行文件字节比对通过，不影响桌面 profile。
- 固定 Git 归档 SHA-256：`33508093f9a3748409e176dfd45663a67fed25d1b1b2873e51b6d56dbdfc4026`。
- Awesome：[Ready for review PR #11128](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/11128)。只新增 `data/plugins/tsuixl__dsh-stylebook.yml`，分类 theme，使用固定 beta.1 GitHub Release tarball，不修改生成的 README。
- 仓库已补齐 dsh-plugin topic；两份申请都明确 Windows DSH 0.2.1-rc.5 实测范围，以及 Linux CI 不代表 Linux 宿主验收。
- 申请提交不等于收录生效；维护者处理并更新索引后，DSH 插件库才会显示。自动检查与人工反馈见对应 Issue/PR 页面。
