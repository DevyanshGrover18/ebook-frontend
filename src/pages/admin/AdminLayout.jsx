import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/books', label: 'Books', icon: BookOpen },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
];

function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (fixed, w-64 — the only place sidebar width is defined) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">Lexis &amp; Juris</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white shrink-0"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3 px-3">
            Management
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'text-slate-300 border border-transparent hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 shrink-0">
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area (offset by sidebar width on lg+, nothing else) ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 h-16 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm shrink-0">
          <button
            className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-bold">A</span>
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;