import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { categoryId } = await request.json();
    const repoId = parseInt(params.id);

    const [updated] = await db.update(repos)
      .set({ categoryId: categoryId || null, updatedAt: new Date() })
      .where(eq(repos.id, repoId))
      .returning();

    return NextResponse.json({ success: true, repo: updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update repo' },
      { status: 500 }
    );
  }
}
