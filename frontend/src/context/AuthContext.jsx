import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  isSignedIn: false,
  isLoaded: false,
  login: () => { throw new Error('AuthProvider not mounted'); },
  signup: () => { throw new Error('AuthProvider not mounted'); },
  googleLogin: () => { throw new Error('AuthProvider not mounted'); },
  updateUser: () => { throw new Error('AuthProvider not mounted'); },
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cineflow_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (_) {}
    setIsLoaded(true);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.success) {
      const { token, user: userData } = response.data;
      localStorage.setItem('cineflow_token', token);
      localStorage.setItem('cineflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const signup = async ({ firstName, lastName, email, password }) => {
    const response = await api.post('/users/register', { firstName, lastName, email, password });
    if (response.data.success) {
      const { token, user: userData } = response.data;
      localStorage.setItem('cineflow_token', token);
      localStorage.setItem('cineflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  };

  const googleLogin = async (profile) => {
    const response = await api.post('/users/google', {
      email: profile.email,
      given_name: profile.given_name || profile.name,
      family_name: profile.family_name || '',
      picture: profile.picture,
      sub: profile.sub,
    });
    if (response.data.success) {
      const { token, user: userData } = response.data;
      localStorage.setItem('cineflow_token', token);
      localStorage.setItem('cineflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } else {
      throw new Error(response.data.message || 'Google Login failed');
    }
  };

  const updateUser = async (updates) => {
    const response = await api.put('/users/me', updates);
    if (response.data.success) {
      const userData = response.data.data;
      localStorage.setItem('cineflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } else {
      throw new Error(response.data.message || 'Failed to update profile');
    }
  };

  const logout = () => {
    localStorage.removeItem('cineflow_token');
    localStorage.removeItem('cineflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, isLoaded, login, signup, googleLogin, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
