import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './css/app.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './components/LandingPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateCustomerPage from './pages/CreateCustomerPage.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import InvitationPage from './pages/InvitationPage.jsx';

createRoot(document.getElementById('app')).render(
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/invite/:token" element={<InvitationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/customers/new"
                    element={
                        <ProtectedRoute role="admin">
                            <CreateCustomerPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="customer">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>,
);
