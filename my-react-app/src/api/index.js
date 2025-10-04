const API_URL = 'http://localhost:5001/api';

// --- USER & AUTH API ---
export const register = (userData) => {
    return fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    }).then(res => res.json());
};

export const login = (credentials) => {
    return fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    }).then(res => res.json());
};

// --- GIGS API ---
export const getGigs = (category = 'All', searchTerm = '') => {
  return fetch(`${API_URL}/gigs?category=${category}&search=${searchTerm}`)
    .then(res => res.json());
};

export const getGigById = (id) => {
  return fetch(`${API_URL}/gigs/${id}`)
    .then(res => res.json());
};

export const createGig = (formData) => {
  return fetch(`${API_URL}/gigs`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
};

export const deleteGig = (gigId) => {
  return fetch(`${API_URL}/gigs/${gigId}`, {
    method: 'DELETE',
  }).then(res => res.json());
};

// --- ORDERS API ---
export const createOrder = (orderData) => {
  return fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  }).then(res => res.json());
};

export const getOrdersForUser = (userId) => {
  return fetch(`${API_URL}/orders/user/${userId}`).then(res => res.json());
};

// ADD THIS FUNCTION
export const updateOrderStatus = (orderId, status) => {
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