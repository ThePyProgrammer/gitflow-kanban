import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  Settings,
  Refresh,
  GitHub,
} from '@mui/icons-material';
import { KanbanColumn } from './components/KanbanColumn';
import { DraggableIssueCard } from './components/DraggableIssueCard';
import { IssueModal } from './components/IssueModal';
import { SettingsDialog } from './components/SettingsDialog';
import { useGitHubData } from './hooks/useGitHubData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GitHubIssue } from './types/github';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

interface AppSettings {
  owner: string;
  repo: string;
  token: string;
}

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('github-settings', {
    owner: '',
    repo: '',
    token: '',
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [draggedIssue, setDraggedIssue] = useState<number | null>(null);

  const { columns, loading, error, refetch, moveIssue } = useGitHubData(
    settings.owner,
    settings.repo,
    settings.token
  );

  const handleSettingsSave = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleDrop = (issueId: number, newColumnId: string) => {
    // Find the current column of the issue
    const currentColumn = columns.find(col => 
      col.issues.some(issue => issue.id === issueId)
    );
    
    if (currentColumn && currentColumn.id !== newColumnId) {
      moveIssue(issueId, currentColumn.id, newColumnId);
    }
  };

  const isConfigured = settings.owner && settings.repo && settings.token;

  if (!isConfigured) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
          p={3}
        >
          <GitHub sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            GitHub Projects Kanban Board
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} maxWidth={600}>
            Visualize and manage your GitHub issues in a beautiful kanban board interface.
            Connect to your repository to get started.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Settings />}
            onClick={() => setSettingsOpen(true)}
          >
            Configure Repository
          </Button>

          <SettingsDialog
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            onSave={handleSettingsSave}
            initialSettings={settings}
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <GitHub sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {settings.owner}/{settings.repo} - Kanban Board
          </Typography>
          
          <IconButton color="inherit" onClick={refetch} disabled={loading}>
            <Refresh />
          </IconButton>
          
          <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {columns.map((column) => (
              <Grid item xs={12} md={4} key={column.id}>
                <KanbanColumn
                  column={{
                    ...column,
                    issues: column.issues.map(issue => ({
                      ...issue,
                      // Wrap each issue card with drag functionality
                      renderCard: () => (
                        <DraggableIssueCard
                          key={issue.id}
                          issue={issue}
                          onClick={() => setSelectedIssue(issue)}
                          onDragStart={setDraggedIssue}
                          onDragEnd={() => setDraggedIssue(null)}
                          isDragging={draggedIssue === issue.id}
                        />
                      ),
                    })),
                  }}
                  onIssueClick={setSelectedIssue}
                  onDrop={handleDrop}
                  draggedIssue={draggedIssue}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <IssueModal
        issue={selectedIssue}
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
        initialSettings={settings}
      />
    </ThemeProvider>
  );
}

export default App;