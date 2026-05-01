import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UserProvider } from '@/components/providers/UserProvider';
import AppShell from '@/components/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme="cream">
      <UserProvider>
        <AppShell>{children}</AppShell>
      </UserProvider>
    </ThemeProvider>
  );
}
