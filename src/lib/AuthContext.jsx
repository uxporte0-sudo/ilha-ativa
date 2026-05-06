import React, { createContext, useContext, useState } from 'react';
import { db } from '@/api/Client';
import { getCurrentUser } from '@/lib/pseudoDb';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());

  const checkUserAuth = async () => {
    const currentUser = await db.auth.me();
    setUser(currentUser);
    return currentUser;
  };

  const checkAppState = async () => {
    const currentUser = await db.auth.me();
    setUser(currentUser);
    return { id: 'local-ui', public_settings: {} };
  };

  const updateUser = (updatedUser) => setUser(updatedUser);
  const logout = () => checkUserAuth();
  const navigateToLogin = () => {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: true,
      authChecked: true,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: { id: 'local-ui', public_settings: {} },
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
