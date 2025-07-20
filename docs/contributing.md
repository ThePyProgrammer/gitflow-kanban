# Contributing to GitFlow Kanban

We welcome contributions to GitFlow Kanban! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new functionality
- **📝 Documentation**: Improve or add documentation
- **🔧 Code Contributions**: Fix bugs or implement features
- **🎨 Design Improvements**: Enhance UI/UX
- **🧪 Testing**: Add or improve tests

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/gitflow-kanban.git
cd gitflow-kanban

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/gitflow-kanban.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

### 3. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting. Please ensure your code follows these standards:

```bash
# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### TypeScript Guidelines

- **Use strict typing**: Avoid `any` types when possible
- **Define interfaces**: Create proper interfaces for all data structures
- **Use generics**: Leverage TypeScript generics for reusable components
- **Document complex types**: Add JSDoc comments for complex type definitions

Example:
```typescript
/**
 * Represents a GitHub issue with all metadata
 */
interface GitHubIssue {
  id: number;
  title: string;
  state: 'open' | 'closed';
  // ... other properties
}

/**
 * Props for the IssueCard component
 */
interface IssueCardProps {
  issue: GitHubIssue;
  onClick: (issue: GitHubIssue) => void;
  isDragging?: boolean;
}
```

### React Component Guidelines

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 6. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 7. Render
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
}
```

#### Naming Conventions
- **Components**: PascalCase (`IssueCard`, `KanbanColumn`)
- **Files**: PascalCase for components (`IssueCard.tsx`)
- **Functions**: camelCase (`handleClick`, `fetchIssues`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase with descriptive names (`GitHubIssue`, `KanbanColumnProps`)

### Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format
<type>[optional scope]: <description>

# Examples
feat: add drag and drop functionality to kanban columns
fix: resolve GitHub API authentication issue
docs: update setup guide with token creation steps
style: improve issue card hover animations
test: add unit tests for useGitHubData hook
refactor: extract GitHub API service into separate module
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🧪 Testing

### Writing Tests

We use Vitest and React Testing Library. Please include tests for:

- **New components**: Test rendering and user interactions
- **New hooks**: Test state changes and side effects
- **Bug fixes**: Add regression tests
- **Utility functions**: Test edge cases and error conditions

#### Component Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { IssueCard } from './IssueCard';

const mockIssue = {
  id: 1,
  number: 123,
  title: 'Test Issue',
  state: 'open' as const,
  user: { login: 'testuser', avatar_url: '', html_url: '', id: 1 },
  assignees: [],
  labels: [],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  html_url: 'https://github.com/test/repo/issues/123',
  comments: 0,
  reactions: { '+1': 0, '-1': 0, laugh: 0, hooray: 0, confused: 0, heart: 0, rocket: 0, eyes: 0 }
};

describe('IssueCard', () => {
  it('renders issue title and number', () => {
    const handleClick = jest.fn();
    
    render(<IssueCard issue={mockIssue} onClick={handleClick} />);
    
    expect(screen.getByText('Test Issue')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    
    render(<IssueCard issue={mockIssue} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Issue'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Hook Test Example
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('updates stored value when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test IssueCard.test.tsx
```

## 📝 Documentation

### Code Documentation

- **JSDoc comments**: Document complex functions and components
- **README updates**: Update relevant documentation for new features
- **Type definitions**: Ensure all TypeScript interfaces are well-documented

Example JSDoc:
```typescript
/**
 * Custom hook for managing GitHub repository data
 * 
 * @param owner - Repository owner (username or organization)
 * @param repo - Repository name
 * @param token - GitHub personal access token
 * @returns Object containing issues, columns, loading state, and utility functions
 * 
 * @example
 * ```typescript
 * const { issues, columns, loading, error } = useGitHubData('facebook', 'react', 'token');
 * ```
 */
export function useGitHubData(owner: string, repo: string, token: string) {
  // Implementation
}
```

### Documentation Updates

When adding features, please update:

- **README.md**: If the feature affects setup or usage
- **API documentation**: For new API integrations
- **Component documentation**: For new components or significant changes
- **Architecture documentation**: For structural changes

## 🐛 Bug Reports

### Before Submitting

1. **Search existing issues**: Check if the bug has already been reported
2. **Reproduce the bug**: Ensure you can consistently reproduce the issue
3. **Test in different browsers**: Verify the issue isn't browser-specific
4. **Check the console**: Look for JavaScript errors or warnings

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain the problem.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome 91, Firefox 89, Safari 14]
- Node.js version: [e.g., 16.14.0]
- GitFlow Kanban version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem Statement
What problem does this feature solve? What use case does it address?

## Proposed Solution
Describe your preferred solution or approach.

## Alternative Solutions
Describe any alternative solutions or features you've considered.

## Additional Context
Add any other context, mockups, or examples about the feature request.

## Implementation Notes
If you have ideas about how this could be implemented, please share them.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**: Rebase against the latest main branch
2. **Run tests**: Ensure all tests pass
3. **Run linting**: Fix any linting errors
4. **Update documentation**: Add or update relevant documentation
5. **Test manually**: Verify your changes work as expected

### Pull Request Template

```markdown
## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help reviewers understand the changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks**: Ensure CI/CD checks pass
2. **Code review**: At least one maintainer will review your code
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Once approved, your PR will be merged

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release notes
4. Tag the release
5. Deploy to production

## 🤔 Questions?

If you have questions about contributing:

1. **Check existing documentation**: Look through the docs/ folder
2. **Search issues**: See if your question has been asked before
3. **Create a discussion**: Start a GitHub Discussion for general questions
4. **Contact maintainers**: Reach out to the project maintainers

## 🙏 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release notes**: Major contributions highlighted
- **GitHub**: Contributor graphs and statistics

Thank you for contributing to GitFlow Kanban! 🎉