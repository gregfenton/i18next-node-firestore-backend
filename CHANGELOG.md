# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.8](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.7...v2.0.8) (2024-08-26)


### Features

* now `export` type I18NFirestoreBackendOpts so that InitOptions<T> can accept the type for its generic to properly define the init options dictionary in a typesafe manner.  Thanks to @Andrew-Tierno for the original PR! ([fac8baa](https://github.com/gregfenton/i18next-node-firestore-backend/commit/fac8baa9fc6510ab2493494b135f097b404e0a2a))

### [2.0.7](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.6...v2.0.7) (2024-08-06)


### Bug Fixes

* missing `.type` in class instance ([f393a52](https://github.com/gregfenton/i18next-node-firestore-backend/commit/f393a522ba324a172ee08195fc1880011a164130))

### [2.0.6](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.5...v2.0.6) (2024-08-06)

### [2.0.5](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.4...v2.0.5) (2024-02-22)


### Bug Fixes

* seems i18next backend class needs to be named "Backend"... ([f04c275](https://github.com/gregfenton/i18next-node-firestore-backend/commit/f04c275e26e4cdeb6c562f28d3608cab3b68ba92))

### [2.0.4](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.3...v2.0.4) (2024-02-22)


### Bug Fixes

* declaration of 'backend' ([3c27be0](https://github.com/gregfenton/i18next-node-firestore-backend/commit/3c27be0ca58352d691f6c40840f117afd3474321))

### [2.0.3](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.2...v2.0.3) (2024-02-22)


### Bug Fixes

* make core methods public ([922bd36](https://github.com/gregfenton/i18next-node-firestore-backend/commit/922bd36c6f80abc308a7bd926b31840ebfae9400))

### [2.0.2](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.1...v2.0.2) (2024-02-22)


### Features

* "implements BackendModule" for use in TypeScript ([fead62b](https://github.com/gregfenton/i18next-node-firestore-backend/commit/fead62bd57d352825ed508760aeecb0d4738f82c))

### [2.0.1](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v2.0.0...v2.0.1) (2024-02-03)


### Features

* code moved to TypeScript and proper .d.js now available ([4f967a4](https://github.com/gregfenton/i18next-node-firestore-backend/commit/4f967a4074228799f231b8a3e388cf9213d30ef3))
* improved config error detection ([90fbd1a](https://github.com/gregfenton/i18next-node-firestore-backend/commit/90fbd1a2ef17aa5f4ffee9d01edf90f8c0cf815f))

## [2.0.0](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v1.0.0...v2.0.0) (2024-02-02)


### Features

* separate and add proper support for modular vs. namespaced ([a8f4c59](https://github.com/gregfenton/i18next-node-firestore-backend/commit/a8f4c59b07c71002b8595fbb800ab6b5379f626f))

## [1.0.0](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v0.2.3...v1.0.0) (2023-11-28)

* BREAKING CHANGE: major update to support Firebase "modular API" in Firebase SDK v9.0.0+ ; see the changes to the example apps for details


### Bug Fixes

* minor update to README ([a587569](https://github.com/gregfenton/i18next-node-firestore-backend/commit/a58756945e0e63bb7f7b73b533283cd703b494c8))
* typo in README ([4bce7d1](https://github.com/gregfenton/i18next-node-firestore-backend/commit/4bce7d1e69e6789089d925ac6aa3ccc56b303ec9))

## [0.4.0](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v0.2.3...v0.4.0) (2021-10-25)


### Bug Fixes

* removed `firebase` as a dependency([bb58bbe](https://github.com/gregfenton/i18next-node-firestore-backend/commit/bb58bbe7325b0f08c34c82d91396cd641eab3835))
* minor update to README ([a587569](https://github.com/gregfenton/i18next-node-firestore-backend/commit/a58756945e0e63bb7f7b73b533283cd703b494c8))
* typo in README ([4bce7d1](https://github.com/gregfenton/i18next-node-firestore-backend/commit/4bce7d1e69e6789089d925ac6aa3ccc56b303ec9))

### [0.2.3](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v0.2.2...v0.2.3) (2021-03-21)

### [0.2.2](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v0.2.1...v0.2.2) (2021-03-21)

### [0.2.1](https://github.com/gregfenton/i18next-node-firestore-backend/compare/v0.2.0...v0.2.1) (2021-03-21)
