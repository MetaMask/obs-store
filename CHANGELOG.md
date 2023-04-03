# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [8.0.0]
### Uncategorized
- Allow falsy initial state ([#74](https://github.com/MetaMask/obs-store/pull/74))
- Bump json5 from 1.0.1 to 1.0.2 ([#71](https://github.com/MetaMask/obs-store/pull/71))
- Bump ajv from 6.12.2 to 6.12.6 ([#63](https://github.com/MetaMask/obs-store/pull/63))
- Bump minimist from 1.2.5 to 1.2.7 ([#70](https://github.com/MetaMask/obs-store/pull/70))
- Bump minimatch from 3.0.3 to 3.1.2 ([#69](https://github.com/MetaMask/obs-store/pull/69))
- Bump qs from 6.5.2 to 6.5.3 ([#68](https://github.com/MetaMask/obs-store/pull/68))
- Bump tar from 6.1.4 to 6.1.11 ([#60](https://github.com/MetaMask/obs-store/pull/60))
- Bump path-parse from 1.0.6 to 1.0.7 ([#59](https://github.com/MetaMask/obs-store/pull/59))
- Bump @metamask/auto-changelog from 2.4.0 to 2.5.0 ([#57](https://github.com/MetaMask/obs-store/pull/57))
- Bump tar from 6.1.0 to 6.1.4 ([#58](https://github.com/MetaMask/obs-store/pull/58))

## [7.0.0]
### Changed
- **BREAKING**: Increase minimum Node.js version to v12 ([#40](https://github.com/MetaMask/obs-store/pull/40))
- Include inline sources in source maps ([#46](https://github.com/MetaMask/obs-store/pull/46))
- Remove `readable-stream` dependency ([#45](https://github.com/MetaMask/obs-store/pull/45))

## [6.0.2] - 2020-02-05
### Fixed
- Fix `ObservableStore` constructor and `updateState` types ([#38](https://github.com/MetaMask/obs-store/pull/38))

## [6.0.1] - 2020-02-05
### Fixed
- Remove unused files by fixing build script ([#36](https://github.com/MetaMask/obs-store/pull/36))

## [6.0.0] - 2020-02-05
### Changed
- Genericize state in all classes / exports ([#33](https://github.com/MetaMask/obs-store/pull/33))

### Removed
- **(BREAKING)** Remove `LocalStorageStore` ([#34](https://github.com/MetaMask/obs-store/pull/34))

## [5.0.0] - 2020-12-16
### Added
- TypeScript types ([#27](https://github.com/MetaMask/obs-store/pull/27))

### Changed
- **(BREAKING)** Rename package to `@metamask/obs-store` ([#30](https://github.com/MetaMask/obs-store/pull/30))
- **(BREAKING)** Overhaul exports ([#29](https://github.com/MetaMask/obs-store/pull/29))
  - All exports are now named, and exposed at the main entry point.
  - Some export names have changed, but they should still be recognizable.

[Unreleased]: https://github.com/MetaMask/obs-store/compare/v8.0.0...HEAD
[8.0.0]: https://github.com/MetaMask/obs-store/compare/v7.0.0...v8.0.0
[7.0.0]: https://github.com/MetaMask/obs-store/compare/v6.0.2...v7.0.0
[6.0.2]: https://github.com/MetaMask/obs-store/compare/v6.0.1...v6.0.2
[6.0.1]: https://github.com/MetaMask/obs-store/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/MetaMask/obs-store/compare/v5.0.0...v6.0.0
[5.0.0]: https://github.com/MetaMask/obs-store/releases/tag/v5.0.0
