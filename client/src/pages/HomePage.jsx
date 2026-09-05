import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, Users, Award, Star, Sparkles, Play, ShieldCheck, Zap } from 'lucide-react';
import CourseCardPreview from '../components/common/CourseCardPreview';
import Button from '../components/common/Button';

/* ── Static Demo Data ─────────────────────────────────────────────── */
const FEATURED_COURSES = [
  {
    _id: '67c870000000000000000001',
    title: 'Full-Stack MERN Mastery: From Architecture to Cloud Deployment',
    instructor: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop' },
    category: 'Web Development',
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 8400,
    duration: '42.5 hours',
    price: 34.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '67c870000000000000000002',
    title: 'Python for AI & Data Science: NumPy, Pandas, Scikit-Learn',
    instructor: { name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop' },
    category: 'Data Science',
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 3120,
    studentsCount: 19400,
    duration: '28.0 hours',
    price: 29.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '67c870000000000000000003',
    title: 'Deep Learning & Neural Networks with PyTorch 2.0',
    instructor: { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' },
    category: 'Machine Learning',
    level: 'Advanced',
    rating: 4.9,
    reviewsCount: 980,
    studentsCount: 6200,
    duration: '36.0 hours',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '67c870000000000000000004',
    title: 'Cloud Architecture & DevOps: AWS, Docker, Kubernetes',
    instructor: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop' },
    category: 'Cloud Computing',
    level: 'Intermediate',
    rating: 4.7,
    reviewsCount: 1650,
    studentsCount: 7800,
    duration: '31.5 hours',
    price: 39.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  },
];

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing'];

const TOPICS = [
  { name: 'React 19 & Next.js', count: '14.2K learners' },
  { name: 'Python for AI', count: '48.1K learners' },
  { name: 'Node.js Microservices', count: '12.8K learners' },
  { name: 'Machine Learning & LLMs', count: '29.5K learners' },
  { name: 'AWS & Kubernetes', count: '18.3K learners' },
  { name: 'Tailwind CSS & UI Design', count: '22.0K learners' },
];

const HomePage = () => {
  const [activeCat, setActiveCat] = useState('All');

  const filteredCourses = activeCat === 'All'
    ? FEATURED_COURSES
    : FEATURED_COURSES.filter(c => c.category === activeCat);

  return (
    <div className="space-y-20 pb-20">

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-950 to-[#0b0f19] border-b border-slate-800/60 py-16 sm:py-24">
        {/* Glow orb background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Generation Learning Experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-outfit text-white tracking-tight leading-[1.15]">
                Master High-Demand Skills with <span className="gradient-text-indigo">LearnPulse</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Join thousands of software engineers, data scientists, and creators mastering real-world skills with hands-on projects, interactive quizzes, and verifiable certificates.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/courses">
                  <Button variant="gradient" size="lg" icon={ArrowRight}>
                    Explore Masterclasses
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Join for Free
                  </Button>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-outfit text-white">12M+</div>
                  <div className="text-xs text-indigo-400 font-medium">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-outfit text-white">180+</div>
                  <div className="text-xs text-purple-400 font-medium">Expert Courses</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-outfit text-white">99%</div>
                  <div className="text-xs text-emerald-400 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-950/50 group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=85"
                  alt="Students collaborating"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>

              {/* Floating Certificate Badge */}
              <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 border border-indigo-500/30 flex items-center gap-3.5 shadow-2xl backdrop-blur-xl">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold font-outfit text-white">Verifiable PDF Certificates</div>
                  <div className="text-[11px] text-indigo-300">Issued upon 100% completion</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUSTED BY LOGOS ────────────────────────────── */}
      <section className="border-y border-slate-800/60 py-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trusted by teams at top companies
          </span>
          <div className="flex flex-wrap items-center gap-8 text-slate-400 font-bold text-sm tracking-wider">
            {['GOOGLE', 'MICROSOFT', 'AMAZON', 'SPOTIFY', 'NETFLIX', 'UBER'].map((brand) => (
              <span key={brand} className="hover:text-white transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR COURSES SECTION ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-outfit">Curated Selection</span>
            <h2 className="text-3xl font-extrabold font-outfit text-white tracking-tight">
              Featured Masterclasses
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Comprehensive courses designed by industry practitioners to take you from foundational concepts to production ready.
            </p>
          </div>

          <Link to="/courses">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              Explore All Courses
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'glass-panel text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCardPreview key={course._id} course={course} />
          ))}
        </div>

      </section>

      {/* ── POPULAR SKILLS CLOUD ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-outfit">Skills & Frameworks</span>
          <h2 className="text-2xl font-bold font-outfit text-white">Popular Learning Paths</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TOPICS.map((t) => (
            <Link key={t.name} to={`/courses?search=${encodeURIComponent(t.name)}`} className="no-underline">
              <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-indigo-500/40 text-center space-y-1 transition-all group">
                <div className="text-xs font-bold font-outfit text-white group-hover:text-indigo-300 transition-colors">
                  {t.name}
                </div>
                <div className="text-[11px] text-slate-500">{t.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-10 sm:p-14 glass-panel border border-indigo-500/30 overflow-hidden bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-950 text-center space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mx-auto">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Transform Your Career Today
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-white tracking-tight max-w-2xl mx-auto">
            Ready to build real skills and earn verifiable credentials?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Get unlimited access to video lectures, code walkthroughs, automated quiz grading, and certificate verification.
          </p>

          <div className="pt-2">
            <Link to="/register">
              <Button variant="gradient" size="lg" icon={ArrowRight}>
                Get Started Now — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
