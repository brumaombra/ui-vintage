# Publishing to npm

## Package name

This package is published under the npm scope `@brumaombra/ui-vintage` instead of using a plain prefixed name.

- `@brumaombra/ui-vintage` follows the standard npm convention for scoped packages.
- It avoids awkward name collisions in the global namespace.
- It is easier to recognize as a package you own.

Keep the `name` field in `package.json` aligned with that scoped package name.

## Manual release flow

```bash
npm pack --dry-run
npm version minor
git push --follow-tags
```

## Automatic publish flow

The GitHub Actions workflow in `.github/workflows/publish-npm.yml` publishes when you push a tag like `v0.1.1`.

It will:

1. install dependencies with `npm ci`
2. verify the tag matches `package.json`
3. run `npm run typecheck`
4. run `npm run build`
5. publish to npm
6. create a GitHub Release

For trusted publishing, configure npm to trust this GitHub repository before using the workflow.