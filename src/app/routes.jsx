import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import NoticesPage from '../pages/NoticesPage/NoticesPage';
import NewsPage from '../pages/NewsPage/NewsPage';
import FriendsPage from '../pages/FriendsPage/FriendsPage';
import AddPetPage from '../pages/AddPetPage/AddPetPage';
import MainLayout from '../components/layout/MainLayout/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/add-pet" element={<AddPetPage />} />
      </Route>
    </Routes>
  );
}