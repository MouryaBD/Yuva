import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold text-primary-600">
              SparkPath
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-gray-700 hover:text-primary-600 px-3 py-2">
              Home
            </Link>
            <Link to="/certification" className="text-gray-700 hover:text-primary-600 px-3 py-2">
              Certifications
            </Link>
            <Link to="/networking" className="text-gray-700 hover:text-primary-600 px-3 py-2">
              Network
            </Link>

            <div className="flex items-center space-x-3 border-l pl-4">
              <span className="text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
