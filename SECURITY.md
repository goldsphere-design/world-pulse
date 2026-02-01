# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue.

Instead, please email: [your-email@example.com]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a more detailed response within 7 days.

## Security Best Practices

This project follows these security practices:

1. **Dependency Management**
   - Automated weekly dependency updates via Dependabot
   - Security scanning with npm audit and Snyk
   - High/critical CVEs block CI pipeline

2. **Secrets Management**
   - API keys in environment variables only
   - No secrets committed to repository
   - `.env.local` gitignored

3. **Code Security**
   - TypeScript strict mode
   - ESLint security rules
   - CodeQL analysis on every push

4. **Supply Chain Security**
   - Lock files committed
   - Verified package sources
   - Minimal dependency footprint

## Security Features

- HTTPS-only external API calls
- Input validation on all external data
- Rate limiting on data collectors
- Sandboxed Electron environment (if applicable)

## Contact

For questions about security: [your-email@example.com]
