class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.token) {
      throw new Error('GitHub token not set');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositoryIssues(owner: string, repo: string): Promise<any[]> {
    return this.request(`/repos/${owner}/${repo}/issues?state=all&per_page=100`);
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<any> {
    return this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  async updateIssue(owner: string, repo: string, issueNumber: number, data: any): Promise<any> {
    return this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getProjects(owner: string, repo: string): Promise<any[]> {
    return this.request(`/repos/${owner}/${repo}/projects`);
  }

  async getProjectColumns(projectId: number): Promise<any[]> {
    return this.request(`/projects/${projectId}/columns`);
  }

  async getColumnCards(columnId: number): Promise<any[]> {
    return this.request(`/projects/columns/${columnId}/cards`);
  }

  async moveCard(cardId: number, position: string, columnId?: number): Promise<any> {
    const body: any = { position };
    if (columnId) {
      body.column_id = columnId;
    }

    return this.request(`/projects/columns/cards/${cardId}/moves`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const githubApi = new GitHubApiService();