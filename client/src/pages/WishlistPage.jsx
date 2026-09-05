import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Users, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const WishlistPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await api.post(`/wishlist/toggle/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error('Failed to remove course from wishlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-pink-400 font-outfit">Bookmarks</span>
        <h1 className="text-3xl font-extrabold font-outfit text-white flex items-center gap-2">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" /> My Saved Wishlist
        </h1>
        <p className="text-slate-400 text-sm">Courses you bookmarked to enroll in later.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold font-outfit text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400">Explore the marketplace to bookmark your favorite courses.</p>
          <Link to="/courses"><Button variant="primary">Browse Courses</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between h-full">
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <strong className="text-slate-200">{course.averageRating || 5.0}</strong>
                    </span>
                    <span className="font-bold text-indigo-400">{course.isFree ? 'FREE' : `$${course.price}`}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-outfit line-clamp-2">{course.title}</h3>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link to={`/courses/${course._id}`}>
                  <Button variant="gradient" size="sm" fullWidth icon={ArrowRight}>
                    View & Enroll
                  </Button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
