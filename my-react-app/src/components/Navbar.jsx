import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/gighub.png';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img className="h-8 w-auto" src={logo} alt="GigHub" />
              <span className="font-bold text-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-transparent bg-clip-text">
                GigHub
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-transparent bg-clip-text">
                    Welcome, {user.username}
                  </span>
                  <Link 
                    to={`/${user.role}/dashboard`} 
                    className="text-gray-600 hover:text-cyan-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-cyan-50"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout} 
                    className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login?role=freelancer" 
                    className="text-gray-600 hover:text-teal-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-teal-50 flex items-center space-x-1"
                  >
                    <span>Become a Freelancer</span>
                  </Link>
                  <Link 
                    to="/login?role=client" 
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Join as Client
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button - you can add this later */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-cyan-500">
              {/* Add your mobile menu icon here */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;