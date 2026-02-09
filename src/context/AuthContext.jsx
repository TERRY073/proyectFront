import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'sura_auth';

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(() => readStoredAuth());

  const setAuth = (nextAuth) => {
    setAuthState(nextAuth);
    if (nextAuth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const logout = useCallback(() => setAuth(null), [setAuth]);

  const value = useMemo(() => ({ auth, setAuth, logout }), [auth, logout, setAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export { AUTH_STORAGE_KEY };
