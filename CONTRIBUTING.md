# Contributing

Thank you for helping improve AEM Forms Rules Editor. Small, focused pull requests are easiest to review.

## Before you start

1. Search existing issues and open an issue for substantial changes.
2. Do not include credentials, customer data, generated build output, `node_modules`, or `.vsix` packages in a pull request.
3. Keep changes compatible with the supported AEM and Java versions documented in the README.

## Local development

Prerequisites:

- Java 11 or newer
- Maven 3.3.9 or newer
- Node.js and npm versions supported by the checked-in lockfiles
- A local AEM Forms SDK only when running integration, package-install, or UI tests

Useful checks:

```bash
mvn -pl core test
cd ui.frontend && npm ci && npm run prod
cd ../vscode-extension && npm ci && npm run catalog:check && npm run compile
```

When adding or renaming a client-side rule, update its JSDoc in the AEM client library and the VS Code metadata, then run `npm run catalog:generate` from `vscode-extension` to refresh `docs/function-catalog.json`. The catalog check must pass before submitting a pull request.

The complete Maven build and AEM-backed tests require local Adobe SDK artifacts and a configured AEM instance. Do not put those credentials in source control; pass them through environment variables or local Maven settings.

## Pull requests

Explain the user impact, list the validation you ran, and call out any AEM version, permission, endpoint, or migration implications. Add or update tests and documentation when behavior changes. The CI workflow must pass before merge.

Use clear commit subjects in the imperative mood, for example `Add validation for ...`.
