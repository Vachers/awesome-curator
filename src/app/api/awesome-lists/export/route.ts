import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repos, categories } from '@/db/schema';
import { desc, eq, isNotNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Get repos with categories
    const reposWithCategories = await db.query.repos.findMany({
      where: isNotNull(repos.categoryId),
      orderBy: [desc(repos.stars)],
      with: {
        category: true,
      },
    });

    // Group by category
    const grouped: Record<string, typeof reposWithCategories> = {};

    for (const repo of reposWithCategories) {
      const catName = repo.category?.name || 'Uncategorized';
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(repo);
    }

    // Generate markdown
    let markdown = `# Awesome Repositories\n\n`;
    markdown += `> A curated list of my GitHub repositories\n\n`;
    markdown += `**Total Repos:** ${reposWithCategories.length}\n\n`;
    markdown += `---\n\n`;

    for (const [category, categoryRepos] of Object.entries(grouped)) {
      const emoji = categoryRepos[0]?.category?.emoji || '📁';
      markdown += `## ${emoji} ${category}\n\n`;

      for (const repo of categoryRepos) {
        const stars = repo.stars ? ` ⭐ ${repo.stars}` : '';
        const language = repo.language ? ` \`${repo.language}\`` : '';
        markdown += `- [${repo.name}](${repo.url}) - ${repo.description || 'No description'}${stars}${language}\n`;
      }

      markdown += `\n`;
    }

    return NextResponse.json({ markdown });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export' },
      { status: 500 }
    );
  }
}
