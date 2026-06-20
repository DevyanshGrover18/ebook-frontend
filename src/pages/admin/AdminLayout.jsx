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
    <div className="admin-shell">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-logo-ring-sm">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Lexis &amp; Juris</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
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
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto px-4 pb-6">
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
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
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
