import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import GigCard from './GigCard';
import GigForm from './GigForm';
import { getGigs, deleteGig, getOrdersForUser } from '../api/index';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Navigate } from 'react-router-dom';

const FreelancerDashboard = ({ showToast }) => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('gigs');
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGigs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
        const allGigs = await getGigs();
        setGigs(allGigs.filter(gig => gig.freelancerId._id === user._id));
    } catch(err) {
        console.error("Failed to fetch gigs:", err);
    } finally {
        setLoading(false);
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
        const userOrders = await getOrdersForUser(user._id);
        setOrders(userOrders);
    } catch(err){
        console.error("Failed to fetch orders:", err);
    } finally {
        setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'gigs') fetchGigs();
    else if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchGigs, fetchOrders]);

  const handleDelete = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      await deleteGig(gigId);
      showToast('Gig deleted successfully!', 'success');
      fetchGigs();
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    showToast('Gig created successfully!', 'success');
    fetchGigs();
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'freelancer') return <Navigate to="/" />;

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your gigs and view incoming orders.</p>
          </div>
          {activeTab === 'gigs' && (
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Create New Gig
            </button>
          )}
        </div>
        
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('gigs')} className={`${activeTab === 'gigs' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Gigs</button>
              <button onClick={() => setActiveTab('orders')} className={`${activeTab === 'orders' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Incoming Orders</button>
            </nav>
          </div>
        </div>

        <div className="mt-8">
          {activeTab === 'gigs' && (
            loading ? <p className="text-center">Loading your gigs...</p> : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {gigs.length > 0 ? gigs.map(gig => <GigCard key={gig._id} gig={gig} isOwner={true} onDelete={handleDelete} />) : <p>You haven't created any gigs yet.</p>}
              </div>
            )
          )}
          {activeTab === 'orders' && (
             <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {loading ? <p className="p-4 text-center">Loading orders...</p> : (
                  orders.length > 0 ? orders.map(order => (
                    <li key={order._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-teal-600 truncate">{order.gigId.title}</p>
                          <div className="ml-2 flex-shrink-0 flex"><p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</p></div>
                        </div>
                      </div>
                    </li>
                  )) : <p className="p-4 text-center">You have no incoming orders.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <GigForm user={user} onClose={() => setIsModalOpen(false)} onSuccess={handleFormSuccess} />}
    </>
  );
};

export default FreelancerDashboard;