import { BASE_URL, handleResponse } from './api.js';

export const ordersService = {
  getAll: ({ page = 1, limit = 10, dateRange = '7d' } = {}) => {
    const params = [
      `page=${encodeURIComponent(page)}`,
      `limit=${encodeURIComponent(limit)}`,
      `dateRange=${encodeURIComponent(dateRange)}`
    ].join('&');
    return fetch(`${BASE_URL}/orders?${params}`).then(handleResponse);
  },
  getById: (id) => fetch(`${BASE_URL}/orders/${id}`).then(handleResponse),
  create: (data) => fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  createRazorpayOrder: (amount) => fetch(`${BASE_URL}/orders/razorpay/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  }).then(handleResponse)
};
