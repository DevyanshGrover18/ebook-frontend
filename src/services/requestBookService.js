import { BASE_URL, handleResponse } from './api.js';

export const bookRequestsService = {
  getAll: ({ status, page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return fetch(`${BASE_URL}/book-request?${params}`).then(handleResponse);
  },

  getById: (id) =>
    fetch(`${BASE_URL}/book-request/${id}`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/book-request`, {
      method: 'POST',
      body: data, // FormData — no Content-Type header, browser sets it with boundary
    }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${BASE_URL}/book-request/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/book-request/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),
};