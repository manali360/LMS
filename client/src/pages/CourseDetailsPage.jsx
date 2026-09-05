import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Clock, BookOpen, Users, CheckCircle2, ShieldCheck, 
  Play, Lock, FileText, ChevronDown, ChevronUp, Sparkles, Heart, ArrowRight, Loader2 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSection, setExpandedSection] = useState(0);
  const [reviews, setReviews] = useState([]);

  // User review input
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.success) {
          setCourse(res.data);
        }

        // Fetch reviews
        const revRes = await api.get(`/reviews/course/${id}`);
        if (revRes.success) {
          setReviews(revRes.data || []);
        }

        // Check enrollment status if user logged in
        if (isAuthenticated) {
          const checkRes = await api.get(`/enrollments/check/${id}`);
          if (checkRes.success) {
            setIsEnrolled(checkRes.isEnrolled);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  // Handle Enrollment / Purchase
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (course.price > 0 && !course.isFree) {
      // Redirect to checkout page
      navigate(`/checkout/${course._id}`);
      return;
    }

    // Free Course Instant Enrollment
    setEnrolling(true);
    try {
      const res = await api.post(`/enrollments/${course._id}`);
      if (res.success) {
        setIsEnrolled(true);
        navigate(`/learning/${course._id}`);
      }
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/wishlist/toggle/${course._id}`);
      if (res.success) {
        setIsWishlisted(res.isWishlisted);
      }
    } catch (err) {
      console.error('Wishlist error');
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        courseId: course._id,
        rating: newRating,
        comment: newComment,
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        alert('Thank you! Your review has been published.');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading course breakdown...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold font-outfit text-white">Course Not Found</h2>
        <Link to="/courses"><Button variant="primary">Browse Marketplace</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900/80 border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Details Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                  {course.category?.name || 'General'}
                </span>
                <span className="text-xs text-slate-400 font-medium">{course.level}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {course.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <strong className="text-white text-sm">{course.averageRating || 5.0}</strong> ({course.ratingsCount || 0} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-pink-400" /> {course.totalStudents || 0} Students Enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" /> {course.duration || '24 Hours'}
                </span>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={course.instructor?.name}
                  className="w-10 h-10 rounded-full border border-indigo-500/40 object-cover"
                />
                <div className="text-xs">
                  <div className="text-slate-400">Created by</div>
                  <div className="text-sm font-bold text-white font-outfit">{course.instructor?.name}</div>
                </div>
              </div>
            </div>

            {/* Floating Enrolment Card Column */}
            <div className="lg:col-span-4">
              <div className="glass-card p-6 rounded-3xl border-slate-800 shadow-2xl space-y-6">
                
                {/* Media Preview */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold font-outfit text-white">
                    {course.isFree ? 'FREE' : `$${course.price}`}
                  </div>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-500' : ''}`} />
                  </button>
                </div>

                {/* CTA Action */}
                {isEnrolled ? (
                  <Link to={`/learning/${course._id}`}>
                    <Button variant="gradient" fullWidth size="lg" icon={Play}>
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="gradient"
                    fullWidth
                    size="lg"
                    disabled={enrolling}
                    onClick={handleEnroll}
                    icon={Sparkles}
                  >
                    {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll Now (Free)' : `Enroll Now ($${course.price})`}
                  </Button>
                )}

                <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Lifetime Access
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Access on Mobile & Desktop
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified PDF Certificate of Completion
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BODY CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Learning Objectives */}
        {course.learningObjectives && course.learningObjectives.length > 0 && (
          <section className="p-8 glass-panel rounded-3xl border-slate-800 space-y-4">
            <h3 className="text-xl font-bold font-outfit text-white">What You Will Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Course Curriculum Accordion */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-outfit text-white">Course Curriculum</h3>
            <span className="text-xs text-slate-400">
              {course.sections?.length || 0} Sections
            </span>
          </div>

          <div className="space-y-3">
            {course.sections && course.sections.map((section, idx) => (
              <div key={section._id || idx} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                
                {/* Section Header Accordion Button */}
                <button
                  onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-outfit text-white">{section.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {section.lectures?.length || 0} Lectures {section.quiz ? '• 1 Quiz' : ''} {section.assignment ? '• 1 Assignment' : ''}
                      </p>
                    </div>
                  </div>
                  {expandedSection === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {/* Section Lectures List */}
                {expandedSection === idx && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
                    {section.lectures && section.lectures.map((lec) => (
                      <div key={lec._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-300">
                          <Play className="w-4 h-4 text-indigo-400" />
                          <span>{lec.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <span>{lec.duration || '10:00'}</span>
                          {lec.isFreePreview ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Preview</span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </section>

        {/* Reviews & Student Ratings */}
        <section className="space-y-6 pt-6 border-t border-slate-800">
          <h3 className="text-2xl font-bold font-outfit text-white">Student Reviews</h3>

          {/* Add Review Form for Enrolled Students */}
          {isAuthenticated && isEnrolled && (
            <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white font-outfit">Leave a Course Review</h4>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your learning experience..."
                rows={3}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />

              <Button type="submit" variant="primary" size="sm" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Publishing...' : 'Submit Review'}
              </Button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews yet for this course. Be the first to leave feedback!</p>
            ) : (
              reviews.map((rev, i) => (
                <div key={rev._id || i} className="p-4 glass-card rounded-2xl border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} alt={rev.student?.name} className="w-8 h-8 rounded-full" />
                      <span className="text-xs font-bold text-white font-outfit">{rev.student?.name || 'Student'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </section>

      </div>

    </div>
  );
};

export default CourseDetailsPage;
