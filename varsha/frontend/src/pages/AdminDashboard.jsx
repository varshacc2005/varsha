import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AdminHome = lazy(() => import('./admin/AdminHome'));
const AdminStudents = lazy(() => import('./admin/AdminStudents'));
const AdminAddCounselor = lazy(() => import('./admin/AdminAddCounselor'));

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const AdminDashboard = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<AdminHome />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="add-counselor" element={<AdminAddCounselor />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AdminDashboard;
