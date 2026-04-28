import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const localUser = {
  id: 'local-ui-user',
  full_name: 'Usuario Local',
  email: 'local@example.com',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localUser);

  const checkUserAuth = async () => {
    setUser(localUser);
    return localUser;
  };

  const checkAppState = async () => {
    setUser(localUser);
    return { id: 'local-ui', public_settings: {} };
  };

  const logout = () => setUser(localUser);
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
