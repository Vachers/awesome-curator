import { db } from '@/db';
import { repos } from '@/db/schema';
import { eq } from 'drizzle-orm';

const GH_TOKEN = process.env.GH_TOKEN;
const GH_USER = process.env.GH_USER;

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, {
    headers: {
      'Authorization': `Bearer ${GH_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function syncReposToDatabase() {
  const githubRepos = await fetchUserRepos();

  const syncedRepos = [];

  for (const repo of githubRepos) {
    const existingRepo = await db.query.repos.findFirst({
      where: eq(repos.githubId, repo.id),
    });

    if (existingRepo) {
      // Update existing
      await db.update(repos)
        .set({
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          topics: repo.topics,
          isPrivate: repo.private,
          isFork: repo.fork,
          syncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(repos.githubId, repo.id));

      syncedRepos.push({ ...existingRepo, ...repo });
    } else {
      // Insert new
      const [newRepo] = await db.insert(repos)
        .values({
          githubId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          topics: repo.topics,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPrivate: repo.private,
          isFork: repo.fork,
        })
        .returning();

      syncedRepos.push(newRepo);
    }
  }

  return syncedRepos;
}
