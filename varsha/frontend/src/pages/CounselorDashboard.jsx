import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const CounselorHome = lazy(() => import('./counselor/CounselorHome'));
const CounselorBookings = lazy(() => import('./counselor/CounselorBookings'));
const CounselorAvailability = lazy(() => import('./counselor/CounselorAvailability'));
const CounselorProfile = lazy(() => import('./counselor/CounselorProfile'));

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
);

const CounselorDashboard = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<CounselorHome />} />
                <Route path="bookings" element={<CounselorBookings />} />
                <Route path="availability" element={<CounselorAvailability />} />
                <Route path="profile" element={<CounselorProfile />} />
                <Route path="*" element={<Navigate to="/counselor" replace />} />
            </Routes>
        </Suspense>
    );
};

export default CounselorDashboard;
