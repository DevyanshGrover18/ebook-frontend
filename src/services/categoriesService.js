import { BASE_URL, handleResponse } from './api.js';

export const categoriesService = {
  getAll: () => fetch(`${BASE_URL}/categories`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/categories/${id}`).then(handleResponse),
  create: (data) => fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id, data) => fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/categories/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
};
