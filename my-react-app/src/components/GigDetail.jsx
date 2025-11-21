import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGigById, createOrder } from '../api/index';
import { useAuth } from '../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';

const API_BASE_URL = 'http://localhost:5001';

const GigDetail = ({ showToast }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const gigData = await getGigById(id);
                setGig(gigData);
            } catch (error) {
                console.error("Failed to fetch gig:", error)
            } finally {
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    const handleOrder = async () => {
        if (!user) {
            navigate('/login?role=client');
            return;
        }
        if (user.role !== 'client') {
            showToast('Only clients can place orders.', 'error');
            return;
        }
        if (user._id === gig.freelancerId._id) {
            showToast("You cannot order your own gig.", "error");
            return;
        }

        const orderData = {
            gigId: gig._id,
            clientId: user._id,
            freelancerId: gig.freelancerId._id,
            price: gig.price,
        };

        try {
            await createOrder(orderData);
            showToast('Order placed successfully!', 'success');
            navigate('/client/dashboard');
        } catch (error) {
            showToast('Failed to place order.', 'error');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading gig details...</p>;
    if (!gig) return <p className="text-center mt-10">Gig not found!</p>;
    
    const imageUrl = gig.imageUrl ? `${API_BASE_URL}${gig.imageUrl}` : `https://via.placeholder.com/1280x720.png?text=No+Image`;
    
    // Logic to ensure rating is a number and display "New" if no reviews
    const displayRating = gig.rating > 0 ? gig.rating.toFixed(1) : 'New';
    const numReviewsText = gig.numReviews === 1 ? '1 review' : `${gig.numReviews} reviews`;
    const reviewsAvailable = gig.reviews && gig.reviews.length > 0;

    return (
        <div className="bg-white">
            <div className="pt-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    <div className="lg:col-span-2">
                        <img src={imageUrl} alt={gig.title} className="w-full h-full object-center object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="mt-4 lg:mt-0 lg:row-span-3">
                        <h2 className="sr-only">Product information</h2>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{gig.title}</h1>
                        <p className="text-sm mt-2">by <span className="font-medium text-teal-600">{gig.freelancerId?.username}</span></p>

                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        // CRITICAL: Display stars based on gig.rating
                                        <StarIcon 
                                            key={index} 
                                            className={`h-5 w-5 flex-shrink-0 ${gig.rating > index ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        />
                                    ))}
                                </div>
                                <p className="ml-2 text-sm text-gray-500">
                                    {displayRating} ({numReviewsText})
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900">Description</h3>
                            <div className="mt-4 space-y-6">
                                <p className="text-base text-gray-600">{gig.description}</p>
                            </div>
                        </div>
                        
                        <p className="text-3xl text-gray-900 mt-6">${gig.price}</p>
                        
                        <button onClick={handleOrder} className="mt-10 w-full bg-teal-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-teal-700">
                            Order Now
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:max-w-7xl lg:py-24 lg:px-8">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Customer Reviews</h2>
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        {reviewsAvailable ? (
                            <div className="divide-y divide-gray-200">
                                {gig.reviews.map((review) => (
                                    <div key={review._id} className="py-4">
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                {[0, 1, 2, 3, 4].map((index) => (
                                                    <StarIcon
                                                        key={index}
                                                        className={`h-5 w-5 flex-shrink-0 ${review.rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="ml-3 text-lg font-medium text-gray-900">{review.username}</p>
                                        </div>
                                        <p className="mt-2 text-gray-600 italic">"{review.comment || 'No comment provided.'}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet for this gig.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetail;