// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useUser } from './context/UserContext';
import CreateScheduleMeet from './components/interviewer/CreateScheduleMeet';

// Lazy loading components for performance optimization
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const DashboardCandidate = lazy(() => import('./components/candidate/DashboardCandidate'));
const DashboardCompany = lazy(() => import('./components/company/DashboardCompany'));
const DashboardInterviewer = lazy(() => import('./components/interviewer/DashboardInterviewer'));
const Home = lazy(() => import('./components/Home'));
const RoomPage = lazy(() => import('./components/RoomPage'));
const Profile = lazy(() => import('./components/Profile'));
const Report = lazy(()=>import('./components/Report'))
// const NotFound = lazy(() => import('./components/NotFound')); // Create a NotFound.tsx

const DashboardRouter: React.FC = () => {
    const { user } = useUser();
    
    switch (user?.role) {
        case 'candidate':
            return <DashboardCandidate />;
        case 'company':
            return <DashboardCompany />;
        case 'interviewer':
            return <DashboardInterviewer />;
        default:
            return <Navigate to="/login" replace />;
    }
};

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Protected routes */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardRouter />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/room/:roomId"
                                    element={
                                        <ProtectedRoute>
                                            <RoomPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/createschedulemeet"
                                    element={
                                        <ProtectedRoute>
                                            <CreateScheduleMeet />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/report"
                                    element={
                                        <ProtectedRoute>
                                            <Report />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
