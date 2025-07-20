import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  TextField,
  Paper,
  Divider,
  IconButton,
  Link,
} from '@mui/material';
import {
  Close,
  OpenInNew,
  Person,
  Schedule,
  Comment,
  Send,
} from '@mui/icons-material';
import { GitHubIssue, CustomComment } from '../types/github';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface IssueModalProps {
  issue: GitHubIssue | null;
  open: boolean;
  onClose: () => void;
}

export function IssueModal({ issue, open, onClose }: IssueModalProps) {
  const [comments, setComments] = useLocalStorage<CustomComment[]>('kanban-comments', []);
  const [newComment, setNewComment] = useState('');

  if (!issue) return null;

  const issueComments = comments.filter(comment => comment.issueId === issue.id);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = () => {
    return issue.state === 'open' ? 'success' : 'default';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="div">
              {issue.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography variant="body2" color="text.secondary">
                #{issue.number}
              </Typography>
              <Chip
                label={issue.state}
                color={getStatusColor()}
                size="small"
              />
              <Link
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <OpenInNew fontSize="small" />
              </Link>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {issue.body || 'No description provided.'}
          </Typography>
        </Box>

        <Box display="flex" gap={3} mb={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Author
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={issue.user.avatar_url} sx={{ width: 24, height: 24 }} />
              <Typography variant="body2">{issue.user.login}</Typography>
            </Box>
          </Box>

          {issue.assignees.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Assignees
              </Typography>
              <Box display="flex" gap={1}>
                {issue.assignees.map((assignee) => (
                  <Box key={assignee.id} display="flex" alignItems="center" gap={1}>
                    <Avatar src={assignee.avatar_url} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2">{assignee.login}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Dates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {formatDate(issue.created_at)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Updated: {formatDate(issue.updated_at)}
          </Typography>
          {issue.closed_at && (
            <Typography variant="body2" color="text.secondary">
              Closed: {formatDate(issue.closed_at)}
            </Typography>
          )}
        </Box>

        {issue.labels.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Labels
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {issue.labels.map((label) => (
                <Chip
                  key={label.id}
                  label={label.name}
                  size="small"
                  sx={{
                    backgroundColor: `#${label.color}`,
                    color: parseInt(label.color, 16) > 0xffffff / 2 ? '#000' : '#fff',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {issue.milestone && (
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Milestone
            </Typography>
            <Typography variant="body2">{issue.milestone.title}</Typography>
            {issue.milestone.due_on && (
              <Typography variant="body2" color="text.secondary">
                Due: {formatDate(issue.milestone.due_on)}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Comments ({issue.comments + issueComments.length})
        </Typography>

        {issueComments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2">{comment.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(comment.timestamp)}
              </Typography>
            </Box>
            <Typography variant="body2">{comment.content}</Typography>
          </Paper>
        ))}

        <Box mt={2}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  color="primary"
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}