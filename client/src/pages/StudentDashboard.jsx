import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle2, Play, Clock, Sparkles, Star, ArrowRight, Loader2, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments');
        if (res.success) {
          setEnrollments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progressPercentage === 100 || e.isCompleted).length;
  const inProgressCourses = totalCourses - completedCourses;

  // Chart data
  const activityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.0 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 5.2 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 6.0 },
    { day: 'Sun', hours: 4.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-950 border border-indigo-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Student Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
            Welcome back, <span className="gradient-text-indigo">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Track your ongoing masterclasses, take timed quizzes, submit assignments, and claim your verified certificates.
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 glass-panel rounded-2xl border border-slate-800/80 flex items-center gap-4 hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">{totalCourses}</div>
            <div className="text-xs font-medium text-slate-400">Total Enrolled</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800/80 flex items-center gap-4 hover:border-purple-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">{inProgressCourses}</div>
            <div className="text-xs font-medium text-slate-400">In Progress</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800/80 flex items-center gap-4 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">{completedCourses}</div>
            <div className="text-xs font-medium text-slate-400">Completed</div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800/80 flex items-center gap-4 hover:border-amber-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">{completedCourses}</div>
            <div className="text-xs font-medium text-slate-400">Certificates Earned</div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Learning Activity Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" /> Weekly Learning Velocity
            </h3>
            <span className="text-xs font-medium text-slate-400">Hours spent this week</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continue Learning Feature Box */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-outfit">Resume Study</span>
            <h3 className="text-lg font-bold font-outfit text-white">Continue Learning</h3>

            {enrollments.length > 0 && enrollments[0]?.course ? (
              <div className="p-4 glass-card rounded-2xl space-y-3 border border-indigo-500/20">
                <h4 className="text-sm font-bold font-outfit text-white">{enrollments[0].course.title}</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Course Progress</span>
                    <span className="font-bold text-indigo-400">{enrollments[0].progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${enrollments[0].progressPercentage}%` }}></div>
                  </div>
                </div>
                <Link to={`/learning/${enrollments[0].course._id}`}>
                  <Button variant="gradient" size="sm" fullWidth icon={Play} className="mt-2">
                    Resume Lecture
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                You are not currently enrolled in any course. Discover top-rated masterclasses in the catalog!
              </p>
            )}
          </div>

          <Link to="/courses">
            <Button variant="outline" size="sm" fullWidth icon={ArrowRight}>
              Browse More Courses
            </Button>
          </Link>
        </div>

      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-outfit text-white">My Enrolled Courses</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-10 text-center glass-panel rounded-3xl border border-slate-800/80 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold font-outfit text-white">You haven't enrolled in any courses yet</h4>
              <p className="text-xs text-slate-400">Explore our professional masterclasses and start your learning journey today.</p>
            </div>
            <Link to="/courses" className="inline-block pt-1">
              <Button variant="gradient" size="md" icon={ArrowRight}>
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => (
              <div key={item._id} className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <img src={item.course?.thumbnail} alt={item.course?.title} className="w-full h-36 object-cover rounded-xl" />
                  <h4 className="text-sm font-bold font-outfit text-white line-clamp-1">{item.course?.title}</h4>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span className="font-semibold text-white">{item.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <Link to={`/learning/${item.course?._id}`} className="flex-1">
                    <Button variant="gradient" size="sm" fullWidth icon={Play}>
                      Go to Course
                    </Button>
                  </Link>

                  {item.progressPercentage === 100 && (
                    <Link to={`/certificate/${item.course?._id}`}>
                      <Button variant="outline" size="sm" icon={Award} title="View Certificate" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;
