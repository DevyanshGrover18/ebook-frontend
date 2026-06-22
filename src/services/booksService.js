import { BASE_URL, handleResponse } from './api.js';

export const booksService = {
  getAll: () => fetch(`${BASE_URL}/books`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/books/${id}`).then(handleResponse),
  create: (data) => {
    const isFormData = data instanceof FormData;
    return fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    }).then(handleResponse);
  },
  update: (id, data) => {
    const isFormData = data instanceof FormData;
    return fetch(`${BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    }).then(handleResponse);
  },
  delete: (id) => fetch(`${BASE_URL}/books/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
};
