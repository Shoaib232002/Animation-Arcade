# Animation-Arcade

A web-based project for animations and interactive UI elements with comprehensive automated development tools.

## Quick Start
```bash
git clone https://github.com/Shoaib232002/Animation-Arcade.git
cd Animation-Arcade
nvm use
npm install
```

**That's it!** All automated checks are now configured and will run automatically when you commit.

## Features

- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white) - JavaScript linting with automatic fixes on commit
- ![Stylelint](https://img.shields.io/badge/Stylelint-263238?logo=stylelint&logoColor=white) - CSS linting with automatic fixes on commit
- ![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white) - Unit testing framework with automated execution
- ![Husky](https://img.shields.io/badge/Husky-000000?logo=git&logoColor=white) - Git hooks for pre-commit validation
- ![Commitlint](https://img.shields.io/badge/Commitlint-2B2B2B?logo=commitlint&logoColor=white) - Enforced conventional commit message format
- ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=github-actions&logoColor=white) - Continuous integration pipeline
- ![Automated Testing](https://img.shields.io/badge/Automated%20Testing-4CAF50?logo=checkmarx&logoColor=white) - Tests run automatically on commit for changed files

## Development

### Running the Project

Open `index.html` in your browser or start a local server:
```bash
npx http-server
```

### Available Commands
```bash
npm test              # Run Jest tests once
npm run test:watch    # Watch mode - tests run automatically on file save
npm run lint          # Run ESLint
npm run lint:css      # Run Stylelint
```

## Development Workflow

### Standard Workflow (Fully Automated)

1. Make changes to your files
2. Save with `Ctrl+S`
3. Stage and commit:
```bash
   git add .
   git commit -m "feat: your changes"
```
4. **Automated checks run automatically:**
   - ESLint validates JavaScript
   - Stylelint validates CSS
   - Jest runs tests for changed files only
   - Commitlint validates commit message

5. If all checks pass, commit succeeds!
6. Push to remote:
```bash
   git push
```

### Optional: Watch Mode for Instant Feedback

For continuous test feedback while coding (optional):
```bash
# Open a separate terminal and run:
npm run test:watch

# Now tests run automatically every time you save (Ctrl+S)
# This gives instant feedback before committing
```

## Commit Message Format

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
<type>(<scope>): <subject>
```

### Allowed Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

## Pre-commit Validation

**Every commit automatically triggers these checks:**

1. **ESLint** - Validates JavaScript code quality
2. **Stylelint** - Validates CSS code quality
3. **Jest Tests** - Runs tests only for changed files (fast!)
4. **Commitlint** - Validates commit message format

**If any check fails, the commit is rejected.** Fix the issues and commit again.

## Continuous Integration

GitHub Actions workflow runs automatically on push and pull requests to `main` branch:

- ESLint validation
- Stylelint validation
- Complete Jest test suite
- Build verification

All checks must pass before pull requests can be merged.

## Contributing

1. **Fork the repository**
2. **Clone your fork:**
```bash
   git clone https://github.com/YOUR_USERNAME/Animation-Arcade.git
   cd Animation-Arcade
   nvm use
   npm install
```
3. **Create a feature branch:**
```bash
   git checkout -b feature/amazing-feature
```
4. **Make your changes**
   - Write code
   - Add tests for new functionality
   - Optionally run `npm run test:watch` for instant feedback
5. **Commit using conventional format:**
```bash
   git add .
   git commit -m "feat: add amazing feature"
```
   (Tests run automatically!)
6. **Push to your fork:**
```bash
   git push origin feature/amazing-feature
```
7. **Open a Pull Request** on GitHub

### Contribution Guidelines
- Follow conventional commit format
- Add tests for new features
- Ensure all automated checks pass
- Update documentation as needed

## Requirements

- **Node.js** v24.11.1 (specified in `.nvmrc`)
- **npm** v10 or higher
- **Git** for version control

## Testing

### Test Structure
```
Animation-Arcade/
├── __tests__/
│   └── add.test.js
├── js/
│   └── add.js
└── ...
```

### Writing Tests
```javascript
import { yourFunction } from "../js/yourFile.js";

describe("yourFunction()", () => {
  test("should do something", () => {
    expect(yourFunction(input)).toBe(expectedOutput);
  });
});
```

### Running Tests
```bash
# Run once
npm test

# Watch mode (optional, for instant feedback)
npm run test:watch

# Automatic on commit (already configured!)
git commit -m "feat: your changes"
```

## Troubleshooting

### Commit rejected by tests
- Check the error in your terminal
- Fix the failing tests
- Run `npm test` locally to verify
- Commit again

### ESLint errors blocking commit
- Run `npm run lint` to see all issues
- Fix the problems
- Commit again

### Invalid commit message
- Use format: `type: message`
- Example: `feat: add feature`
- Not: `Add feature`

### Husky hooks not working
```bash
npm run prepare
```

## Team Members

- **Siripireddy Giri**
- **Mohammed Shoaib**

## License

ISC
