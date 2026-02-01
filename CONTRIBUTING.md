# Contributing to World Pulse

Thanks for your interest in contributing! 🎸

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/world-pulse.git
   cd world-pulse
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b feat/my-feature
   ```

## Development Workflow

### Running Locally

```bash
# Start dev server (backend + frontend)
npm run dev

# Or run Electron app
npm run dev:electron
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Auto-fix issues
npm run lint:fix

# Format all files
npm run format
```

**Pre-commit hooks will auto-format your code.**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

Examples:
```
feat: add news sentiment heat map
fix: resolve timezone bug in ticker
docs: update API documentation
test: add coverage for earthquake collector
```

**Commits are validated on commit via commitlint.**

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

**PRs must maintain >70% test coverage.**

### Type Checking

```bash
npm run typecheck
```

TypeScript strict mode is enforced.

## Pull Request Process

1. **Create your feature branch** from `develop`
2. **Make your changes** following code style
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Ensure CI passes:**
   - Linting
   - Type checking
   - Tests
   - Security scan
6. **Submit PR** targeting `develop` branch
7. **Address review feedback**

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] CI passes
- [ ] No new security vulnerabilities

## Adding New Data Collectors

To add a new data source:

1. **Create collector class** in `src/server/collectors/`
   ```typescript
   import { BaseCollector } from './base';
   
   export class MyCollector extends BaseCollector {
     constructor() {
       super('My Source', 'mytype', 60000); // 1 min interval
     }
     
     async fetch(): Promise<Event[]> {
       // Implement data fetching
     }
     
     validate(data: unknown): boolean {
       // Validate API response
     }
   }
   ```

2. **Add tests** in `tests/unit/collectors/my-collector.test.ts`
3. **Register in aggregator** (when implemented)
4. **Update documentation** with API requirements

## Architecture Guidelines

- **Keep collectors isolated** - each should fail gracefully
- **Validate external data** - never trust API responses
- **Use TypeScript interfaces** - define types for all data shapes
- **Test in isolation** - mock external APIs in tests
- **Log, don't throw** - collectors should handle errors internally

## Questions?

Open a discussion or reach out in Issues.

## Code of Conduct

Be respectful. Collaborate constructively. Help others learn.

---

Happy coding! 🌍
