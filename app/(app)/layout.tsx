import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UserProvider } from '@/components/providers/UserProvider';
import { EntriesProvider } from '@/components/providers/EntriesProvider';
import AppShell from '@/components/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme="cream">
      <UserProvider>
        <EntriesProvider>
          <AppShell>{children}</AppShell>
        </EntriesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
