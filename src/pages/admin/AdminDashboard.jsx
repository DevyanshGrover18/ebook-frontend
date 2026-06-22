import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Tag, HelpCircle, TrendingUp, ClipboardList } from 'lucide-react';
import { booksService, categoriesService, faqsService } from '../../services/api.js';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-800 border border-slate-700/60">
      <div className={`w-11 h-11 shrink-0 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5 leading-none">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ books: null, categories: null, faqs: null });

  useEffect(() => {
    Promise.allSettled([
      booksService.getAll(),
      categoriesService.getAll(),
      faqsService.getAll(),
    ]).then(([b, c, f]) => {
      setStats({
        books: b.status === 'fulfilled' ? b.value.length : '—',
        categories: c.status === 'fulfilled' ? c.value.length : '—',
        faqs: f.status === 'fulfilled' ? f.value.length : '—',
      });
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, admin. Here's an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={BookOpen} label="Total Books" value={stats.books} color="text-blue-400 bg-blue-400/10" />
        <StatCard icon={Tag} label="Categories" value={stats.categories} color="text-amber-400 bg-amber-400/10" />
        <StatCard icon={HelpCircle} label="FAQs" value={stats.faqs} color="text-emerald-400 bg-emerald-400/10" />
      </div>

      {/* Quick links */}
      <div className="p-6 rounded-xl bg-slate-800 border border-slate-700/60">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: '/admin/books', label: 'Manage Books', icon: BookOpen },
            { href: '/admin/categories', label: 'Manage Categories', icon: Tag },
            { href: '/admin/faqs', label: 'Manage FAQs', icon: HelpCircle },
            { href: '/admin/orders', label: 'Manage Orders', icon: ClipboardList },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-amber-500/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
            >
              <Icon className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-slate-200 font-medium text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;