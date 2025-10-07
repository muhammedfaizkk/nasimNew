import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/layout/Sidebar';
import { FiMenu, FiX, FiHome, FiUser } from 'react-icons/fi';

function AdminLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sidebarRef = useRef();
    const navigate = useNavigate();

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                mobileMenuOpen
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative pb-14 sm:pb-0">
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-md transform transition-transform duration-300 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
            >
                <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-700 focus:outline-none mr-2"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
                            )}
                        </button>
                        <img
                            src="/logonav.png"
                            alt="Logo"
                            className="h-8 w-8 object-contain"
                        />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 mt-14 md:mt-0 h-full overflow-y-auto p-4 pb-24">
                <Outlet />
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t z-40">
                <div className="flex justify-around items-center py-2">
                    {/* Home */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex flex-col items-center text-gray-600 hover:text-[rgb(19,121,221)] text-sm"
                    >
                        <FiHome className="h-5 w-5 mb-1" />
                        Home
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => navigate('/admin/profile')}
                        className="flex flex-col items-center text-gray-600 hover:text-[rgb(19,121,221)] text-sm"
                    >
                        <FiUser className="h-5 w-5 mb-1" />
                        Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
