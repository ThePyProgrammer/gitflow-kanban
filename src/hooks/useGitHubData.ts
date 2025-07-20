import { useState, useEffect, useCallback } from 'react';
import { githubApi } from '../services/githubApi';
import { GitHubIssue, KanbanColumn } from '../types/github';

export function useGitHubData(owner: string, repo: string, token: string) {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const organizeIssuesIntoColumns = useCallback((issues: GitHubIssue[]): KanbanColumn[] => {
    const todoIssues = issues.filter(issue => 
      issue.state === 'open' && 
      !issue.assignees.length && 
      !issue.labels.some(label => label.name.toLowerCase().includes('progress'))
    );

    const inProgressIssues = issues.filter(issue => 
      issue.state === 'open' && 
      (issue.assignees.length > 0 || issue.labels.some(label => label.name.toLowerCase().includes('progress')))
    );

    const doneIssues = issues.filter(issue => issue.state === 'closed');

    return [
      { id: 'todo', title: 'To Do', issues: todoIssues },
      { id: 'in-progress', title: 'In Progress', issues: inProgressIssues },
      { id: 'done', title: 'Done', issues: doneIssues },
    ];
  }, []);

  const fetchData = useCallback(async () => {
    if (!token || !owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      githubApi.setToken(token);
      const fetchedIssues = await githubApi.getRepositoryIssues(owner, repo);
      setIssues(fetchedIssues);
      setColumns(organizeIssuesIntoColumns(fetchedIssues));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [owner, repo, token, organizeIssuesIntoColumns]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const moveIssue = useCallback((issueId: number, fromColumnId: string, toColumnId: string) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Find the issue and remove from source column
      let movedIssue: GitHubIssue | null = null;
      const fromColumn = newColumns.find(col => col.id === fromColumnId);
      if (fromColumn) {
        const issueIndex = fromColumn.issues.findIndex(issue => issue.id === issueId);
        if (issueIndex !== -1) {
          movedIssue = fromColumn.issues.splice(issueIndex, 1)[0];
        }
      }

      // Add to destination column
      if (movedIssue) {
        const toColumn = newColumns.find(col => col.id === toColumnId);
        if (toColumn) {
          toColumn.issues.push(movedIssue);
        }
      }

      return newColumns;
    });
  }, []);

  return {
    issues,
    columns,
    loading,
    error,
    refetch: fetchData,
    moveIssue,
  };
}