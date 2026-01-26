import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { LoginScreen } from '@/app/components/auth/LoginScreen';
import { RegisterScreen } from '@/app/components/auth/RegisterScreen';
import { ForgotPasswordScreen } from '@/app/components/auth/ForgotPasswordScreen';
import { PatientDashboard } from '@/app/components/patient/PatientDashboard';
import { UploadScreen } from '@/app/components/patient/UploadScreen';
import { TestResultsScreen } from '@/app/components/patient/TestResultsScreen';
import { MyTestsScreen } from '@/app/components/patient/MyTestsScreen';
import { ProfileScreen } from '@/app/components/patient/ProfileScreen';
import { DoctorDashboard } from '@/app/components/doctor/DoctorDashboard';
import { CaseAnalysisScreen } from '@/app/components/doctor/CaseAnalysisScreen';

type AuthView = 'login' | 'register' | 'forgot-password';
type PatientView = 'dashboard' | 'upload' | 'results' | 'my-tests' | 'profile';
type DoctorView = 'dashboard' | 'case-analysis';

function AppContent() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [patientView, setPatientView] = useState<PatientView>('dashboard');
  const [doctorView, setDoctorView] = useState<DoctorView>('dashboard');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Authentication screens
  if (!user) {
    switch (authView) {
      case 'login':
        return (
          <LoginScreen
            onForgotPassword={() => setAuthView('forgot-password')}
            onRegister={() => setAuthView('register')}
          />
        );
      case 'register':
        return <RegisterScreen onBack={() => setAuthView('login')} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onBack={() => setAuthView('login')} />;
    }
  }

  // Patient views
  if (user.role === 'patient') {
    switch (patientView) {
      case 'dashboard':
        return (
          <PatientDashboard
            onViewResults={(testId) => {
              setSelectedTestId(testId);
              setPatientView('results');
            }}
            onUploadNew={() => setPatientView('upload')}
            onNavigate={(view) => setPatientView(view as PatientView)}
          />
        );
      case 'upload':
        return (
          <UploadScreen 
            onBack={() => setPatientView('dashboard')}
            onNavigate={(view) => setPatientView(view as PatientView)}
          />
        );
      case 'results':
        return (
          <TestResultsScreen
            testId={selectedTestId}
            onBack={() => setPatientView('dashboard')}
            onNavigate={(view) => setPatientView(view as PatientView)}
          />
        );
      case 'my-tests':
        return (
          <MyTestsScreen
            onViewResults={(testId) => {
              setSelectedTestId(testId);
              setPatientView('results');
            }}
            onNavigate={(view) => setPatientView(view as PatientView)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={(view) => setPatientView(view as PatientView)}
          />
        );
    }
  }

  // Doctor views
  if (user.role === 'doctor') {
    switch (doctorView) {
      case 'dashboard':
        return (
          <DoctorDashboard
            onReviewCase={(caseId) => {
              setSelectedCaseId(caseId);
              setDoctorView('case-analysis');
            }}
          />
        );
      case 'case-analysis':
        return (
          <CaseAnalysisScreen
            caseId={selectedCaseId}
            onBack={() => setDoctorView('dashboard')}
          />
        );
    }
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}