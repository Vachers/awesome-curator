import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repos } from '@/db/schema';
import { eq } from 'drizzle-orm';

const GH_TOKEN = process.env.Gh_token;
const GH_USER = process.env.gh_user;

interface GitHubRepo {
  id: number;
  name: string;
      fullName: string;
      description: string | null;
      url: string;
      language: string | null;
      topics: string[];
      stars: number | null;
      forks: number | null;
      isPrivate: boolean;
      isFork: boolean;
      categoryId: number | null;
      category: Category | null;
      createdAt: Date;
      updatedAt: Date;
      syncedAt: Date;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; }; }
) => Promise<void | Response> {
  const { categoryId } = request.json();

  const repoId = parseInt(params.id);

  const [updated] = await db.update(repos)
        .set({ categoryId: categoryId || null, updatedAt: new Date() })
        .where(eq(repos.githubId, repo.githubId));

  return NextResponse.json({ success: true, repo: updated });
}