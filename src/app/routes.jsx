import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage/HomePage';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import PublicRestrictedRoute from '../routes/PublicRestrictedRoute';
import PrivateRoute from '../routes/PrivateRoute';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const NoticesPage = lazy(() => import('../pages/NoticesPage/NoticesPage'));
const NewsPage = lazy(() => import('../pages/NewsPage/NewsPage'));
const FriendsPage = lazy(() => import('../pages/FriendsPage/FriendsPage'));
const AddPetPage = lazy(() => import('../pages/AddPetPage/AddPetPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRestrictedRoute>
                <LoginPage />
              </PublicRestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRestrictedRoute>
                <RegisterPage />
              </PublicRestrictedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route
            path="/add-pet"
            element={
              <PrivateRoute>
                <AddPetPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
