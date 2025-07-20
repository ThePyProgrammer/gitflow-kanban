export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubMilestone {
  id: number;
  title: string;
  description?: string;
  state: 'open' | 'closed';
  due_on?: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  user: GitHubUser;
  assignees: GitHubUser[];
  labels: GitHubLabel[];
  milestone?: GitHubMilestone;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  html_url: string;
  comments: number;
  reactions: {
    '+1': number;
    '-1': number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
}

export interface GitHubProject {
  id: number;
  name: string;
  body?: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface GitHubProjectColumn {
  id: number;
  name: string;
  project_url: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubProjectCard {
  id: number;
  content_url?: string;
  note?: string;
  created_at: string;
  updated_at: string;
  column_url: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  issues: GitHubIssue[];
}

export interface CustomComment {
  id: string;
  issueId: number;
  content: string;
  author: string;
  timestamp: string;
}