import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const ReviewForm = ({ order, user, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating.');
    
    setIsSubmitting(true);
    
    const reviewData = {
      gigId: order.gigId._id,
      rating,
      comment,
      userId: user._id,
      username: user.username,
    };
    
    onSubmit(reviewData)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Review: {order.gigId.title}</h3>
        <p className="text-sm text-gray-500 mb-4">Rate the service by {order.freelancerId?.username || 'Freelancer'}</p>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    rating >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Selected: {rating} out of 5 stars</p>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment (Optional)</label>
            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Tell us about your experience..." />
          </div>

          <div className="items-center px-4 py-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting || rating === 0} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-300">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;