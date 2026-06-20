import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Lock, User, AlertCircle, BookOpen, Shield } from 'lucide-react';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="admin-login-bg min-h-screen flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="admin-blob admin-blob-1" />
      <div className="admin-blob admin-blob-2" />

      <div className="admin-login-card">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="admin-logo-ring mb-4">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Lexis &amp; Juris</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Control Panel</p>
        </div>

        {/* Divider */}
        <div className="admin-divider mb-8">
          <Shield className="w-4 h-4 text-amber-400/60" />
          <span className="text-xs text-slate-500 tracking-widest uppercase">Secure Access</span>
          <Shield className="w-4 h-4 text-amber-400/60" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="admin-input pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="admin-input pl-10"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="admin-error-banner">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="admin-login-submit"
            type="submit"
            disabled={isLoading}
            className="admin-btn-primary w-full py-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
                Authenticating…
              </span>
            ) : (
              'Sign In to Admin Panel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
