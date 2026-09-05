import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseBrowsePage from './pages/CourseBrowsePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Student Pages
import StudentDashboard from './pages/StudentDashboard';
import CourseLearningPage from './pages/CourseLearningPage';
import QuizPage from './pages/QuizPage';
import WishlistPage from './pages/WishlistPage';
import CertificateViewPage from './pages/CertificateViewPage';
import CheckoutPage from './pages/CheckoutPage';

// Protected Instructor Pages
import InstructorDashboard from './pages/InstructorDashboard';
import CourseBuilderPage from './pages/CourseBuilderPage';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Protected Guard
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="courses" element={<CourseBrowsePage />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route path="verify-certificate/:certificateId" element={<VerifyCertificatePage />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="learning/:courseId" element={<CourseLearningPage />} />
            <Route path="quiz/:quizId" element={<QuizPage />} />
            <Route path="certificate/:courseId" element={<CertificateViewPage />} />
            <Route path="checkout/:courseId" element={<CheckoutPage />} />
          </Route>

          {/* Instructor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
            <Route path="instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="instructor/course-builder" element={<CourseBuilderPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
