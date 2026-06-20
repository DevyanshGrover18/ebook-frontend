// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = 'https://stitch.withgoogle.com/projects/7531510828821899623';

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP error! status: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const booksService = {
  getAll: () => fetch(`${BASE_URL}/books`).then(handleResponse),
  getById: (id) => fetch(`${BASE_URL}/books/${id}`).then(handleResponse),
  create: (data) => fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id, data) => fetch(`${BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id) => fetch(`${BASE_URL}/books/${id}`, {
    method: 'DELETE'
  }).then(handleResponse)
};

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
  }).then(handleResponse)
};
