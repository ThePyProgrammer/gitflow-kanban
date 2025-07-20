import React, { useEffect, useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { IssueCard } from './IssueCard';
import { GitHubIssue } from '../types/github';

interface DraggableIssueCardProps {
  issue: GitHubIssue;
  onClick: () => void;
  onDragStart: (issueId: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function DraggableIssueCard({
  issue,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: DraggableIssueCardProps) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref}>
      <IssueCard
        issue={issue}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
}