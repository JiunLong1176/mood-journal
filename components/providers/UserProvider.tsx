'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

interface UserContextValue {
  email: string;
  username: string;
  avatarLetter: string;
  createdAt: string;
}

const UserContext = createContext<UserContextValue>({
  email: '',
  username: '',
  avatarLetter: '?',
  createdAt: '',
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserContextValue>({ email: '', username: '', avatarLetter: '?', createdAt: '' });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
        return;
      }
      const email = session.user.email ?? '';
      const username = email.split('@')[0];
      setUser({ email, username, avatarLetter: username[0]?.toUpperCase() ?? '?', createdAt: session.user.created_at });
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
