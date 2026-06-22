import { BASE_URL, handleResponse } from './api.js';

export const faqsService = {
  getAll: () => fetch(`${BASE_URL}/faqs`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/faqs/${id}`).then(handleResponse),
  create: (data) => fetch(`${BASE_URL}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id, data) => fetch(`${BASE_URL}/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/faqs/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
};
