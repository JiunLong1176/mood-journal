import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UserProvider } from '@/components/providers/UserProvider';
import AppShell from '@/components/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('preferences')
    .upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });

  return (
    <ThemeProvider initialTheme="cream">
      <UserProvider initialUser={{ email: user.email!, createdAt: user.created_at }}>
        <AppShell>{children}</AppShell>
      </UserProvider>
    </ThemeProvider>
  );
}
