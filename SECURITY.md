# Security policy

## Scope

This repository contains an AEM Forms reference implementation. The sample `/bin/rules-api/*` endpoints, demo data, default local credentials, and external API integrations must be reviewed and hardened before any non-local deployment.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Email the maintainer listed in the repository profile with the subject `Security report: AEM Forms Rules Editor`, including the affected component, impact, reproduction steps, and a suggested mitigation if available. Remove credentials and personal data from reports.

If private reporting is unavailable, open a minimal issue asking for a private contact channel without disclosing the vulnerability details.

## Deployment baseline

- Replace all local `admin` credentials and never commit secrets.
- Add authentication, authorization, CSRF protection, rate limiting, and request-size limits to custom endpoints.
- Validate and constrain paths, identifiers, uploaded files, XML, and external URLs server-side.
- Configure SMTP, CAPTCHA, data retention, logging, and third-party API usage for the target environment.
- Keep AEM, the Forms add-on, Java, Maven, npm dependencies, and the VS Code extension toolchain patched.
