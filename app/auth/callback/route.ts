import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/today';

  if (code) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    // Create preferences row on first login
    if (user) {
      await supabase
        .from('preferences')
        .upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
