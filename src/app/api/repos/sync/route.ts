import { NextResponse } from 'next/server';
import { syncReposToDatabase } from '@/lib/github';

export async function POST() {
  try {
    const repos = await syncReposToDatabase();
    return NextResponse.json({ success: true, count: repos.length, repos });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync repos' },
      { status: 500 }
    );
  }
}
