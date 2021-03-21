# i18next-node-firestore-backend

A plugin for [i18next](https://www.i18next.com/) that supports fetching translations from a [Google Cloud Firestore](https://firebase.google.com/docs/firestore/) database.

## Getting Started

See the [example applications](examples).  One is a CLI written in Javascript/NodeJS.  The other is a React application.  See their respective README files for details as to how to get them running.

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
