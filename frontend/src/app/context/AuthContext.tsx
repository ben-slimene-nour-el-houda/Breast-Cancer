import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  id: string;
  patientId?: string;
  licenseNumber?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'patient' | 'doctor') => void;
  logout: () => void;
  register: (data: any, role: 'patient' | 'doctor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: 'patient' | 'doctor') => {
    // Mock authentication
    if (role === 'patient') {
      setUser({
        name: 'Sarah Johnson',
        email,
        role: 'patient',
        id: 'P12345',
        patientId: 'MRN-2024-001',
      });
    } else {
      setUser({
        name: 'Dr. Michael Chen',
        email,
        role: 'doctor',
        id: 'D67890',
        licenseNumber: 'MD-2024-789',
        specialization: 'Oncology',
      });
    }
  };

  const register = (data: any, role: 'patient' | 'doctor') => {
    // Mock registration
    if (role === 'patient') {
      setUser({
        name: data.name,
        email: data.email,
        role: 'patient',
        id: `P${Math.floor(Math.random() * 100000)}`,
        patientId: `MRN-2024-${Math.floor(Math.random() * 1000)}`,
      });
    } else {
      setUser({
        name: data.name,
        email: data.email,
        role: 'doctor',
        id: `D${Math.floor(Math.random() * 100000)}`,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
