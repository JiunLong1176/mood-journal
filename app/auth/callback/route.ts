import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

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

  const type = url.searchParams.get('type');
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/auth/reset-password', request.url));
  }

  return NextResponse.redirect(new URL('/today', request.url));
}
