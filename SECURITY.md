# Security Policy

## Threat model

Context Plane Architecture Decisions is a static web app. It has no server, no API and no sign-in. Everything a person enters (the patterns chosen, the reasons, the architecture names) is stored in that person's own browser, in `localStorage`. Nothing is sent anywhere.

Export JSON downloads a file to the person's own computer. Import reads a file the person picks, in the browser.

## Supported versions

Only the latest commit on `main` is supported. We do not backport security fixes to older commits. If you run a fork, rebase onto current `main` to pick up fixes.

## Reporting a vulnerability

Please report security issues privately to [security@AgileDataGuides.com](mailto:security@AgileDataGuides.com). Include:

- A description of the issue and the impact you believe it has.
- Steps to reproduce, or a proof of concept if you have one.
- The commit SHA you tested against.

Please do not open a public GitHub issue for a vulnerability report. If you open one by accident, close it and email us.

## Out of scope

These are design choices, not vulnerabilities:

- **No authentication.** There is no server and no shared data, so there is no user to authenticate.
- **Data in `localStorage` is not encrypted.** Anyone with access to the browser profile can read it. Do not write secrets in a reason or a description.
- **An imported file is trusted as far as its shape.** Import checks that the file has the fields it needs and that it is 5 MB or smaller. The text in it is shown as text, never run as code.

## Hardening

- The local dev server binds to loopback (`127.0.0.1`), never `0.0.0.0`.
- The app does not use the abandoned `xlsx` package, and it reads no spreadsheet files.
- Dependabot watches `package.json` and the GitHub Actions workflows weekly.
