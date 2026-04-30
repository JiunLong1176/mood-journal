'use client';
import { createContext, useContext } from 'react';

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

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: { email: string; createdAt: string };
  children: React.ReactNode;
}) {
  const username = initialUser.email.split('@')[0];
  const avatarLetter = username[0]?.toUpperCase() ?? '?';

  return (
    <UserContext.Provider value={{ email: initialUser.email, username, avatarLetter, createdAt: initialUser.createdAt }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
