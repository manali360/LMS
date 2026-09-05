import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, DollarSign, Plus, Edit, Trash2, Eye, Loader2, Layers, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/instructor/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load instructor metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading instructor studio metrics...</p>
      </div>
    );
  }

  const { totalCourses = 0, totalStudents = 0, averageRating = 5.0, totalRevenue = 0, courses = [] } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-outfit">Instructor Studio</span>
          <h1 className="text-3xl font-extrabold font-outfit text-white">Course Management</h1>
        </div>

        <Link to="/instructor/course-builder">
          <Button variant="gradient" size="md" icon={Plus}>
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{totalCourses}</div>
            <div className="text-xs text-slate-400">Created Courses</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{totalStudents}</div>
            <div className="text-xs text-slate-400">Enrolled Students</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">{averageRating} / 5.0</div>
            <div className="text-xs text-slate-400">Average Rating</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-outfit text-white">${totalRevenue}</div>
            <div className="text-xs text-slate-400">Estimated Revenue</div>
          </div>
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
        <h3 className="text-lg font-bold font-outfit text-white">Your Courses Portfolio</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Course Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Students</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No courses built yet. Click "Create New Course" to launch your first masterclass!
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-white font-outfit">{course.title}</td>
                    <td className="p-3">{course.price === 0 ? 'FREE' : `$${course.price}`}</td>
                    <td className="p-3">{course.totalStudents || 0}</td>
                    <td className="p-3 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {course.averageRating || 5.0}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        course.approvalStatus === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : course.approvalStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {course.approvalStatus || 'published'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/courses/${course._id}`}>
                          <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white" title="Preview">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default InstructorDashboard;
