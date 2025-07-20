# Component Documentation

This document provides detailed information about all React components in GitFlow Kanban.

## 🏗️ Component Hierarchy

```
App
├── AppBar (MUI)
├── Container (MUI)
├── Grid (MUI)
│   └── KanbanColumn (×3)
│       └── DraggableIssueCard (×N)
│           └── IssueCard
├── IssueModal
└── SettingsDialog
```

## 📱 Core Components

### App.tsx

**Purpose**: Main application component that orchestrates the entire kanban board interface.

**Props**: None (root component)

**State**:
```typescript
interface AppState {
  settings: AppSettings;
  settingsOpen: boolean;
  selectedIssue: GitHubIssue | null;
  draggedIssue: number | null;
}
```

**Key Features**:
- Material-UI theme provider setup
- Global state management for settings and UI state
- GitHub API integration coordination
- Drag and drop orchestration

**Usage**:
```typescript
function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('github-settings', {
    owner: '',
    repo: '',
    token: '',
  });
  
  // Component logic...
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}
```

---

### KanbanColumn.tsx

**Purpose**: Represents a single column in the kanban board with drop zone functionality.

**Props**:
```typescript
interface KanbanColumnProps {
  column: KanbanColumn;
  onIssueClick: (issue: GitHubIssue) => void;
  onDrop: (issueId: number, columnId: string) => void;
  draggedIssue: number | null;
}
```

**Features**:
- Drop target registration with Pragmatic Drag and Drop
- Visual feedback during drag operations
- Issue count badge
- Responsive design with proper spacing

**Drag & Drop Integration**:
```typescript
useEffect(() => {
  const el = ref.current;
  if (!el) return;

  return dropTargetForElements({
    element: el,
    onDragEnter: () => setIsDraggedOver(true),
    onDragLeave: () => setIsDraggedOver(false),
    onDrop: ({ source }) => {
      const issueId = Number(source.data.issueId);
      onDrop(issueId, column.id);
    },
  });
}, [column.id, onDrop]);
```

**Styling**:
- Dynamic background colors based on column type
- Smooth transitions for drag feedback
- Minimum height for consistent layout

---

### IssueCard.tsx

**Purpose**: Displays individual GitHub issues with metadata and visual indicators.

**Props**:
```typescript
interface IssueCardProps {
  issue: GitHubIssue;
  onClick: () => void;
  isDragging?: boolean;
}
```

**Features**:
- Issue type icons (bug, enhancement, etc.)
- Label display with GitHub colors
- Assignee avatars
- Comment count and creation date
- Hover effects and click handling

**Visual Elements**:
```typescript
const getIssueTypeIcon = () => {
  const hasEnhancementLabel = issue.labels.some(label => 
    label.name.toLowerCase().includes('enhancement')
  );
  const hasBugLabel = issue.labels.some(label => 
    label.name.toLowerCase().includes('bug')
  );
  
  if (hasEnhancementLabel) return <Star fontSize="small" />;
  if (hasBugLabel) return <BugReport fontSize="small" />;
  return <Label fontSize="small" />;
};
```

**Responsive Design**:
- Text truncation for long titles and descriptions
- Flexible label display (shows first 3, then "+N more")
- Adaptive spacing for different screen sizes

---

### DraggableIssueCard.tsx

**Purpose**: Wrapper component that adds drag functionality to IssueCard.

**Props**:
```typescript
interface DraggableIssueCardProps {
  issue: GitHubIssue;
  onClick: () => void;
  onDragStart: (issueId: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}
```

**Drag Implementation**:
```typescript
useEffect(() => {
  const el = ref.current;
  if (!el) return;

  return draggable({
    element: el,
    getInitialData: () => ({ issueId: issue.id }),
    onDragStart: () => onDragStart(issue.id),
    onDrop: () => onDragEnd(),
  });
}, [issue.id, onDragStart, onDragEnd]);
```

**Visual Feedback**:
- Opacity reduction during drag
- Subtle rotation effect
- Smooth transitions

---

### IssueModal.tsx

**Purpose**: Full-screen modal for detailed issue viewing and custom comment management.

**Props**:
```typescript
interface IssueModalProps {
  issue: GitHubIssue | null;
  open: boolean;
  onClose: () => void;
}
```

**Features**:
- Complete issue metadata display
- Custom comment system with local storage
- External link to GitHub issue
- Responsive dialog layout

**Comment System**:
```typescript
const handleAddComment = () => {
  const comment: CustomComment = {
    id: Date.now().toString(),
    issueId: issue.id,
    content: newComment.trim(),
    author: 'You',
    timestamp: new Date().toISOString(),
  };
  
  setComments([...comments, comment]);
  setNewComment('');
};
```

**Sections**:
1. **Header**: Title, issue number, status, GitHub link
2. **Description**: Issue body content
3. **Metadata**: Author, assignees, dates, labels, milestone
4. **Comments**: Custom comments with add functionality

---

### SettingsDialog.tsx

**Purpose**: Configuration modal for GitHub repository connection setup.

**Props**:
```typescript
interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}
```

**Form Fields**:
- Repository Owner (username/organization)
- Repository Name
- GitHub Personal Access Token (password field)

**Validation**:
```typescript
const isValid = settings.owner && settings.repo && settings.token;
```

**Features**:
- Form validation
- Help text for token creation
- Secure token input (password type)
- Settings persistence

## 🎣 Custom Hooks

### useGitHubData

**Purpose**: Manages GitHub API data fetching and state management.

**Parameters**:
```typescript
function useGitHubData(owner: string, repo: string, token: string)
```

**Returns**:
```typescript
interface UseGitHubDataReturn {
  issues: GitHubIssue[];
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  moveIssue: (issueId: number, fromColumnId: string, toColumnId: string) => void;
}
```

**Features**:
- Automatic issue fetching on parameter changes
- Column organization logic
- Optimistic updates for drag operations
- Error handling and loading states

### useLocalStorage

**Purpose**: Type-safe localStorage management with React state synchronization.

**Parameters**:
```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

**Features**:
- Automatic JSON serialization/deserialization
- Error handling for storage failures
- Type safety with generics
- React state synchronization

## 🎨 Styling Patterns

### Material-UI Theme

```typescript
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});
```

### Common Styling Patterns

#### Responsive Spacing
```typescript
sx={{
  p: { xs: 1, sm: 2, md: 3 },
  mb: { xs: 1, sm: 2 },
}}
```

#### Conditional Styling
```typescript
sx={{
  backgroundColor: isDraggedOver ? '#e1f5fe' : getColumnColor(),
  border: isDraggedOver ? '2px dashed #2196f3' : '2px solid transparent',
}}
```

#### Hover Effects
```typescript
sx={{
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 3,
  },
}}
```

## 🔄 State Management Patterns

### Local Component State
```typescript
const [isDraggedOver, setIsDraggedOver] = useState(false);
const [newComment, setNewComment] = useState('');
```

### Lifted State
```typescript
// In App.tsx
const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);

// Passed to children
<IssueModal
  issue={selectedIssue}
  onClose={() => setSelectedIssue(null)}
/>
```

### Persistent State
```typescript
const [settings, setSettings] = useLocalStorage<AppSettings>('github-settings', {
  owner: '',
  repo: '',
  token: '',
});
```

## 🧪 Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { IssueCard } from './IssueCard';

test('renders issue title', () => {
  const mockIssue = {
    id: 1,
    title: 'Test Issue',
    // ... other properties
  };
  
  render(<IssueCard issue={mockIssue} onClick={() => {}} />);
  expect(screen.getByText('Test Issue')).toBeInTheDocument();
});
```

### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

test('stores and retrieves values', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
  
  act(() => {
    result.current[1]('new value');
  });
  
  expect(result.current[0]).toBe('new value');
});
```

## 🚀 Performance Considerations

### Memoization
```typescript
const organizeIssuesIntoColumns = useCallback((issues: GitHubIssue[]) => {
  // Organization logic
}, []);

const memoizedColumns = useMemo(() => 
  organizeIssuesIntoColumns(issues), 
  [issues, organizeIssuesIntoColumns]
);
```

### Lazy Loading
```typescript
const IssueModal = lazy(() => import('./IssueModal'));

// Usage with Suspense
<Suspense fallback={<CircularProgress />}>
  <IssueModal />
</Suspense>
```

### Virtual Scrolling (Future Enhancement)
For repositories with many issues, consider implementing virtual scrolling:
```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedColumn = ({ issues }) => (
  <List
    height={600}
    itemCount={issues.length}
    itemSize={120}
    itemData={issues}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <IssueCard issue={data[index]} />
      </div>
    )}
  </List>
);
```