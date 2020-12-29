import React, { createContext, useCallback, useState } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  mappedUser: any;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData{
  user: any;
  signIn(credentials: SignInCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState >(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, mappedUser: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email, password,
    });

    const { token, mappedUser } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(mappedUser));

    setData({ token, mappedUser });
  }, []);
  return (
    <AuthContext.Provider value={{ user: data.mappedUser, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
