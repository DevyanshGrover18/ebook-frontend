import { useState, useEffect } from 'react';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { bookRequestsService } from '../../services/requestBookService.js';
import { BookPlus, AlertCircle, ChevronLeft, ChevronRight, Eye, BookOpen } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 50, 100];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'sourcing', label: 'Sourcing' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'declined', label: 'Declined' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

function StatusBadge({ status }) {
  const map = {
    fulfilled: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    declined:  'bg-red-500/10 text-red-400 border-red-500/20',
    sourcing:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const cls = map[status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {status || '—'}
    </span>
  );
}

function BookRequestDetailModal({ request, onStatusChange }) {
  if (!request) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Request ID</p>
          <p className="text-white font-mono text-sm mt-0.5">{request._id}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Book details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Title</p>
          <p className="text-slate-200 text-sm">{request.title || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Author</p>
          <p className="text-slate-200 text-sm">{request.author || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">ISBN</p>
          <p className="text-slate-200 text-sm font-mono">{request.isbn || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Publisher</p>
          <p className="text-slate-200 text-sm">{request.publisher || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Submitted</p>
          <p className="text-slate-200 text-sm">{formatDate(request.createdAt)}</p>
        </div>
      </div>

      {/* Reason */}
      {request.reason && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Reason</p>
          <p className="text-slate-300 text-sm bg-slate-800/50 rounded-xl px-4 py-3 leading-relaxed">
            {request.reason}
          </p>
        </div>
      )}

      {/* Image */}
      {request.image?.url && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Reference Image</p>
          <img
            src={request.image.url}
            alt="Book reference"
            className="rounded-xl max-h-52 object-contain border border-slate-700/60"
          />
        </div>
      )}

      {/* Status update */}
      <div className="border-t border-slate-700/60 pt-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.filter((s) => s.value).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onStatusChange(request._id, value)}
              disabled={request.status === value}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${request.status === value
                  ? 'bg-slate-700 text-slate-300 border-slate-600'
                  : 'bg-transparent text-slate-400 border-slate-600 hover:border-amber-400 hover:text-amber-400'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminBookRequests() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookRequestsService.getAll({ status: statusFilter, page: currentPage, limit: pageSize });
      setRequests(data.data || []);
      setTotal(data.meta?.total || 0);
      setPages(data.meta?.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, pageSize, statusFilter]);

  const handleView = async (id) => {
    setModalLoading(true);
    setSelectedRequest(null);
    try {
      const data = await bookRequestsService.getById(id);
      setSelectedRequest(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await bookRequestsService.updateStatus(id, status);

      // Update both the modal and the table row in place
      setSelectedRequest((prev) => prev ? { ...prev, status } : prev);
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } catch (err) {
      setError(err.message);
    }
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, total);

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookPlus className="w-6 h-6 text-amber-400" /> Book Requests
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Review and source books requested by users.</p>
        </div>
      </div>

      <div className="admin-panel">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="admin-input w-auto"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="admin-input w-auto"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="admin-error-banner mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <BookOpen className="w-10 h-10 opacity-30" />
            <p className="text-sm">No book requests found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Publisher</th>
                    <th>Submitted</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td className="text-slate-200 font-medium max-w-[180px] truncate">{req.title}</td>
                      <td className="text-slate-400 text-sm">{req.author || '—'}</td>
                      <td className="text-slate-400 text-sm font-mono">{req.isbn || '—'}</td>
                      <td className="text-slate-400 text-sm">{req.publisher || '—'}</td>
                      <td className="text-slate-300 text-sm">{formatDate(req.createdAt)}</td>
                      <td>
                        {req.image?.url
                          ? <img src={req.image.url} alt="" className="w-8 h-10 object-cover rounded" />
                          : <span className="text-slate-600 text-xs">None</span>
                        }
                      </td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>
                        <button
                          onClick={() => handleView(req._id)}
                          className="admin-icon-btn text-slate-400 hover:text-amber-400"
                          aria-label="View request"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-slate-500">
                Showing {startIdx}–{endIdx} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="admin-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <span className="text-xs text-slate-400 px-2">
                  Page {currentPage} of {pages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                  disabled={currentPage >= pages}
                  className="admin-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AdminModal
        isOpen={!!selectedRequest || modalLoading}
        onClose={() => setSelectedRequest(null)}
        title="Book Request Details"
        maxWidth="max-w-2xl"
      >
        {modalLoading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading request details...</div>
        ) : (
          selectedRequest && (
            <BookRequestDetailModal
              request={selectedRequest}
              onStatusChange={handleStatusChange}
            />
          )
        )}
      </AdminModal>
    </div>
  );
}

export default AdminBookRequests;