import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/courses?search=${encodeURIComponent(search.trim())}`);
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'instructor') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }} className="sticky top-0 z-50">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#1a8754', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', letterSpacing: '-0.3px' }}>
              Learn<span style={{ color: '#1a8754' }}>Pulse</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480 }} className="hidden md:block">
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for anything"
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  border: '1px solid #9e9e9e',
                  borderRadius: 24,
                  fontSize: 14,
                  color: '#1c1d1f',
                  background: '#fff',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#1a8754'}
                onBlur={e => e.target.style.borderColor = '#9e9e9e'}
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            <Link to="/courses" style={{
              fontSize: 14, fontWeight: 500, color: '#1c1d1f',
              textDecoration: 'none', whiteSpace: 'nowrap'
            }}
              onMouseEnter={e => e.target.style.color = '#1a8754'}
              onMouseLeave={e => e.target.style.color = '#1c1d1f'}
            >
              Browse Courses
            </Link>
          </nav>

          {/* Auth */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 4,
                    border: '1px solid #1a8754', background: '#fff',
                    color: '#1a8754', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer'
                  }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </button>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'}
                    alt={user?.name}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1fae5' }}
                  />
                  <div style={{ fontSize: 13, lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600, color: '#1c1d1f' }}>{user?.name?.split(' ')[0]}</div>
                    <div style={{ color: '#1a8754', fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>{user?.role}</div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 12px', borderRadius: 4, border: '1px solid #e8e8e8',
                    background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer'
                  }}
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button style={{
                    padding: '9px 18px', borderRadius: 4,
                    border: '1px solid #1c1d1f', background: '#fff',
                    color: '#1c1d1f', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                    Log in
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{
                    padding: '9px 18px', borderRadius: 4,
                    border: '1px solid #7c3aed', background: '#7c3aed',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ padding: 6, background: 'none', border: 'none', color: '#1c1d1f', marginLeft: 'auto' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '16px 24px 24px' }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for anything"
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #9e9e9e', borderRadius: 4, fontSize: 14
              }}
            />
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link to="/" onClick={() => setMobileOpen(false)} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 500, color: '#1c1d1f', borderBottom: '1px solid #f5f5f5' }}>Home</Link>
            <Link to="/courses" onClick={() => setMobileOpen(false)} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 500, color: '#1c1d1f', borderBottom: '1px solid #f5f5f5' }}>Browse Courses</Link>
            {!isAuthenticated ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', border: '1px solid #1c1d1f', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#fff', color: '#1c1d1f' }}>Log in</button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#7c3aed', color: '#fff' }}>Sign up</button>
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)}>
                  <button style={{ width: '100%', padding: '10px', border: '1px solid #1a8754', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#fff', color: '#1a8754', marginBottom: 10 }}>Dashboard</button>
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} style={{ width: '100%', padding: '10px', border: '1px solid #e8e8e8', borderRadius: 4, fontWeight: 600, fontSize: 14, background: '#fff', color: '#6b7280' }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
