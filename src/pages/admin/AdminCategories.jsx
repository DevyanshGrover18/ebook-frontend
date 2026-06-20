import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import { categoriesService } from '../../services/api.js';
import AdminModal from '../../components/admin/AdminModal.jsx';

const emptyForm = {
  id: '',
  title: '',
  publicationsLabel: '',
  description: '',
  image: '',
  imageAlt: '',
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

function AdminCategories() {
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

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: 'create' });
  };

  const openEdit = (cat) => {
    setForm({
      id: cat.id || '',
      title: cat.title || '',
      publicationsLabel: cat.publicationsLabel || '',
      description: cat.description || '',
      image: cat.image || '',
      imageAlt: cat.imageAlt || '',
    });
    setModal({ open: true, mode: 'edit', docId: cat._id, catId: cat.id });
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await categoriesService.create(form);
        showToast('Category created successfully');
      } else {
        await categoriesService.update(modal.catId, form);
        showToast('Category updated successfully');
      }
      setModal({ open: false });
      loadCategories();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.title}"? This cannot be undone.`)) return;
    setDeleting(cat._id);
    try {
      await categoriesService.delete(cat.id);
      showToast('Category deleted');
      loadCategories();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-400" /> Categories
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{categories.length} total categories</p>
        </div>
        <button id="admin-add-category-btn" onClick={openCreate} className="admin-btn-primary flex items-center gap-2 px-4 py-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="admin-panel overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No categories yet. Add one to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Publications Label</th>
                <th>Description</th>
                <th>Href</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="font-mono text-xs text-slate-500">{cat.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {cat.image && (
                        <img src={cat.image} alt={cat.imageAlt || cat.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      )}
                      <span className="text-white font-medium">{cat.title}</span>
                    </div>
                  </td>
                  <td className="text-slate-400 text-sm">{cat.publicationsLabel}</td>
                  <td className="text-slate-400 text-sm max-w-xs truncate">{cat.description}</td>
                  <td className="text-slate-500 text-xs font-mono">{cat.href}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="admin-icon-btn text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat._id}
                        className="admin-icon-btn text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        title="Delete"
                      >
                        {deleting === cat._id
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

      {/* Modal */}
      <AdminModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === 'create' ? 'Add New Category' : 'Edit Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">ID (slug)</label>
              <input name="id" value={form.id} onChange={handleChange} required placeholder="e.g. corporate-law" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Corporate Law" className="admin-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Publications Label</label>
              <input name="publicationsLabel" value={form.publicationsLabel} onChange={handleChange} required placeholder="e.g. 250+ Publications" className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={2} placeholder="Short description…" className="admin-input resize-none" />
          </div>
          <div>
            <label className="admin-label">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} required placeholder="https://…" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Image Alt Text</label>
            <input name="imageAlt" value={form.imageAlt} onChange={handleChange} placeholder="Descriptive alt text for the image" className="admin-input" />
          </div>

          {form.image && (
            <div className="rounded-xl overflow-hidden border border-slate-700 h-36 w-full">
              <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false })} className="admin-btn-ghost px-5 py-2">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="admin-btn-primary px-5 py-2 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />}
              {modal.mode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminCategories;
