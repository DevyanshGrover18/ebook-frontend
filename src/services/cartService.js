import { BASE_URL, handleResponse } from './api.js';

export const cartService = {
  get: (cartId) => fetch(`${BASE_URL}/cart/${cartId}`).then(handleResponse),
  clear: (cartId) => fetch(`${BASE_URL}/cart/${cartId}`, {
    method: 'DELETE'
  }).then(handleResponse),
  addItem: (cartId, item) => fetch(`${BASE_URL}/cart/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(handleResponse),
  removeItem: (cartId, itemId) => fetch(`${BASE_URL}/cart/${cartId}/items/${itemId}`, {
    method: 'DELETE'
  }).then(handleResponse)
};
