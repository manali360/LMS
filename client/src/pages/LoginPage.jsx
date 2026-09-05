import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const InputField = ({ label, type, name, value, onChange, placeholder, icon: Icon, extra }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      {extra}
    </div>
    <div className="relative">
      {Icon && (
        <Icon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      )}
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
          Icon ? 'pl-10 pr-4' : 'px-4'
        }`}
      />
    </div>
  </div>
);

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      const role = res.data.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Incorrect email or password.');
    }
  };

  const fillDemo = (email, role) => {
    setFormData({ email, password: 'password123' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold font-outfit text-white">Welcome back</h1>
            <p className="text-xs text-slate-400">Log in to continue your learning journey</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              disabled={loading}
              icon={loading ? Loader2 : ArrowRight}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
              Quick Demo Accounts
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('student1@learnpulse.com', 'student')}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-center font-medium transition-colors cursor-pointer"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('alex@learnpulse.com', 'instructor')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-center font-medium transition-colors cursor-pointer"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@learnpulse.com', 'admin')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-center font-medium transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
