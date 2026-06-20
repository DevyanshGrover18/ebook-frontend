import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { booksService, categoriesService } from '../../services/api.js';
import AdminModal from '../../components/admin/AdminModal.jsx';

const emptyForm = {
  id: '',
  title: '',
  author: '',
  price: '',
  rating: '',
  reviewCount: '',
  badge: '',
  category: '',
  publisher: '',
  edition: '',
  publicationDate: '',
  pages: '',
  isbn: '',
  language: 'English',
  image: '',
  imageAlt: '',
  description: '',
};

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`admin-toast ${type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create' });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksData, catsData] = await Promise.all([
        booksService.getAll(),
        categoriesService.getAll(),
      ]);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: 'create' });
  };

  const openEdit = (book) => {
    setForm({
      id: book.id || '',
      title: book.title || '',
      author: book.author || '',
      price: book.price ?? '',
      rating: book.rating ?? '',
      reviewCount: book.reviewCount ?? '',
      badge: book.badge || '',
      category: book.category || '',
      publisher: book.publisher || '',
      edition: book.edition || '',
      publicationDate: book.publicationDate || '',
      pages: book.pages ?? '',
      isbn: book.isbn || '',
      language: book.language || 'English',
      image: book.image || '',
      imageAlt: book.imageAlt || '',
      description: book.description || '',
    });
    setModal({ open: true, mode: 'edit', bookId: book.id });
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      rating: parseFloat(form.rating) || 0,
      reviewCount: parseInt(form.reviewCount, 10) || 0,
      pages: parseInt(form.pages, 10) || 0,
      badge: form.badge || null,
    };
    try {
      if (modal.mode === 'create') {
        await booksService.create(payload);
        showToast('Book created successfully');
      } else {
        await booksService.update(modal.bookId, payload);
        showToast('Book updated successfully');
      }
      setModal({ open: false });
      loadData();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    setDeleting(book._id);
    try {
      await booksService.delete(book.id);
      showToast('Book deleted');
      loadData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" /> Books
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{books.length} publications in the catalog</p>
        </div>
        <button id="admin-add-book-btn" onClick={openCreate} className="admin-btn-primary flex items-center gap-2 px-4 py-2">
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      <div className="admin-panel overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No books yet. Add one to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Badge</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {book.image && (
                        <img src={book.image} alt={book.imageAlt} className="w-10 h-14 rounded-lg object-cover shrink-0" />
                      )}
                      <div>
                        <p className="text-white font-medium leading-snug">{book.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{book.edition}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-300 text-sm">{book.author}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium border border-amber-400/20">
                      {book.category}
                    </span>
                  </td>
                  <td className="text-slate-300 font-mono text-sm">₹{book.price?.toFixed(2)}</td>
                  <td>
                    <span className="flex items-center gap-1 text-amber-400 text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {book.rating}
                    </span>
                  </td>
                  <td>
                    {book.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 text-xs font-medium border border-blue-400/20">
                        {book.badge}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(book)} className="admin-icon-btn text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book)} disabled={deleting === book._id} className="admin-icon-btn text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Delete">
                        {deleting === book._id
                          ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Book Form Modal */}
      <AdminModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === 'create' ? 'Add New Book' : 'Edit Book'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">ID (slug)</label>
              <input name="id" value={form.id} onChange={handleChange} required placeholder="e.g. book-5" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Publication title" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Author</label>
              <input name="author" value={form.author} onChange={handleChange} required placeholder="Author name" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required className="admin-input">
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Price (₹)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="199.00" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Rating (0–5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="4.8" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Review Count</label>
              <input name="reviewCount" type="number" min="0" value={form.reviewCount} onChange={handleChange} placeholder="124" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Badge (optional)</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. New Release" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Publisher</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} placeholder="Publisher name" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Edition</label>
              <input name="edition" value={form.edition} onChange={handleChange} placeholder="1st Edition" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Publication Date</label>
              <input name="publicationDate" value={form.publicationDate} onChange={handleChange} placeholder="January 2024" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Pages</label>
              <input name="pages" type="number" min="0" value={form.pages} onChange={handleChange} placeholder="450" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="978-x-xxxx-xxxx-x" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Language</label>
              <input name="language" value={form.language} onChange={handleChange} placeholder="English" className="admin-input" />
            </div>
          </div>

          <div>
            <label className="admin-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Full book description…" className="admin-input resize-none" />
          </div>

          <div>
            <label className="admin-label">Cover Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} required placeholder="https://…" className="admin-input" />
          </div>

          <div>
            <label className="admin-label">Image Alt Text</label>
            <input name="imageAlt" value={form.imageAlt} onChange={handleChange} placeholder="Descriptive alt text" className="admin-input" />
          </div>

          {form.image && (
            <div className="flex items-center gap-3">
              <img src={form.image} alt="preview" className="w-16 h-20 rounded-lg object-cover border border-slate-700" onError={(e) => e.target.style.display = 'none'} />
              <p className="text-slate-500 text-xs">Cover preview</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false })} className="admin-btn-ghost px-5 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="admin-btn-primary px-5 py-2 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />}
              {modal.mode === 'create' ? 'Create Book' : 'Save Changes'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminBooks;
