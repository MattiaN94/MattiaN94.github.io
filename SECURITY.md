# Security policy

## Supported version

The current main branch and the live site at
[mattian94.github.io](https://mattian94.github.io/) are supported. Historical
commits and third-party copies are not.

## Reporting a vulnerability

Please use the repository's
[private vulnerability reporting form](https://github.com/MattiaN94/MattiaN94.github.io/security/advisories/new).
Do not publish exploit details in a public issue.

Include:

- the affected URL or file;
- a concise description of the impact;
- reproducible steps or a minimal proof of concept;
- the browser and operating system used;
- any suggested remediation.

You should receive an acknowledgement within three business days. Confirmed
issues will be prioritised by impact, fixed privately where practical and
credited with the reporter's permission.

## Scope

This repository contains a static portfolio. It has no server-side runtime,
account system, database, advertising or behavioural analytics.

In scope:

- vulnerabilities introduced by the HTML, CSS or JavaScript in this repository;
- unsafe handling of user-provided text in the on-device tools;
- cross-site scripting, malicious navigation or privacy regressions;
- accidental publication of secrets or confidential material.

Out of scope:

- GitHub or GitHub Pages infrastructure;
- denial-of-service, automated high-volume traffic or destructive testing;
- social engineering;
- findings that require a compromised browser, extension or device;
- content accuracy questions that have no security or privacy impact.

Please test only with data and systems you are authorised to use.
