import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UserProvider } from '@/components/providers/UserProvider';
import AppShell from '@/components/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return (
    <ThemeProvider initialTheme="cream">
      <UserProvider initialUser={{ email: session.user.email!, createdAt: session.user.created_at }}>
        <AppShell>{children}</AppShell>
      </UserProvider>
    </ThemeProvider>
  );
}
