import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Pencil, Trash2, Tag, AlertCircle, CheckCircle, Search, X, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { categoriesService } from '../../services/api.js';
import AdminModal from '../../components/admin/AdminModal.jsx';

// ─── Curated law & books icon set ───────────────────────────────────────────
// Grouped by category for the default (non-search) view
const ICON_GROUPS = [
  {
    label: 'Law & Justice',
    icons: [
      'Scale', 'Gavel', 'Landmark', 'Shield', 'ShieldCheck', 'ShieldAlert',
      'ShieldBan', 'Lock', 'LockKeyhole', 'KeyRound', 'Key', 'Fingerprint',
      'Stamp', 'FileSignature', 'Signature', 'BadgeCheck', 'Award', 'Medal',
    ],
  },
  {
    label: 'Books & Documents',
    icons: [
      'BookOpen', 'BookMarked', 'Book', 'BookCopy', 'BookText', 'BookUser',
      'BookKey', 'BookLock', 'BookHeart', 'Books', 'ScrollText', 'Scroll',
      'FileText', 'FileCheck', 'FileCheck2', 'FilePen', 'FileSearch',
      'FileLock', 'Files', 'Newspaper', 'StickyNote', 'Receipt',
    ],
  },
  {
    label: 'Writing & Research',
    icons: [
      'PenLine', 'Pen', 'PenTool', 'NotebookPen', 'NotebookText', 'Notebook',
      'ClipboardList', 'ClipboardCheck', 'ClipboardPen', 'Clipboard',
      'Search', 'SearchCheck', 'Glasses', 'Microscope', 'Eye',
      'Archive', 'ArchiveRestore', 'FolderOpen', 'FolderKanban',
    ],
  },
  {
    label: 'People & Organisations',
    icons: [
      'Handshake', 'HeartHandshake', 'Users', 'UserCheck', 'UserCog',
      'UserRound', 'GraduationCap', 'Briefcase', 'BriefcaseBusiness',
      'Building', 'Building2', 'Library', 'Globe', 'Globe2',
    ],
  },
  {
    label: 'Finance & Commerce',
    icons: [
      'DollarSign', 'Banknote', 'Coins', 'CreditCard', 'Wallet',
      'TrendingUp', 'BarChart2', 'BarChart3', 'PieChart', 'LineChart',
      'Tag', 'Tags', 'Receipt', 'Package',
    ],
  },
  {
    label: 'Communication',
    icons: [
      'Mail', 'MailOpen', 'MessageSquare', 'MessagesSquare', 'Send',
      'Megaphone', 'Bell', 'BellRing', 'Radio', 'Rss', 'Info',
      'AlertCircle', 'AlertTriangle', 'CheckCircle2', 'Calendar', 'CalendarCheck',
    ],
  },
];

// Flat list of all curated icons (for "all" tab)
const ALL_CURATED = [...new Set(ICON_GROUPS.flatMap((g) => g.icons))];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getIcon(name) {
  return LucideIcons[name] || LucideIcons['Tag'];
}

function CategoryIcon({ name, className = 'w-5 h-5' }) {
  const Icon = getIcon(name);
  return <Icon className={className} />;
}

// Build a full searchable list from the lucide-react namespace once
const ALL_LUCIDE_NAMES = Object.keys(LucideIcons).filter(
  (k) =>
    typeof LucideIcons[k] === 'function' &&
    k !== 'createLucideIcon' &&
    /^[A-Z]/.test(k)
);

// ─── IconPicker ───────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0); // 0 = "All curated"
  const ref = useRef(null);
  const inputRef = useRef(null);

  // When searching, show results from all lucide icons; otherwise show curated groups
  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = query.toLowerCase();
    return ALL_LUCIDE_NAMES.filter((n) => n.toLowerCase().includes(q)).slice(0, 120);
  }, [query, isSearching]);

  const curatedGroupIcons = useMemo(() => {
    if (activeGroup === 0) return ALL_CURATED;
    return ICON_GROUPS[activeGroup - 1]?.icons ?? [];
  }, [activeGroup]);

  const displayIcons = isSearching ? searchResults : curatedGroupIcons;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const SelectedIcon = getIcon(value);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="admin-input flex items-center gap-3 cursor-pointer hover:border-amber-400/50 transition-colors text-left w-full"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
          <SelectedIcon className="w-4 h-4" />
        </span>
        <span className="text-slate-300 text-sm flex-1 truncate">{value || 'Select icon…'}</span>
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[340px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '420px' }}>

          {/* Search bar */}
          <div className="p-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search all 1600+ Lucide icons…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none flex-1 min-w-0"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')}>
                  <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                </button>
              )}
            </div>
          </div>

          {/* Group tabs — hidden while searching */}
          {!isSearching && (
            <div className="flex gap-1 px-3 pt-2 pb-1 overflow-x-auto shrink-0 scrollbar-none">
              {['All', ...ICON_GROUPS.map((g) => g.label)].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveGroup(i)}
                  className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-colors shrink-0
                    ${activeGroup === i
                      ? 'bg-amber-400/15 text-amber-400 font-medium'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Icon grid */}
          <div className="overflow-y-auto flex-1 p-3">
            {displayIcons.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-6">
                No icons match "{query}"
              </p>
            ) : (
              <div className="grid grid-cols-8 gap-1">
                {displayIcons.map((name) => {
                  const Icon = getIcon(name);
                  const isSelected = value === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => { onChange(name); setOpen(false); setQuery(''); }}
                      className={`
                        relative flex items-center justify-center w-full aspect-square rounded-lg transition-all
                        ${isSelected
                          ? 'bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/50'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-slate-900" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-600">
              {isSearching
                ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} across all icons`
                : `${displayIcons.length} icons`}
            </span>
            {value && (
              <span className="text-xs text-amber-400/70 flex items-center gap-1">
                <CategoryIcon name={value} className="w-3 h-3" />
                {value}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Form defaults ────────────────────────────────────────────────────────────

const emptyForm = {
  id: '',
  title: '',
  publicationsLabel: '',
  description: '',
  icon: 'Scale',
  imageAlt: '',
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`admin-toast ${type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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
    } catch {
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
      icon: cat.icon || 'Scale',
    });
    setModal({ open: true, mode: 'edit', docId: cat._id, catId: cat.id });
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await categoriesService.create({ ...form });
        showToast('Category created successfully');
      } else {
        await categoriesService.update(modal.catId, { ...form });
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
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </span>
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
                          : <Trash2 className="w-4 h-4" />}
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
            <label className="admin-label">Category Icon</label>
            <IconPicker value={form.icon} onChange={(name) => setForm((f) => ({ ...f, icon: name }))} />
            <p className="mt-1.5 text-xs text-slate-500">
              Browse curated law & books icons, or search all 1600+ Lucide icons.
            </p>
          </div>

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