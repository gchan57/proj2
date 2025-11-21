import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import GigCard from './GigCard';
import { getGigs, getOrdersForUser, submitReview } from '../api/index'; // <-- Import submitReview
import { Navigate } from 'react-router-dom';
import ReviewForm from './ReviewForm'; // <-- Import the new component

const categories = ['All', 'Web Development', 'Design', 'Writing', 'Marketing'];

const ClientDashboard = ({ showToast }) => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // NEW STATE for Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [orderToReview, setOrderToReview] = useState(null);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const filteredGigs = await getGigs(activeCategory, searchTerm);
      setGigs(filteredGigs);
    } catch (error) {
      console.error("Failed to fetch gigs:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchTerm]);
  
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userOrders = await getOrdersForUser(user._id);
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'browse') fetchGigs();
    else if (activeTab === 'my-orders') fetchOrders();
  }, [activeTab, fetchGigs, fetchOrders]);
  
  // NEW FUNCTIONS FOR REVIEW
  const handleOpenReviewModal = (order) => {
    setOrderToReview(order);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await submitReview(reviewData.gigId, reviewData);
      showToast('Review submitted successfully!', 'success');
      
      // OPTIONAL: Mark the order reviewed locally or refresh orders.
      setOrders(prevOrders => 
        prevOrders.map(order => 
            order._id === orderToReview._id ? { ...order, status: 'reviewed' } : order
        )
      );
      // For simplicity and immediate visual update, we will refetch all orders
      fetchOrders(); 
      
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsReviewModalOpen(false);
      setOrderToReview(null);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'client') return <Navigate to="/" />;

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.username}. Find the perfect service for your next project.</p>
          
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('browse')} className={`${activeTab === 'browse' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Browse Gigs</button>
                <button onClick={() => setActiveTab('my-orders')} className={`${activeTab === 'my-orders' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Orders</button>
              </nav>
            </div>
          </div>

          <div className="mt-8">
            {activeTab === 'browse' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <input type="text" placeholder="Search for services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchGigs()} className="md:col-span-3 p-2 border rounded-md"/>
                  <div className="flex space-x-2 overflow-x-auto">
                      {categories.map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm rounded-full ${activeCategory === cat ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{cat}</button>
                      ))}
                  </div>
                </div>
                {loading ? <p className="mt-8 text-center">Loading gigs...</p> : (
                  <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {gigs.length > 0 ? gigs.map(gig => <GigCard key={gig._id} gig={gig} />) : <p>No gigs found matching your criteria.</p>}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'my-orders' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {loading ? <p className="p-4 text-center">Loading orders...</p> : (
                    orders.length > 0 ? orders.filter(order => order.gigId).map(order => {
                        // Check if the gig already has a review from this user
                        const gigReviewed = order.gigId.reviews?.some(r => r.user.toString() === user._id);
                        
                        return (
                        <li key={order._id}>
                          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-teal-600 truncate">{order.gigId.title}</p>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">Price: ${order.price}</p>
                                </div>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex space-x-3 items-center">
                                {/* Status Badge */}
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status}
                                </p>
                                
                                {/* NEW RATE BUTTON */}
                                {order.status === 'completed' && !gigReviewed && (
                                    <button
                                        onClick={() => handleOpenReviewModal(order)}
                                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Rate
                                    </button>
                                )}
                                {(order.status === 'completed' && gigReviewed) && (
                                    <span className="text-sm text-gray-500 italic">Reviewed</span>
                                )}
                            </div>
                          </div>
                        </li>
                        );
                    }) : <p className="p-4 text-center">You have no orders.</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {isReviewModalOpen && orderToReview && (
          <ReviewForm 
              order={orderToReview} 
              user={user}
              onSubmit={handleReviewSubmit}
              onClose={() => setIsReviewModalOpen(false)}
          />
      )}
    </>
  );
};

export default ClientDashboard;