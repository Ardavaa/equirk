import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AUTH_CONFIG } from '../config/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal().toString());
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;
    
    try {
      setIsLoading(true);
      
      await authClient.login({
        identityProvider: AUTH_CONFIG.getIdentityProvider(),
        maxTimeToLive: AUTH_CONFIG.MAX_TIME_TO_LIVE,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setPrincipal(identity.getPrincipal().toString());
          setIsAuthenticated(true);
        },
        onError: (error) => {
          console.error('Login error:', error);
        },
      });
    } catch (error) {
      console.error('Login process error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;
    
    try {
      setIsLoading(true);
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    identity,
    principal,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 