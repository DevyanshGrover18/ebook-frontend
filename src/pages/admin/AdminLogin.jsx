import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Lock, User, AlertCircle, BookOpen, Scale } from 'lucide-react';

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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#0B0F1A] overflow-hidden">
      {/* Faint ruled-ledger background texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #C9A24B 27px, #C9A24B 28px)',
        }}
      />
      {/* Soft vignette behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(201,162,75,0.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#131826]/90 backdrop-blur-sm border border-[#2A3142] rounded-xl shadow-2xl shadow-black/60 p-8 sm:p-10">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4 w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#C9A24B]/30" />
            <div className="absolute inset-[5px] rounded-full border border-[#C9A24B]/50" />
            <BookOpen className="w-6 h-6 text-[#C9A24B] relative" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#EDEAE2]">
            Lexis <span className="text-[#C9A24B]">&amp;</span> Juris
          </h1>
          <p className="text-[#8891A3] text-[11px] uppercase tracking-[0.2em] mt-2">
            Admin Control Panel
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <span className="flex-1 h-px bg-[#2A3142]" />
          <Scale className="w-3.5 h-3.5 text-[#C9A24B]/70" />
          <span className="text-[10px] text-[#8891A3] tracking-[0.25em] uppercase whitespace-nowrap">
            Secure Access
          </span>
          <Scale className="w-3.5 h-3.5 text-[#C9A24B]/70" />
          <span className="flex-1 h-px bg-[#2A3142]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="admin-username"
              className="block text-[11px] uppercase tracking-[0.15em] font-medium text-[#8891A3] mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6478]" />
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F1A]/60 border border-[#2A3142] rounded-md text-[#EDEAE2] placeholder-[#5C6478] focus:outline-none focus:border-[#C9A24B]/60 focus:ring-1 focus:ring-[#C9A24B]/30 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] uppercase tracking-[0.15em] font-medium text-[#8891A3] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6478]" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 bg-[#0B0F1A]/60 border border-[#2A3142] rounded-md text-[#EDEAE2] placeholder-[#5C6478] focus:outline-none focus:border-[#C9A24B]/60 focus:ring-1 focus:ring-[#C9A24B]/30 transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 bg-[#E2675A]/10 border border-[#E2675A]/30 text-[#E2675A] rounded-md px-4 py-3 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="admin-login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-md bg-[#C9A24B] hover:bg-[#D9B459] text-[#0B0F1A] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131826]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0B0F1A]/40 border-t-[#0B0F1A] rounded-full animate-spin" />
                Authenticating…
              </span>
            ) : (
              'Sign In to Admin Panel'
            )}
          </button>
        </form>

        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#5C6478] mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;