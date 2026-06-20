import { useState, useEffect } from 'react';
import AdminModal from '../../components/admin/AdminModal.jsx';
import { ordersService } from '../../services/api.js';
import { ClipboardList, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 50, 100];
const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'all', label: 'All' },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

function formatAddress(addr) {
  if (!addr?.address) return '—';
  const cityState = [addr.city, addr.state].filter(Boolean).join(', ');
  return [addr.address, cityState, addr.zipCode].filter(Boolean).join(' ');
}

function StatusBadge({ status }) {
  const map = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  const defaultClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  const normalizedStatus = status?.trim() || '';
  const cls = normalizedStatus ? (map[normalizedStatus] || defaultClass) : defaultClass;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {normalizedStatus || '—'}
    </span>
  );
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  const addr = order.customerInfo || {};
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Order ID</p>
          <p className="text-white font-mono text-sm mt-0.5">{order._id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Created Date</p>
          <p className="text-slate-200 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Customer</p>
          <p className="text-slate-200 text-sm">{addr.fullName || '—'}</p>
          <p className="text-slate-400 text-xs">{addr.email || '—'}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Shipping Address</p>
        <div className="text-slate-300 text-sm bg-slate-900/40 border border-slate-700/60 rounded-xl p-4">
          {addr.address ? (
            <p>{formatAddress(addr)}</p>
          ) : '—'}
        </div>
      </div>

      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Items</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="text-left py-2 text-slate-500 font-medium">Title</th>
                <th className="text-right py-2 text-slate-500 font-medium">Price</th>
                <th className="text-right py-2 text-slate-500 font-medium">Author</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx} className="border-b border-slate-700/30">
                  <td className="py-2 text-slate-200">{item.title || '—'}</td>
                  <td className="py-2 text-right text-slate-300">{formatCurrency(item.price)}</td>
                  <td className="py-2 text-right text-slate-400">{item.author || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-slate-700/60 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-slate-200">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Tax</span>
          <span className="text-slate-200">{formatCurrency(order.tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Discount</span>
          <span className="text-red-400">-{formatCurrency(order.discount)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-700/60">
          <span className="text-white">Total</span>
          <span className="text-amber-400">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ordersService.getAll({ page: currentPage, limit: pageSize, dateRange });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
      setCurrentPage(res.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, dateRange]);

  const handleViewOrder = async (id) => {
    setModalLoading(true);
    setSelectedOrder(null);
    try {
      const order = await ordersService.getById(id);
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setModalLoading(false);
    }
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, total);

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-400" /> Orders
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Manage and review customer orders.</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}
              className="admin-input w-auto"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
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
          <div className="text-center py-12 text-slate-400 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No orders found for the selected range.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="font-mono text-xs text-slate-300">{order._id}</td>
                      <td className="text-slate-200">{order.customerInfo?.fullName || '—'}</td>
                      <td className="text-slate-400 text-sm">{order.customerInfo?.email || '—'}</td>
                      <td className="text-slate-300 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="text-slate-300 text-sm">{order.items?.length || 0}</td>
                      <td className="text-slate-200 font-medium">{formatCurrency(order.total)}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="admin-icon-btn text-slate-400 hover:text-amber-400"
                          aria-label="View order"
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
        isOpen={!!selectedOrder || modalLoading}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        maxWidth="max-w-3xl"
      >
        {modalLoading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading order details...</div>
        ) : (
          selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AdminModal>
    </div>
  );
}

export default AdminOrders;
