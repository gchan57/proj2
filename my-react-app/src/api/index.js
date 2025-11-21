const API_URL = 'http://localhost:5001/api';

// --- USER & AUTH API ---
export const register = (userData) => {
// ... (existing register function)
    return fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    }).then(res => res.json());
};

export const login = (credentials) => {
// ... (existing login function)
    return fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    }).then(res => res.json());
};

// --- GIGS API ---
export const getGigs = (category = 'All', searchTerm = '') => {
// ... (existing getGigs function)
  return fetch(`${API_URL}/gigs?category=${category}&search=${searchTerm}`)
    .then(res => res.json());
};

export const getGigById = (id) => {
// ... (existing getGigById function)
  return fetch(`${API_URL}/gigs/${id}`)
    .then(res => res.json());
};

export const createGig = (formData) => {
// ... (existing createGig function)
  return fetch(`${API_URL}/gigs`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
};

export const updateGig = (gigId, formData) => {
// ... (existing updateGig function)
  return fetch(`${API_URL}/gigs/${gigId}`, {
    method: 'PUT', 
    body: formData,
  }).then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update gig');
    }
    return res.json();
  });
};

export const deleteGig = (gigId) => {
// ... (existing deleteGig function)
  return fetch(`${API_URL}/gigs/${gigId}`, {
    method: 'DELETE',
  }).then(res => res.json());
};

// NEW FUNCTION: Submit a review
export const submitReview = (gigId, reviewData) => {
  return fetch(`${API_URL}/gigs/${gigId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  }).then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to submit review');
    }
    return res.json();
  });
};

// --- ORDERS API ---
export const createOrder = (orderData) => {
// ... (existing createOrder function)
  return fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  }).then(res => res.json());
};

export const getOrdersForUser = (userId) => {
// ... (existing getOrdersForUser function)
  return fetch(`${API_URL}/orders/user/${userId}`).then(res => res.json());
};

export const updateOrderStatus = (orderId, status) => {
// ... (existing updateOrderStatus function)
  return fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(res => {
    if (!res.ok) {
      throw new Error('Failed to update order status');
    }
    return res.json();
  });
};