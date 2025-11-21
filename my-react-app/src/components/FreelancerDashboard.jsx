import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import GigCard from './GigCard';
import GigForm from './GigForm';
import { getGigs, deleteGig, getOrdersForUser, updateOrderStatus } from '../api/index';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Navigate } from 'react-router-dom';

const FreelancerDashboard = ({ showToast }) => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('gigs');
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gigToEdit, setGigToEdit] = useState(null); 

  const fetchGigs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
        const allGigs = await getGigs();
        setGigs(allGigs.filter(gig => gig.freelancerId?._id === user._id));
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

  const handleAcceptOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'in-progress');
      showToast('Order accepted! Work in progress.', 'success');
      fetchOrders(); 
    } catch (error) {
      console.error('Failed to accept order:', error);
      showToast('Failed to accept order.', 'error');
    }
  };
  
  // NEW FUNCTION: Handles marking an order as 'completed'
  const handleCompleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'completed');
      showToast('Order marked as completed!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Failed to complete order:', error);
      showToast('Failed to complete order.', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setGigToEdit(null); 
    setIsModalOpen(true);
  };
  
  const handleEdit = (gig) => {
    setGigToEdit(gig); 
    setIsModalOpen(true);
  };
  
  const handleFormClose = () => {
    setIsModalOpen(false);
    setGigToEdit(null); 
  };

  const handleFormSuccess = (actionType = 'created') => {
    handleFormClose();
    showToast(`Gig ${actionType} successfully!`, 'success');
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
            <button onClick={handleOpenCreateModal} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
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
                {gigs.length > 0 ? gigs.map(gig => <GigCard key={gig._id} gig={gig} isOwner={true} onDelete={handleDelete} onEdit={handleEdit} />) : <p>You haven't created any gigs yet.</p>}
              </div>
            )
          )}
          {activeTab === 'orders' && (
             <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {loading ? <p className="p-4 text-center">Loading orders...</p> : (
                  orders.length > 0 ? orders.filter(order => order.gigId).map(order => (
                    <li key={order._id}>
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div>
                           <p className="text-sm font-medium text-teal-600 truncate">{order.gigId.title}</p>
                           <div className="mt-2 flex items-center text-sm text-gray-500">
                             <p>Status: 
                               <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                 order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                 order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                 'bg-yellow-100 text-yellow-800'
                               }`}>
                                 {order.status}
                               </span>
                             </p>
                           </div>
                         </div>
                         <div className="flex space-x-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => handleAcceptOrder(order._id)}
                                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Accept
                              </button>
                            )}
                            {/* NEW BUTTON: Done button for in-progress orders */}
                            {order.status === 'in-progress' && (
                              <button 
                                onClick={() => handleCompleteOrder(order._id)}
                                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Done
                              </button>
                            )}
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
      {isModalOpen && <GigForm user={user} gigToEdit={gigToEdit} onClose={handleFormClose} onSuccess={handleFormSuccess} />}
    </>
  );
};

export default FreelancerDashboard;