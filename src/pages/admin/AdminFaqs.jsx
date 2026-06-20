import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, HelpCircle, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqsService } from '../../services/api.js';
import AdminModal from '../../components/admin/AdminModal.jsx';

const emptyForm = { id: '', question: '', answer: '' };

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`admin-toast ${type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

function FaqRow({ faq, onEdit, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <tr>
      <td className="font-mono text-xs text-slate-500">{faq.id}</td>
      <td>
        <button
          className="text-left text-white font-medium hover:text-amber-400 transition-colors flex items-start gap-2 w-full"
          onClick={() => setExpanded((v) => !v)}
        >
          <span>{faq.question}</span>
          {expanded ? <ChevronUp className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />}
        </button>
        {expanded && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{faq.answer}</p>}
      </td>
      <td>
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onEdit(faq)} className="admin-icon-btn text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(faq)} disabled={deleting === faq._id} className="admin-icon-btn text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Delete">
            {deleting === faq._id
              ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin block" />
              : <Trash2 className="w-4 h-4" />
            }
          </button>
        </div>
      </td>
    </tr>
  );
}

function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
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

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await faqsService.getAll();
      setFaqs(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFaqs(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: 'create' });
  };

  const openEdit = (faq) => {
    setForm({ id: faq.id || '', question: faq.question || '', answer: faq.answer || '' });
    setModal({ open: true, mode: 'edit', faqId: faq.id });
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await faqsService.create(form);
        showToast('FAQ created successfully');
      } else {
        await faqsService.update(modal.faqId, form);
        showToast('FAQ updated successfully');
      }
      setModal({ open: false });
      loadFaqs();
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm(`Delete FAQ "${faq.question.substring(0, 50)}…"?`)) return;
    setDeleting(faq._id);
    try {
      await faqsService.delete(faq.id);
      showToast('FAQ deleted');
      loadFaqs();
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
            <HelpCircle className="w-6 h-6 text-amber-400" /> FAQs
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{faqs.length} frequently asked questions</p>
        </div>
        <button id="admin-add-faq-btn" onClick={openCreate} className="admin-btn-primary flex items-center gap-2 px-4 py-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="admin-panel overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No FAQs yet. Add one to get started.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question / Answer</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <FaqRow key={faq._id} faq={faq} onEdit={openEdit} onDelete={handleDelete} deleting={deleting} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.mode === 'create' ? 'Add New FAQ' : 'Edit FAQ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">ID (slug)</label>
            <input name="id" value={form.id} onChange={handleChange} required placeholder="e.g. faq-7" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Question</label>
            <input name="question" value={form.question} onChange={handleChange} required placeholder="What formats will I receive?" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Answer</label>
            <textarea name="answer" value={form.answer} onChange={handleChange} required rows={5} placeholder="Detailed answer…" className="admin-input resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal({ open: false })} className="admin-btn-ghost px-5 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="admin-btn-primary px-5 py-2 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />}
              {modal.mode === 'create' ? 'Create FAQ' : 'Save Changes'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

export default AdminFaqs;
