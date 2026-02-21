import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface Student {
  _id: string;
  email: string;
  name: string;
  branch: string | null;
  role: string;
  token?: string;
}

interface AuthContextType {
  student: Student | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateBranchSelection: (branch: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const studentData = localStorage.getItem('gate_club_student');
      if (!studentData) {
        setLoading(false);
        return;
      }

      const { token } = JSON.parse(studentData);
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/users/me');
      if (response.success) {
        setStudent({ ...response.data, token });
      } else {
        localStorage.removeItem('gate_club_student');
        setStudent(null);
      }
    } catch (error) {
      localStorage.removeItem('gate_club_student');
      setStudent(null);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.success) {
        const studentData = { ...response.data.user, token: response.data.token };
        localStorage.setItem('gate_club_student', JSON.stringify(studentData));
        setStudent(studentData);
        return { error: null };
      } else {
        return { error: response.message || 'Invalid email or password' };
      }
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name: email.split('@')[0], // Default name
        branch: 'CE' // Default branch for first time
      });

      if (response.success) {
        const studentData = { ...response.data.user, token: response.data.token };
        localStorage.setItem('gate_club_student', JSON.stringify(studentData));
        setStudent(studentData);
        return { error: null };
      } else {
        return { error: response.message || 'Registration failed' };
      }
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const updateBranchSelection = async (branch: string) => {
    try {
      if (!student) {
        return { error: 'Not authenticated' };
      }

      const response = await api.put('/users/update-profile', { branch });

      if (response.success) {
        const updatedStudent = { ...student, branch: response.data.branch };
        setStudent(updatedStudent);
        localStorage.setItem('gate_club_student', JSON.stringify(updatedStudent));
        return { error: null };
      } else {
        return { error: response.message || 'Update failed' };
      }
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('gate_club_student');
    setStudent(null);
  };

  const value = {
    student,
    loading,
    signIn,
    signUp,
    signOut,
    updateBranchSelection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
