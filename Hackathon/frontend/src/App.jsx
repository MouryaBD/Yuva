import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import SubcategorySelection from './pages/SubcategorySelection';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import WellnessCheck from './pages/WellnessCheck';
import Certification from './pages/Certification';
import Networking from './pages/Networking';
import AdvisorDashboard from './pages/AdvisorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subcategory-selection"
              element={
                <ProtectedRoute>
                  <SubcategorySelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wellness-check"
              element={
                <ProtectedRoute>
                  <WellnessCheck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certification"
              element={
                <ProtectedRoute>
                  <Certification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/networking"
              element={
                <ProtectedRoute>
                  <Networking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor"
              element={
                <ProtectedRoute>
                  <AdvisorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
