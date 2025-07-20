# API Reference

GitFlow Kanban integrates with the GitHub REST API v3 to provide real-time access to repository issues and project data.

## 🔐 Authentication

### Personal Access Token

GitFlow Kanban uses GitHub Personal Access Tokens for authentication.

**Required Scopes:**
- `repo` - Full control of private repositories
- `read:user` - Read user profile data (optional, for user info)

**Token Format:**
```
Authorization: token ghp_xxxxxxxxxxxxxxxxxxxx
```

### Security Notes

- Tokens are stored in browser localStorage only
- Never transmitted to third-party servers
- Automatically included in all GitHub API requests

## 🌐 GitHub API Endpoints

### Issues

#### Get Repository Issues

```http
GET /repos/{owner}/{repo}/issues
```

**Parameters:**
- `state` (string): `open`, `closed`, or `all`
- `per_page` (integer): Number of results per page (max 100)
- `page` (integer): Page number for pagination

**Response:**
```json
[
  {
    "id": 1,
    "number": 1347,
    "title": "Found a bug",
    "body": "I'm having a problem with this.",
    "state": "open",
    "user": {
      "login": "octocat",
      "avatar_url": "https://github.com/images/error/octocat_happy.gif"
    },
    "labels": [
      {
        "id": 208045946,
        "name": "bug",
        "color": "d73a4a"
      }
    ],
    "assignees": [],
    "created_at": "2011-04-22T13:33:48Z",
    "updated_at": "2011-04-22T13:33:48Z"
  }
]
```

#### Get Single Issue

```http
GET /repos/{owner}/{repo}/issues/{issue_number}
```

**Response:**
```json
{
  "id": 1,
  "number": 1347,
  "title": "Found a bug",
  "body": "I'm having a problem with this.",
  "state": "open",
  "comments": 0,
  "created_at": "2011-04-22T13:33:48Z",
  "updated_at": "2011-04-22T13:33:48Z"
}
```

#### Update Issue

```http
PATCH /repos/{owner}/{repo}/issues/{issue_number}
```

**Request Body:**
```json
{
  "title": "Found a bug",
  "body": "I'm having a problem with this.",
  "state": "closed",
  "labels": ["bug", "enhancement"]
}
```

### Projects (Future Enhancement)

#### Get Repository Projects

```http
GET /repos/{owner}/{repo}/projects
```

#### Get Project Columns

```http
GET /projects/{project_id}/columns
```

#### Get Column Cards

```http
GET /projects/columns/{column_id}/cards
```

## 🔧 API Service Implementation

### GitHubApiService Class

```typescript
class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private token: string | null = null;

  setToken(token: string): void
  getRepositoryIssues(owner: string, repo: string): Promise<GitHubIssue[]>
  getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue>
  updateIssue(owner: string, repo: string, issueNumber: number, data: any): Promise<GitHubIssue>
}
```

### Usage Example

```typescript
import { githubApi } from '../services/githubApi';

// Set authentication token
githubApi.setToken('ghp_xxxxxxxxxxxxxxxxxxxx');

// Fetch repository issues
const issues = await githubApi.getRepositoryIssues('facebook', 'react');

// Get specific issue
const issue = await githubApi.getIssue('facebook', 'react', 1347);

// Update issue
const updatedIssue = await githubApi.updateIssue('facebook', 'react', 1347, {
  state: 'closed'
});
```

## 📊 Data Models

### GitHubIssue

```typescript
interface GitHubIssue {
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
```

### GitHubUser

```typescript
interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}
```

### GitHubLabel

```typescript
interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}
```

### KanbanColumn

```typescript
interface KanbanColumn {
  id: string;
  title: string;
  issues: GitHubIssue[];
}
```

## 🔄 Data Flow

### Issue Organization Logic

Issues are automatically organized into columns based on their GitHub properties:

```typescript
const organizeIssuesIntoColumns = (issues: GitHubIssue[]): KanbanColumn[] => {
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
};
```

### Column Assignment Rules

| Column | Criteria |
|--------|----------|
| **To Do** | Open issues with no assignees and no "progress" labels |
| **In Progress** | Open issues with assignees OR "progress" labels |
| **Done** | Closed issues |

## ⚠️ Error Handling

### API Error Types

```typescript
interface ApiError {
  status: number;
  message: string;
  documentation_url?: string;
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | Check token validity and scopes |
| 403 | Forbidden | Verify repository access permissions |
| 404 | Not Found | Confirm repository exists and is accessible |
| 422 | Validation Failed | Check request parameters |
| 500 | Server Error | Retry request, check GitHub status |

### Error Handling Implementation

```typescript
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

## 🚀 Rate Limiting

### GitHub API Limits

- **Authenticated requests**: 5,000 per hour
- **Search API**: 30 requests per minute
- **Abuse detection**: Temporary blocks for rapid requests

### Best Practices

1. **Cache responses** locally when possible
2. **Implement exponential backoff** for retries
3. **Use conditional requests** with ETags
4. **Monitor rate limit headers**:
   - `X-RateLimit-Limit`
   - `X-RateLimit-Remaining`
   - `X-RateLimit-Reset`

### Rate Limit Handling

```typescript
const checkRateLimit = (response: Response) => {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn(`Rate limit low: ${remaining} requests remaining`);
  }
};
```

## 🔮 Future API Enhancements

### Planned Features

1. **GitHub Projects v2 API** integration
2. **Real-time updates** via webhooks
3. **Bulk operations** for multiple issues
4. **Advanced filtering** and search
5. **Issue templates** support
6. **Milestone management**

### GraphQL Migration

Consider migrating to GitHub's GraphQL API v4 for:
- More efficient data fetching
- Reduced API calls
- Better type safety
- Real-time subscriptions