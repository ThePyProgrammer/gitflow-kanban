import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: { owner: string; repo: string; token: string }) => void;
  initialSettings: { owner: string; repo: string; token: string };
}

export function SettingsDialog({ open, onClose, onSave, initialSettings }: SettingsDialogProps) {
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const isValid = settings.owner && settings.repo && settings.token;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>GitHub Repository Settings</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Alert severity="info" sx={{ mb: 3 }}>
            To use this application, you need a GitHub personal access token with repository access.
            You can create one in GitHub Settings → Developer settings → Personal access tokens.
          </Alert>

          <TextField
            fullWidth
            label="Repository Owner"
            placeholder="e.g., facebook"
            value={settings.owner}
            onChange={(e) => setSettings({ ...settings, owner: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Repository Name"
            placeholder="e.g., react"
            value={settings.repo}
            onChange={(e) => setSettings({ ...settings, repo: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="GitHub Personal Access Token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={settings.token}
            onChange={(e) => setSettings({ ...settings, token: e.target.value })}
            margin="normal"
            helperText="Required permissions: repo (Full control of private repositories)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid}>
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}