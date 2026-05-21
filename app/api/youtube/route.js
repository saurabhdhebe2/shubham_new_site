import { NextResponse } from 'next/server';
import { getVideosByCategory } from '@/lib/youtube';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const videos = await getVideosByCategory(category);
  return NextResponse.json(videos);
}
