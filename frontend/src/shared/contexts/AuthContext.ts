import React, { createContext, useContext } from 'react';

export interface AuthUser {
  id: string | number;
  email: string;
  role?: string;
  permissions: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  hasPermission: () => false,
});

export const AuthProvider: React.FC<{ value?: Partial<AuthContextValue> }> = ({ value, children }) => {
  const defaultValue: AuthContextValue = {
    user: value?.user ?? null,
    hasPermission: (perm: string) => (value?.user?.permissions ?? []).includes(perm),
  };
  return <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
