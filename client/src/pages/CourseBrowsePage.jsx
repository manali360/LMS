import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, Star, Clock, Users, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CourseBrowsePage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOption, setSortOption] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLevel !== 'All') params.append('level', selectedLevel);
      if (priceFilter !== 'all') params.append('priceType', priceFilter);
      if (sortOption) params.append('sort', sortOption);
      params.append('page', page);
      params.append('limit', 8);

      const res = await api.get(`/courses?${params.toString()}`);
      if (res.success) {
        setCourses(res.data || []);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedLevel, priceFilter, sortOption, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-outfit">Marketplace Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">Explore Professional Courses</h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Discover top-tier educational courses. Filter by category, difficulty level, and price to find your next skill.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, instructor, skill..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => { setPriceFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="all">All Prices</option>
            <option value="free">Free Courses</option>
            <option value="paid">Paid Courses</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="latest">Sort: Newest First</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => { setSelectedCategory('All'); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat._id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-400">Fetching courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold font-outfit text-white">No Courses Found</h3>
          <p className="text-xs text-slate-400">Try refining your search query or reset category filters.</p>
          <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); setPriceFilter('all'); }}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300">
              
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-indigo-300 border border-indigo-500/30">
                  {course.category?.name || 'Education'}
                </span>
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  course.isFree ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-indigo-600 text-white'
                }`}>
                  {course.isFree ? 'FREE' : `$${course.price}`}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <strong className="text-slate-200">{course.averageRating || 5.0}</strong> ({course.ratingsCount || 0})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-outfit line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    By <span className="text-slate-300">{course.instructor?.name || 'Instructor'}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {course.duration || '12h'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-pink-400" /> {course.totalStudents || 0}
                  </span>
                </div>

                <Link to={`/courses/${course._id}`}>
                  <Button variant="secondary" size="sm" fullWidth icon={ArrowRight} className="group-hover:bg-indigo-600 group-hover:text-white">
                    View Course
                  </Button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-xs font-semibold text-slate-300 flex items-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

    </div>
  );
};

export default CourseBrowsePage;
