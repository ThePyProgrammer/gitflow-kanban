# Architecture Overview

GitFlow Kanban is built with a modern React architecture emphasizing modularity, type safety, and maintainability.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitFlow Kanban                         │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (TypeScript)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Components    │  │     Hooks       │  │   Services  │ │
│  │                 │  │                 │  │             │ │
│  │ • KanbanColumn  │  │ • useGitHubData │  │ • githubApi │ │
│  │ • IssueCard     │  │ • useLocalStorage│  │             │ │
│  │ • IssueModal    │  │                 │  │             │ │
│  │ • DraggableCard │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Material-UI + Pragmatic Drag & Drop                       │
├─────────────────────────────────────────────────────────────┤
│  GitHub REST API v3                                        │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── IssueCard.tsx    # Individual issue display
│   ├── KanbanColumn.tsx # Column container with drop zones
│   ├── IssueModal.tsx   # Issue detail modal
│   ├── DraggableIssueCard.tsx # Drag wrapper for issues
│   └── SettingsDialog.tsx # Configuration modal
├── hooks/               # Custom React hooks
│   ├── useGitHubData.ts # GitHub API data management
│   └── useLocalStorage.ts # Local storage utilities
├── services/            # External service integrations
│   └── githubApi.ts     # GitHub API client
├── types/               # TypeScript type definitions
│   └── github.ts        # GitHub API types
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔄 Data Flow

### 1. Authentication & Configuration
```
User Input → SettingsDialog → Local Storage → GitHub API Client
```

### 2. Issue Loading
```
GitHub API → useGitHubData Hook → Column Organization → Component Rendering
```

### 3. Drag & Drop
```
User Drag → Pragmatic D&D → Column State Update → Optional API Sync
```

### 4. Comments
```
User Input → Local Storage → Component Re-render
```

## 🧩 Component Architecture

### Core Components

#### `App.tsx`
- **Purpose**: Main application orchestrator
- **Responsibilities**: 
  - Theme provider setup
  - Global state management
  - Route-level error handling
  - Settings management

#### `KanbanColumn.tsx`
- **Purpose**: Column container with drop zone functionality
- **Responsibilities**:
  - Drop target registration
  - Issue rendering
  - Visual feedback during drag operations

#### `IssueCard.tsx`
- **Purpose**: Individual issue display
- **Responsibilities**:
  - Issue metadata rendering
  - Label and assignee display
  - Click handling for modal opening

#### `DraggableIssueCard.tsx`
- **Purpose**: Drag functionality wrapper
- **Responsibilities**:
  - Drag source registration
  - Drag state management
  - Visual feedback during drag

### Utility Components

#### `IssueModal.tsx`
- **Purpose**: Detailed issue view and editing
- **Features**:
  - Full issue metadata display
  - Custom comment system
  - External link to GitHub

#### `SettingsDialog.tsx`
- **Purpose**: GitHub repository configuration
- **Features**:
  - Repository connection setup
  - Token validation
  - Settings persistence

## 🎣 Custom Hooks

### `useGitHubData`
- **Purpose**: GitHub API data management
- **Features**:
  - Issue fetching and caching
  - Column organization logic
  - Error handling and loading states
  - Optimistic updates for drag operations

### `useLocalStorage`
- **Purpose**: Persistent local storage management
- **Features**:
  - Type-safe storage operations
  - Automatic serialization/deserialization
  - Error handling for storage failures

## 🌐 External Integrations

### GitHub REST API v3
- **Authentication**: Personal Access Tokens
- **Endpoints Used**:
  - `/repos/{owner}/{repo}/issues` - Issue listing
  - `/repos/{owner}/{repo}/issues/{number}` - Individual issues
  - `/projects/{id}/columns` - Project columns (future enhancement)

### Pragmatic Drag and Drop
- **Purpose**: Smooth, accessible drag-and-drop
- **Integration**: Element adapter for DOM-based dragging
- **Features**: 
  - Automatic accessibility
  - Touch device support
  - Performance optimization

## 🎨 Styling Architecture

### Material-UI Theme
- **Base**: Light theme with custom primary colors
- **Typography**: Roboto font family with consistent hierarchy
- **Components**: Custom overrides for Cards and Buttons
- **Responsive**: Built-in breakpoint system

### Component Styling
- **Approach**: CSS-in-JS with Emotion
- **Patterns**: 
  - `sx` prop for component-specific styles
  - Theme-based spacing and colors
  - Responsive design utilities

## 🔒 Security Considerations

### Token Storage
- **Method**: Browser localStorage
- **Scope**: Client-side only, never transmitted to third parties
- **Encryption**: Browser-level security only

### API Communication
- **Protocol**: HTTPS only
- **Authentication**: GitHub Personal Access Tokens
- **Scope**: Minimal required permissions (repo access)

## 📈 Performance Optimizations

### React Optimizations
- **Memoization**: Strategic use of `useCallback` and `useMemo`
- **Component Splitting**: Logical separation of concerns
- **Lazy Loading**: Modal components loaded on demand

### API Optimizations
- **Caching**: Local state caching of GitHub data
- **Batching**: Grouped API calls where possible
- **Error Recovery**: Automatic retry logic for failed requests

### Drag & Drop Performance
- **Library Choice**: Pragmatic D&D for optimal performance
- **Visual Feedback**: CSS transforms for smooth animations
- **State Management**: Minimal re-renders during drag operations