import { NextRequest, NextResponse } from 'next/server';
import { getAiReply } from '@/lib/ai';
import type { MoodKey } from '@/lib/moods';

export async function POST(req: NextRequest) {
  const { text, mood, tone, language } = await req.json();
  if (!text || !mood) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const reply = await getAiReply(text, mood as MoodKey, tone ?? 'friend', language ?? 'en');
  return NextResponse.json({ reply });
}
