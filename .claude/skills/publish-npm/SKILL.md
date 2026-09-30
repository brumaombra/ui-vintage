---
name: publish-npm
description: Release @brumaombra/ui-vintage to npm. Use when the user asks to publish, release, cut a version, bump the version, tag a release, or check that the package is ready to publish.
---

# Publishing @brumaombra/ui-vintage to npm

Publishing is irreversible (a published version can never be reused) and pushing a version tag triggers it automatically. Confirm the version and get the user's explicit go-ahead before running `npm version` or pushing tags.

## Package positioning

This package is published as a Nuxt library, not as a generic Vue library.

- The README, npm description, and release notes should describe it as Nuxt-only.
- Shared components rely on Nuxt runtime features such as `#components` and `NuxtImg`.
- Consumer apps are expected to install Nuxt and `@nuxt/image`.
- Components and helper functions are imported explicitly from package subpaths; the Nuxt module should not auto-register or auto-import them.

## Package name

This package is published under the npm scope `@brumaombra/ui-vintage` instead of using a plain prefixed name.

- `@brumaombra/ui-vintage` follows the standard npm convention for scoped packages.
- It avoids awkward name collisions in the global namespace.
- It is easier to recognize as a package you own.

Keep the `name` field in `package.json` aligned with that scoped package name.

## 1. Check the release is ready

Run these from the repository root and fix anything that fails before continuing:

```bash
# Type-check the published source
npm run typecheck

# Fail when COMPONENTS.md is stale (regenerate with `npm run docs:components` and commit it)
npm run docs:components:check

# Inspect the tarball: it must contain only src/, module.mjs, COMPONENTS.md, skills/, README.md, LICENSE, and package.json
npm pack --dry-run
```

Also make sure the working tree is clean (`npm version` refuses to run otherwise) and that the release commit is the one the user wants to ship.

## 2. Choose the version

Always release a **patch** version (`0.8.0` → `0.8.1`), whatever the changes are. Use `minor` or `major` only when the user explicitly asks for it.

State the version you are about to release (for example "0.8.1, patch") and wait for the user to confirm it.

## 3. Manual release flow

```bash
npm pack --dry-run
npm version patch
git push --follow-tags
```

`npm version` updates `package.json` and `package-lock.json`, commits them, and creates the `vX.Y.Z` tag. Replace `patch` only if the user asked for `minor` or `major`. `git push --follow-tags` pushes the commit and the tag, which starts the automatic publish flow below.

## 4. Automatic publish flow

The GitHub Actions workflow in `.github/workflows/publish-npm.yml` publishes when you push a tag like `v0.1.1`.

It will:

1. install dependencies with `npm ci`
2. verify the tag matches `package.json`
3. run `npm run typecheck`
4. check that `COMPONENTS.md` is up to date with `npm run docs:components:check`
5. inspect the npm tarball with `npm pack --dry-run`
6. publish to npm
7. create a GitHub Release

For trusted publishing, configure npm to trust this GitHub repository before using the workflow.

After pushing, follow the run with `gh run watch` (or `gh run list --workflow publish-npm.yml`) and report the result. If the workflow fails before the publish step, fix the cause, then delete and recreate the tag on the fixed commit (`git tag -d vX.Y.Z`, `git push origin :refs/tags/vX.Y.Z`); if it failed after publishing, the version is already on npm and the next release needs a new version number.

## 5. Align the other branches

Releases are cut from `feature`. Once the workflow has published successfully, bring `develop` and `main` up to the released commit, then return to `feature`:

```bash
git checkout develop
git merge feature
git push

git checkout main
git merge develop
git push

git checkout feature
```

- Only run this after the publish succeeded, so `develop` and `main` never point at an unreleased version.
- Stop and ask the user if a merge has conflicts or a push is rejected. Never force-push, and never resolve conflicts on `main` without the user's approval.
- Finish with `git status` and `git branch -v` to confirm all three branches point at the release commit and the working tree is back on `feature`.