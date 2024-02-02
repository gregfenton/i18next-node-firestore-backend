# i18next-node-firestore-backend

A plugin for [i18next](https://www.i18next.com/) that supports fetching translations from a [Google Cloud Firestore](https://firebase.google.com/docs/firestore/) database.  This plugin is designed to work with both the Firebase Client SDK and the Firebase Admin SDK.

## Why this plugin?

[i18next](https://www.i18next.com/) is a fantastic JavaScript module for internationalization -- translations of text and other values.  It supports a wide variety of backends for storing translations.

Using the i18next-node-firestore-backend plugin, you have the ability to add and update translation values for your application in real-time.  No need to re-deploy your application to update translations.  Simply update the values in your Firestore Database and your application can fetch the new values.  This plugin can be used in any JS application, including modern web systems such as React, Angular, Vue, etc. and backend/server systems such as NodeJS, ExpressJS, NestJS, etc.

## Firebase SDK Versions

This plugin uses either the Firebase Client SDK API or the Firebase Admin SDK API. Version 2.0.0 and above support both the "modular" and the "namespaced" API sets.

## Getting Started

See the [example applications](examples).  There are two client SDK examples: a CLI written in JavaScript, and a ReactJS/Vite application.  There is also an admin SDK example: a CLI app.  See their respective README files for details as to how to get them running.

## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend).  Many thanks for your contributions!

### Publishing NPM

Following the instructions from [this page](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/), we did:
1. make sure local repo is clean:  `git status`
1. no need to do a build - we do not have a "build" script
1. update the version in the packages & CHANGELOG.md: `npm run release-bump:patch` (or 'minor' or 'major')
1. push to your remote: `git push`
1. push tags too: `npm run release:tag-push`
1. test a publish of the NPM: `npm publish --dry-run` and review output
1. publish the NPM: `npm publish`
