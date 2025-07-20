# GitFlow Kanban 🚀

A modern, intuitive kanban board interface for GitHub Projects built with React, TypeScript, and Material-UI. Visualize and manage your GitHub issues with beautiful drag-and-drop functionality.

![GitFlow Kanban](https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- **🎯 GitHub Integration**: Connect directly to your GitHub repositories
- **📋 Kanban Board**: Organize issues in customizable columns (To Do, In Progress, Done)
- **🖱️ Drag & Drop**: Smooth drag-and-drop functionality powered by Atlassian's Pragmatic Drag and Drop
- **💬 Custom Comments**: Add your own notes and comments to issues
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **🎨 Material-UI**: Clean, professional interface with Google's Material Design
- **⚡ Real-time Updates**: Sync with GitHub API for live issue status
- **🔒 Secure**: Your GitHub token is stored locally and never transmitted to third parties

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd gitflow-kanban
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Configure GitHub Access**
   - Create a GitHub Personal Access Token with `repo` permissions
   - Open the application and click "Configure Repository"
   - Enter your repository details and token

## 🌐 GitHub Pages Deployment

This project includes automatic GitHub Pages deployment via GitHub Actions:

1. **Enable GitHub Pages**: Go to Settings > Pages > Source: "GitHub Actions"
2. **Push to main**: Automatic deployment triggers on every push to main branch
3. **Access your site**: Available at `https://username.github.io/gitflow-kanban`

The deployment workflow includes:
- Dependency installation and caching
- Code linting and testing
- Production build generation
- Automatic deployment to GitHub Pages

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Setup Guide](./docs/setup.md)
- [API Reference](./docs/api.md)
- [Component Documentation](./docs/components.md)
- [Contributing Guidelines](./docs/contributing.md)
- [Deployment Guide](./docs/deployment.md)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Drag & Drop**: Atlassian Pragmatic Drag and Drop
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)
- **API**: GitHub REST API v3

## 📋 Requirements

- Node.js 16+ 
- npm or yarn
- GitHub Personal Access Token with repository permissions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing comprehensive repository data
- [Material-UI](https://mui.com/) for the beautiful component library
- [Atlassian Pragmatic Drag and Drop](https://atlassian.design/components/pragmatic-drag-and-drop/) for smooth drag-and-drop functionality