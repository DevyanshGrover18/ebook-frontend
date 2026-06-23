// export const BASE_URL = 'http://localhost:5000/api';
export const BASE_URL = 'https://ebook-backend-f78l.onrender.com/api';

export async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP error! status: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export * from './booksService.js';
export * from './categoriesService.js';
export * from './faqsService.js';
export * from './cartService.js';
export * from './ordersService.js';
