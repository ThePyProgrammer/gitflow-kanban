# Setup Guide

This guide will help you set up GitFlow Kanban for development and production use.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **GitHub account** with repository access

## 🚀 Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gitflow-kanban
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Configure GitHub Access

#### Create a Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give your token a descriptive name (e.g., "GitFlow Kanban Access")
4. Select the following scopes:
   - `repo` - Full control of private repositories
   - `read:user` - Read user profile data
5. Click "Generate token"
6. **Important**: Copy the token immediately - you won't be able to see it again!

#### Configure the Application

1. Open GitFlow Kanban in your browser
2. Click "Configure Repository" button
3. Enter your repository details:
   - **Repository Owner**: GitHub username or organization name
   - **Repository Name**: The repository name
   - **Personal Access Token**: The token you just created

Example configuration:
```
Repository Owner: facebook
Repository Name: react
Personal Access Token: ghp_xxxxxxxxxxxxxxxxxxxx
```

## 🔧 Environment Configuration

### Development Environment Variables

Create a `.env.local` file in the root directory for local development:

```env
# Optional: Custom API base URL
VITE_GITHUB_API_BASE=https://api.github.com

# Optional: Enable debug logging
VITE_DEBUG=true
```

### Production Environment Variables

For production deployments, configure these environment variables:

```env
VITE_GITHUB_API_BASE=https://api.github.com
VITE_APP_VERSION=1.0.0
```

## 🏗️ Build Configuration

### Development Build

```bash
npm run dev
```

Features enabled in development:
- Hot module replacement
- Source maps
- Development error overlay
- React DevTools support

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Asset optimization
- Source maps (optional)

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing Setup

### Running Tests

```bash
npm run test
# or
yarn test
```

### Test Configuration

The project uses Vitest for testing. Configuration is in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## 🔍 Linting and Code Quality

### ESLint Configuration

Run linting:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint:fix
```

### TypeScript Type Checking

```bash
npm run type-check
```

## 🐳 Docker Setup (Optional)

### Development with Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

Build and run:
```bash
docker build -t gitflow-kanban .
docker run -p 5173:5173 gitflow-kanban
```

### Production Docker

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Vite Dependency Cache Issues

If you encounter module resolution errors:

```bash
rm -rf node_modules/.vite
rm -rf node_modules
npm install
```

#### 2. GitHub API 401 Errors

- Verify your Personal Access Token is correct
- Ensure the token has `repo` scope
- Check that the repository owner/name are correct
- Verify the repository exists and you have access

#### 3. Drag and Drop Not Working

- Ensure you're using a modern browser (Chrome 88+, Firefox 87+, Safari 14+)
- Check browser console for JavaScript errors
- Verify Pragmatic Drag and Drop dependencies are installed

#### 4. Build Failures

Clear all caches and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Debug Mode

Enable debug logging by setting:

```env
VITE_DEBUG=true
```

This will log additional information to the browser console.

### Performance Issues

If the application feels slow:

1. Check browser DevTools Performance tab
2. Verify you're not loading too many issues (>100)
3. Consider implementing pagination for large repositories
4. Check network tab for slow API calls

## 📱 Browser Support

GitFlow Kanban supports:

- **Chrome** 88+
- **Firefox** 87+
- **Safari** 14+
- **Edge** 88+

### Mobile Support

The application is responsive and works on:
- iOS Safari 14+
- Chrome Mobile 88+
- Samsung Internet 13+

## 🔄 Updates and Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Major Version Updates

For major dependency updates:

1. Check the changelog for breaking changes
2. Update one dependency at a time
3. Test thoroughly after each update
4. Update TypeScript types if needed

### Security Updates

Regularly run:

```bash
npm audit
npm audit fix
```

For high-severity vulnerabilities, update immediately.