import React, { useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { IssueCard } from './IssueCard';
import { KanbanColumn as KanbanColumnType, GitHubIssue } from '../types/github';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onIssueClick: (issue: GitHubIssue) => void;
  onDrop: (issueId: number, columnId: string) => void;
  draggedIssue: number | null;
}

export function KanbanColumn({ column, onIssueClick, onDrop, draggedIssue }: KanbanColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = React.useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const issueId = Number(source.data.issueId);
        if (issueId) {
          onDrop(issueId, column.id);
        }
      },
    });
  }, [column.id, onDrop]);

  const getColumnColor = () => {
    switch (column.id) {
      case 'todo':
        return '#f5f5f5';
      case 'in-progress':
        return '#e3f2fd';
      case 'done':
        return '#e8f5e8';
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Paper
      ref={ref}
      sx={{
        p: 2,
        minHeight: 600,
        backgroundColor: isDraggedOver ? '#e1f5fe' : getColumnColor(),
        border: isDraggedOver ? '2px dashed #2196f3' : '2px solid transparent',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box mb={2}>
        <Badge badgeContent={column.issues.length} color="primary">
          <Typography variant="h6" component="h2" fontWeight="bold">
            {column.title}
          </Typography>
        </Badge>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {column.issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => onIssueClick(issue)}
            isDragging={draggedIssue === issue.id}
          />
        ))}
        
        {column.issues.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            No issues in this column
          </Box>
        )}
      </Box>
    </Paper>
  );
}