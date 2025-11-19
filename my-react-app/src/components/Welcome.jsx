import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loading spinner
    if (user) return <Navigate to={`/${user.role}/dashboard`} />;

  return (
    <div className="bg-white"> {/* Changed background to white */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Welcome to GigHub</h1>
        <p className="mt-4 text-xl text-gray-600">The premier marketplace to connect with skilled freelancers.</p>
        <div className="mt-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <UserGroupIcon className="h-12 w-12 mx-auto text-cyan-500" />
            <h3 className="mt-4 text-2xl font-semibold text-gray-700">I'm a Client</h3>
            <p className="mt-2 text-gray-500">Hire talented professionals for your next big project.</p>
            <Link to="/login?role=client" className="mt-6 inline-block bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors">
              Find Talent
            </Link>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <BriefcaseIcon className="h-12 w-12 mx-auto text-teal-500" />
            <h3 className="mt-4 text-2xl font-semibold text-gray-700">I'm a Freelancer</h3>
            <p className="mt-2 text-gray-500">Offer your services and find exciting new work.</p>
            <Link to="/login?role=freelancer" className="mt-6 inline-block bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors">
              Find Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;