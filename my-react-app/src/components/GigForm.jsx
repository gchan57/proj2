import React, { useState } from 'react';
import { createGig, updateGig } from '../api/index';

const GigForm = ({ user, gigToEdit = null, onClose, onSuccess }) => { 
  // Initialize state with gig data if editing, otherwise empty/default
  const [title, setTitle] = useState(gigToEdit ? gigToEdit.title : ''); 
  const [description, setDescription] = useState(gigToEdit ? gigToEdit.description : ''); 
  const [price, setPrice] = useState(gigToEdit ? gigToEdit.price : ''); 
  const [category, setCategory] = useState(gigToEdit ? gigToEdit.category : 'Web Development'); 
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUpdating = !!gigToEdit; 
  const formTitle = isUpdating ? `Edit Gig: ${gigToEdit.title}` : 'Create a New Gig';
  const buttonText = isSubmitting ? 'Processing...' : (isUpdating ? 'Update Gig' : 'Create Gig');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('freelancerId', user._id);
    // Only append image if a new one is selected
    if (image) formData.append('image', image);

    try {
      if (isUpdating) {
        await updateGig(gigToEdit._id, formData);
        onSuccess('updated');
      } else {
        const result = await createGig(formData);
        if (result.message) throw new Error(result.message);
        onSuccess('created');
      }
    } catch (error) {
      console.error(`Failed to ${isUpdating ? 'update' : 'create'} gig:`, error);
      // Use showToast prop from parent in a real app, but using alert as fallback here
      alert(`Error ${isUpdating ? 'updating' : 'creating'} gig: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-medium leading-6 text-gray-900">{formTitle}</h3>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="5" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
              <option>Web Development</option><option>Design</option><option>Writing</option><option>Marketing</option>
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Gig Image {isUpdating && <span className="text-gray-400">(Leave blank to keep existing image)</span>}</label>
            <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} accept="image/*" 
            required={!isUpdating} 
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
          </div>
          <div className="items-center px-4 py-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-300">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigForm;