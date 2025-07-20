# Deployment Guide

This guide covers various deployment options for GitFlow Kanban, from simple static hosting to advanced containerized deployments.

## 🌐 Deployment Options

### Static Hosting (Recommended)

GitFlow Kanban is a client-side React application that can be deployed to any static hosting service.

#### Netlify (Easiest)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for automatic deployments

3. **Configure build settings** (if using Git integration):
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment variables** (optional):
   ```
   VITE_GITHUB_API_BASE=https://api.github.com
   ```

#### Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Or use GitHub integration**:
   - Connect your repository at [vercel.com](https://vercel.com)
   - Vercel will automatically detect the Vite configuration

#### GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

### Cloud Platforms

#### AWS S3 + CloudFront

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload files**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Configure bucket for static hosting**:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html
   ```

5. **Set up CloudFront** for global CDN and HTTPS

#### Google Cloud Storage

1. **Create bucket**:
   ```bash
   gsutil mb gs://your-bucket-name
   ```

2. **Upload files**:
   ```bash
   gsutil -m rsync -r -d dist/ gs://your-bucket-name
   ```

3. **Configure for web serving**:
   ```bash
   gsutil web set -m index.html -e index.html gs://your-bucket-name
   ```

#### Azure Static Web Apps

1. **Create Azure Static Web App**
2. **Connect GitHub repository**
3. **Configure build**:
   ```yaml
   # .github/workflows/azure-static-web-apps.yml
   app_location: "/"
   api_location: ""
   output_location: "dist"
   ```

## 🐳 Docker Deployment

### Development Docker Setup

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**Build and run**:
```bash
docker build -f Dockerfile.dev -t gitflow-kanban:dev .
docker run -p 5173:5173 gitflow-kanban:dev
```

### Production Docker Setup

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx configuration** (`nginx.conf`):
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

**Build and run**:
```bash
docker build -t gitflow-kanban:prod .
docker run -p 80:80 gitflow-kanban:prod
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  gitflow-kanban:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./proxy.conf:/etc/nginx/nginx.conf
    depends_on:
      - gitflow-kanban
```

## ☸️ Kubernetes Deployment

### Basic Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitflow-kanban
  labels:
    app: gitflow-kanban
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gitflow-kanban
  template:
    metadata:
      labels:
        app: gitflow-kanban
    spec:
      containers:
      - name: gitflow-kanban
        image: gitflow-kanban:prod
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: gitflow-kanban-service
spec:
  selector:
    app: gitflow-kanban
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gitflow-kanban-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - gitflow-kanban.yourdomain.com
    secretName: gitflow-kanban-tls
  rules:
  - host: gitflow-kanban.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gitflow-kanban-service
            port:
              number: 80
```

**Deploy to Kubernetes**:
```bash
kubectl apply -f k8s/
```

## 🔧 Environment Configuration

### Environment Variables

Create environment-specific configuration:

```bash
# .env.production
VITE_GITHUB_API_BASE=https://api.github.com
VITE_APP_VERSION=1.0.0
VITE_SENTRY_DSN=your-sentry-dsn
```

### Build-time Configuration

```typescript
// src/config.ts
export const config = {
  githubApiBase: import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

## 🚀 CI/CD Pipelines

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      # Deploy to Netlify
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run test
  cache:
    paths:
      - node_modules/

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  cache:
    paths:
      - node_modules/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST -d {} $NETLIFY_DEPLOY_HOOK
  only:
    - main
```

## 🔒 Security Considerations

### HTTPS Configuration

Always serve GitFlow Kanban over HTTPS in production:

```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.github.com;" always;
}
```

### Environment Security

- **Never commit secrets**: Use environment variables for sensitive data
- **Rotate tokens**: Regularly rotate GitHub personal access tokens
- **Limit permissions**: Use minimal required GitHub token scopes
- **Monitor access**: Set up logging and monitoring for production deployments

## 📊 Monitoring and Analytics

### Error Tracking with Sentry

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}
```

### Performance Monitoring

```typescript
// src/utils/analytics.ts
export const trackPageView = (page: string) => {
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
      page_location: window.location.href,
    });
  }
};

export const trackEvent = (action: string, category: string) => {
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
    });
  }
};
```

## 🔄 Rollback Strategy

### Blue-Green Deployment

1. **Deploy to staging environment**
2. **Run smoke tests**
3. **Switch traffic to new version**
4. **Keep old version running for quick rollback**

### Feature Flags

```typescript
// src/utils/featureFlags.ts
export const featureFlags = {
  newDragAndDrop: import.meta.env.VITE_FEATURE_NEW_DRAG_DROP === 'true',
  advancedFiltering: import.meta.env.VITE_FEATURE_ADVANCED_FILTERING === 'true',
};

// Usage in components
if (featureFlags.newDragAndDrop) {
  // Use new drag and drop implementation
}
```

## 📈 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          dragdrop: ['@atlaskit/pragmatic-drag-and-drop'],
        },
      },
    },
  },
});
```

### CDN Configuration

```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://api.github.com">

<!-- Service Worker for caching -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
rm -rf dist
npm ci
npm run build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### CORS Issues
- Ensure GitHub API calls are made from the correct domain
- Check that your deployment URL is properly configured

#### 404 Errors on Refresh
- Configure your web server to serve `index.html` for all routes
- This is required for client-side routing to work properly

### Health Checks

```bash
# Basic health check endpoint
curl -f http://your-domain.com/ || exit 1

# More comprehensive check
curl -f http://your-domain.com/health || exit 1
```

Create a simple health check endpoint:
```typescript
// public/health.json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2023-01-01T00:00:00Z"
}
```