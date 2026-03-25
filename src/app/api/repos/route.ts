import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repos, categories } from '@/db/schema';
import { desc, isNull } from 'drizzle-orm';

export async function GET() {
  try {
    const allRepos = await db.query.repos.findMany({
      orderBy: [desc(repos.stars)],
      with: {
        category: true,
      },
    });

    // Stats
    const stats = {
      total: allRepos.length,
      uncategorized: allRepos.filter(r => !r.categoryId).length,
      languages: [...new Set(allRepos.map(r => r.language).filter(Boolean))],
      totalStars: allRepos.reduce((sum, r) => sum + (r.stars || 0), 0),
    };

    return NextResponse.json({ repos: allRepos, stats });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repos' },
      { status: 500 }
    );
  }
}
