import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Comment,
  Person,
  Schedule,
  BugReport,
  Star,
  Label,
} from '@mui/icons-material';
import { GitHubIssue } from '../types/github';

interface IssueCardProps {
  issue: GitHubIssue;
  onClick: () => void;
  isDragging?: boolean;
}

export function IssueCard({ issue, onClick, isDragging }: IssueCardProps) {
  const getIssueTypeIcon = () => {
    const hasEnhancementLabel = issue.labels.some(label => 
      label.name.toLowerCase().includes('enhancement') || 
      label.name.toLowerCase().includes('feature')
    );
    
    const hasBugLabel = issue.labels.some(label => 
      label.name.toLowerCase().includes('bug') || 
      label.name.toLowerCase().includes('fix')
    );

    if (hasEnhancementLabel) return <Enhancement fontSize="small" />;
    if (hasEnhancementLabel) return <Star fontSize="small" />;
    if (hasBugLabel) return <BugReport fontSize="small" />;
    return <Label fontSize="small" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        border: issue.state === 'closed' ? '2px solid #4caf50' : undefined,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
          {getIssueTypeIcon()}
          <Typography variant="body2" color="text.secondary">
            #{issue.number}
          </Typography>
        </Box>

        <Typography variant="subtitle2" component="h3" mb={1} lineHeight={1.3}>
          {issue.title}
        </Typography>

        {issue.body && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {issue.body}
          </Typography>
        )}

        {issue.labels.length > 0 && (
          <Box mb={2}>
            {issue.labels.slice(0, 3).map((label) => (
              <Chip
                key={label.id}
                label={label.name}
                size="small"
                sx={{
                  backgroundColor: `#${label.color}`,
                  color: parseInt(label.color, 16) > 0xffffff / 2 ? '#000' : '#fff',
                  mr: 0.5,
                  mb: 0.5,
                  fontSize: '0.7rem',
                }}
              />
            ))}
            {issue.labels.length > 3 && (
              <Chip
                label={`+${issue.labels.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            {issue.assignees.length > 0 && (
              <Tooltip title={issue.assignees.map(a => a.login).join(', ')}>
                <Box display="flex">
                  {issue.assignees.slice(0, 2).map((assignee) => (
                    <Avatar
                      key={assignee.id}
                      src={assignee.avatar_url}
                      sx={{ width: 24, height: 24, mr: -0.5 }}
                    />
                  ))}
                  {issue.assignees.length > 2 && (
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                      +{issue.assignees.length - 2}
                    </Avatar>
                  )}
                </Box>
              </Tooltip>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {issue.comments > 0 && (
              <Box display="flex" alignItems="center">
                <Comment fontSize="small" color="action" />
                <Typography variant="caption" ml={0.5}>
                  {issue.comments}
                </Typography>
              </Box>
            )}
            
            <Tooltip title={`Created: ${formatDate(issue.created_at)}`}>
              <Schedule fontSize="small" color="action" />
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}