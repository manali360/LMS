import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

const CourseCardPreview = ({ course }) => {
  const {
    _id = 1,
    title = 'Full-Stack Web Development Bootcamp',
    instructor = 'Alex Rivera',
    category = 'Web Development',
    level = 'All Levels',
    rating = 4.8,
    reviewsCount = 2341,
    studentsCount = 12500,
    duration = '32 total hours',
    price = 49.99,
    isFree = false,
    thumbnail = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  } = course || {};

  const instructorName = typeof instructor === 'object' ? instructor?.name : instructor;
  const categoryName = typeof category === 'object' ? category?.name : category;

  const fullStars = Math.floor(rating);

  return (
    <Link to={`/courses/${_id}`} className="block h-full no-underline">
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group shadow-lg">
        
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
              {level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              {categoryName}
            </div>

            <h3 className="text-base font-bold font-outfit text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>

            <p className="text-xs text-slate-400 font-medium">
              By <span className="text-slate-300">{instructorName}</span>
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            {/* Rating & Meta */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-400">{rating}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= fullStars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">({reviewsCount.toLocaleString()})</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock size={12} className="text-indigo-400" />
                <span>{duration}</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-lg font-extrabold font-outfit text-white">
                {isFree ? (
                  <span className="text-emerald-400">Free</span>
                ) : (
                  <span>${price}</span>
                )}
              </div>

              <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                Details &rarr;
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default CourseCardPreview;
