import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { MatchesPage } from './pages/MatchesPage';
import { CirclesPage } from './pages/CirclesPage';
import { MentorPage } from './pages/MentorPage';
import { CataloguePage } from './pages/CataloguePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SessionsPage } from './pages/SessionsPage';
import { ProgressPage } from './pages/ProgressPage';
import { RequestsPage } from './pages/RequestsPage';
import { SafetyPage } from './pages/SafetyPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/circles" element={<CirclesPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/learning-paths" element={<LearningPathsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
