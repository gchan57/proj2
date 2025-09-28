import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';

const API_BASE_URL = 'http://localhost:5001';

const GigCard = ({ gig, isOwner, onDelete }) => {
  const imageUrl = gig.imageUrl ? `${API_BASE_URL}${gig.imageUrl}` : `https://via.placeholder.com/400x300.png?text=No+Image`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/gig/${gig._id}`} className="block">
        <img className="h-48 w-full object-cover" src={imageUrl} alt={gig.title} />
        <div className="p-4">
          <p className="text-sm text-gray-500">by {gig.freelancerId?.username || '...'}</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-800 truncate">{gig.title}</h3>
          <p className="mt-2 text-gray-600 text-sm h-10 overflow-hidden">{gig.description.substring(0, 80)}...</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600 text-sm">{gig.rating?.toFixed(1) || 'New'}</span>
            </div>
            <p className="text-lg font-bold text-teal-600">${gig.price}</p>
          </div>
        </div>
      </Link>
      {isOwner && (
        <div className="p-4 bg-gray-50 border-t">
          <button onClick={() => onDelete(gig._id)} className="w-full flex items-center justify-center text-red-500 hover:text-red-700 text-sm font-medium">
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default GigCard;