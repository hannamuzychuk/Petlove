import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Logo from './components/ui/Logo/Logo';

export default function App() {
    return (
        <BrowserRouter>
      <header style={{ padding: '20px' }}>
        <Logo />
      </header>

            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </BrowserRouter>

    );
}