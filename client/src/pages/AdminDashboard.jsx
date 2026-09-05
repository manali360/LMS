import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckCircle, XCircle, ShieldCheck, AlertCircle, BarChart3, Lock, Loader2, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'users'

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.success) setStats(statsRes.data);

      const coursesRes = await api.get('/admin/courses');
      if (coursesRes.success) setCourses(coursesRes.data || []);

      const usersRes = await api.get('/admin/users');
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-suspend`);
      if (res.success) {
        alert(res.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleUpdateCourseStatus = async (courseId, newStatus) => {
    try {
      const res = await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      if (res.success) {
        alert(res.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading admin control panel...</p>
      </div>
    );
  }

  const { totalUsers = 0, totalStudents = 0, totalInstructors = 0, totalCourses = 0, totalEnrollments = 0, pendingCourses = 0 } = stats || {};

  const chartData = [
    { name: 'Students', count: totalStudents },
    { name: 'Instructors', count: totalInstructors },
    { name: 'Courses', count: totalCourses },
    { name: 'Enrollments', count: totalEnrollments },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-pink-400 font-outfit">Platform Governance</span>
        <h1 className="text-3xl font-extrabold font-outfit text-white">Admin Control Panel</h1>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{totalUsers}</div>
            <div className="text-xs text-slate-400">Total Registered Users</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{totalCourses}</div>
            <div className="text-xs text-slate-400">Total Courses</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{pendingCourses}</div>
            <div className="text-xs text-slate-400">Pending Approvals</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{totalEnrollments}</div>
            <div className="text-xs text-slate-400">Total Enrollments</div>
          </div>
        </div>
      </div>

      {/* Overview Recharts */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-pink-400" /> Platform Growth Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs for Course Approvals & User Governance */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('courses')}
            className={`text-sm font-bold font-outfit pb-1 transition-colors cursor-pointer ${
              activeTab === 'courses' ? 'text-pink-400 border-b-2 border-pink-500' : 'text-slate-400'
            }`}
          >
            Course Approvals ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`text-sm font-bold font-outfit pb-1 transition-colors cursor-pointer ${
              activeTab === 'users' ? 'text-pink-400 border-b-2 border-pink-500' : 'text-slate-400'
            }`}
          >
            User Governance ({users.length})
          </button>
        </div>

        {/* Tab 1: Course Approvals */}
        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-white font-outfit">{course.title}</td>
                    <td className="p-3">{course.instructor?.name || 'N/A'}</td>
                    <td className="p-3">{course.category?.name || 'General'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        course.approvalStatus === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : course.approvalStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {course.approvalStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {course.approvalStatus !== 'published' && (
                        <button
                          onClick={() => handleUpdateCourseStatus(course._id, 'published')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500"
                        >
                          Approve
                        </button>
                      )}
                      {course.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateCourseStatus(course._id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: User Governance */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Account Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 uppercase font-bold text-indigo-400">{u.role}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.isSuspended ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspend(u._id)}
                          className={`px-3 py-1 rounded-lg font-semibold ${
                            u.isSuspended ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                          }`}
                        >
                          {u.isSuspended ? 'Activate Account' : 'Suspend User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
