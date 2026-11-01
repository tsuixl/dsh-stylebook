# Stylebook

An appearance plugin for DeepSeek Harness with separate interface/code typography, three-color themes and named presets.

## Compatibility

The first preview release is **`0.1.0-beta.1`**, targeting **DSH `0.2.1-rc.5`**. Windows Desktop is the acceptance platform. Web, macOS and Linux are not verified. Prebuilt tarballs are distributed through [GitHub Releases](https://github.com/tsuixl/dsh-stylebook/releases); npm and plugin indexes are not published yet. See the [validation record](docs/validation.md) for the exact scope.

## Install and use

Download the `.tgz` from [v0.1.0-beta.1](https://github.com/tsuixl/dsh-stylebook/releases/tag/v0.1.0-beta.1) or build it locally, fully quit DSH from the tray, and install with the CLI bundled with that Desktop version. Replace both paths:

```powershell
$dshCli = 'C:\path\to\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd'
& $dshCli plugin --profile desktop add 'C:\Downloads\dsh-stylebook-0.1.0-beta.1.tgz'
```

Reopen DSH and choose Settings → Appearance. Select light, dark or system mode; choose fonts, sizes (10–22 px) and weights; edit the theme base, sidebar and accent colors. Other surfaces and readable foregrounds are derived automatically. Save the result as a named preset if desired. Reset keeps user presets.

Changes save to DSH Host configuration. Rapid edits are ordered across the plugin and native-theme forms; closing waits for newly queued writes. A refusal shows an error and the accepted state. The two forms are not an atomic transaction. Font enumeration runs on the current device; manual names remain available if unsupported or denied. Font files are not uploaded or bundled.

Disable or re-enable Stylebook through DSH's plugin manager. Disabling removes its page and style layers while retaining the native theme preference. To uninstall, fully quit DSH and run:

```powershell
& $dshCli plugin --profile desktop remove dsh-stylebook
```

Back up the profile configuration (especially `cordis.patch.yml`) and a known working tarball before lifecycle tests or uninstalling. Restore the plugin's entry selectively rather than overwriting unrelated profile changes. Legacy seven-color settings migrate with a complete `legacyBackup`; unsupported or malformed data is not silently replaced.

## Develop

Requires Node.js 24.9.0+, pnpm 11.25.0 and system `tar`. No DSH source checkout is required.

```powershell
pnpm install --frozen-lockfile
pnpm verify
```

Verification runs types, the standalone design-model check, tests and archive checks. `prepack` builds the runtime; `pnpm pack:local` creates and verifies `.local/packages/*.tgz`. The archive check validates entries, metadata, locales and lazy-CJS registration and rejects developer/private files. CI runs the same commands on Windows and Linux with read-only permissions and no publishing steps.

After model changes use `pnpm design:sync`. Preserve the [reviewed HTML](docs/design/appearance.html) when changing UI. Host state and theme effects are separate from the local DOM controller, whose JavaScript is not yet strictly type-checked. See [Chinese documentation](README.md), [development plan](docs/development-plan.md) and [changelog](CHANGELOG.md).

MIT licensed.
