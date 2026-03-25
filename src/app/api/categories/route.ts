import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { getDefaultCategories } from '@/lib/categorizer';

export async function GET() {
  try {
    const allCategories = await db.query.categories.findMany();
    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Insert default categories
    const defaultCategories = getDefaultCategories();

    const inserted = await db.insert(categories)
      .values(defaultCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        emoji: c.emoji,
        color: c.color,
      })))
      .returning();

    return NextResponse.json({ success: true, categories: inserted });
  } catch (error) {
    console.error('Insert error:', error);
    return NextResponse.json(
      { error: 'Failed to create categories' },
      { status: 500 }
    );
  }
}
