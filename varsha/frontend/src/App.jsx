import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Placeholders for dashboards
const NotFound = () => <div className="text-center mt-20 text-2xl">404 - Page Not Found</div>;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-indigo-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Or unauthorized page
  }

  return children ? children : <Outlet />;
};

const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        {/* Student Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard/*" element={<StudentDashboard />} />
          <Route path="/find-counselors" element={<StudentDashboard defaultTab="find-counselors" />} />
          <Route path="/my-bookings" element={<StudentDashboard defaultTab="my-bookings" />} />
        </Route>

        {/* Counselor Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/counselor/*" element={<CounselorDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );

}

export default App;
