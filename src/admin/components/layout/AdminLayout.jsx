import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ForceChangePasswordModal from '../ForceChangePasswordModal';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminLayout() {
    const { user, updateUser } = useAdminAuth();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    useEffect(() => {
        // Show modal if user is logging in for the first time
        if (user?.isFirstLogin) {
            setShowChangePasswordModal(true);
        }
    }, [user?.isFirstLogin]);

    const handlePasswordChangeSuccess = async () => {
        // Refresh user profile to get updated isFirstLogin status
        try {
            const profile = await adminAuthService.getProfile();
            updateUser({ ...user, isFirstLogin: false });
            setShowChangePasswordModal(false);
        } catch (error) {
            console.error('Error refreshing profile:', error);
            // Still close modal even if refresh fails
            updateUser({ ...user, isFirstLogin: false });
            setShowChangePasswordModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>

            {/* Force Change Password Modal */}
            <ForceChangePasswordModal
                isOpen={showChangePasswordModal}
                onSuccess={handlePasswordChangeSuccess}
            />
        </div>
    );
}
