import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionService } from '@/domain/user/sessionService';
import { UserRepository } from '@/domain/user/repository';
import { AuthService } from '@/domain/user/AuthService';
import { initDemoSession, subscribe } from '@/domain/user/demoSession';

const AuthContext = createContext();
const PUBLIC_SETTINGS = { id: 'official-mvp', public_settings: {} };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const session = await SessionService.getSession();
      setUser(session.user);
      setAuthError(session.error);
      return session.user;
    } catch (error) {
      setAuthError({ type: 'auth_error', error });
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkAppState = async () => {
    await checkUserAuth();
    return PUBLIC_SETTINGS;
  };

  const updateUser = async (updatedUser) => {
    const officialUser = updatedUser?.id
      ? await UserRepository.update(updatedUser.id, updatedUser)
      : updatedUser;
    setUser(officialUser);
    return officialUser;
  };

  const login = async (credentials) => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const session = await AuthService.login(credentials);
      setUser(session.user);
      return session;
    } catch (error) {
      setAuthError({ type: 'auth_error', error });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoadingAuth(true);
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      setAuthError({ type: 'auth_error', error });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const navigateToLogin = () => {};

  useEffect(() => {
    const initializeSession = async () => {
      const demoUser = initDemoSession();
      setUser(demoUser);
      setIsLoadingAuth(false);
    };

    initializeSession();

    const unsubscribe = subscribe((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: Boolean(user?.id),
      authChecked: !isLoadingAuth,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: PUBLIC_SETTINGS,
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
      updateUser,
      login,
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