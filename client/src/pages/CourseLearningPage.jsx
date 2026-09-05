import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, CheckCircle2, Circle, Lock, Download, FileText, 
  HelpCircle, ArrowLeft, ArrowRight, Award, Loader2, Sparkles, Check
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'resources', 'notes'
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Fetch Course & Progress
  useEffect(() => {
    const fetchLearningData = async () => {
      setLoading(true);
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        if (courseRes.success) {
          setCourse(courseRes.data);
          
          // Set initial lecture to first lecture of first section
          if (courseRes.data.sections && courseRes.data.sections.length > 0) {
            const firstSec = courseRes.data.sections[0];
            if (firstSec.lectures && firstSec.lectures.length > 0) {
              setCurrentLecture(firstSec.lectures[0]);
            }
          }
        }

        const progRes = await api.get(`/progress/${courseId}`);
        if (progRes.success) {
          setProgress(progRes.data);
        }
      } catch (err) {
        console.error('Failed to load video learning page:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  // Mark Lecture Completed
  const handleMarkCompleted = async () => {
    if (!currentLecture) return;
    setMarking(true);
    try {
      const res = await api.post(`/progress/${courseId}/complete-lecture`, {
        lectureId: currentLecture._id,
      });

      if (res.success) {
        setProgress(res.data);
        if (res.data.isCompleted) {
          alert('🎉 Congratulations! You have completed 100% of this course!');
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update lecture progress');
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = (lectureId) => {
    return progress?.completedLectures?.includes(lectureId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-slate-950">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Opening video workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Workspace Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/student/dashboard">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Dashboard
            </Button>
          </Link>
          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
          <h1 className="text-sm font-bold font-outfit text-white truncate max-w-md">
            {course?.title}
          </h1>
        </div>

        {/* Progress Bar Header Pill */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-300">
            <span>Course Progress</span>
            <div className="w-32 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress?.overallPercentage || 0}%` }}></div>
            </div>
            <span className="font-bold text-indigo-400">{progress?.overallPercentage || 0}%</span>
          </div>

          {progress?.isCompleted && (
            <Link to={`/certificate/${courseId}`}>
              <Button variant="gradient" size="sm" icon={Award}>
                View Certificate
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Learning Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VIDEO PLAYER & CONTENT MAIN PANEL */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          
          {/* Video Player */}
          {currentLecture ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                <video
                  src={currentLecture.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={course?.thumbnail}
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              </div>

              {/* Lecture Action Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 glass-panel rounded-2xl border-slate-800">
                <div>
                  <h2 className="text-lg font-bold font-outfit text-white">{currentLecture.title}</h2>
                  <p className="text-xs text-slate-400">Duration: {currentLecture.duration || '10:00'}</p>
                </div>

                <Button
                  variant={isCompleted(currentLecture._id) ? 'secondary' : 'gradient'}
                  size="md"
                  onClick={handleMarkCompleted}
                  disabled={marking}
                  icon={isCompleted(currentLecture._id) ? Check : CheckCircle2}
                >
                  {isCompleted(currentLecture._id) ? 'Completed ✓' : marking ? 'Updating...' : 'Mark as Completed'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
              <Play className="w-12 h-12 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-bold font-outfit text-white">Select a Lecture to Begin</h3>
              <p className="text-xs text-slate-400">Choose a lesson from the right section sidebar navigation.</p>
            </div>
          )}

          {/* Content Tabs (Overview, Resources, Notes) */}
          <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-sm font-bold font-outfit pb-1 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`text-sm font-bold font-outfit pb-1 transition-colors cursor-pointer ${
                  activeTab === 'resources' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Resources & Downloads ({currentLecture?.resources?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`text-sm font-bold font-outfit pb-1 transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Study Notes
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-3 text-sm text-slate-300">
                <p>{currentLecture?.description || 'In this lecture, you will master the core concepts covered in this module.'}</p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {currentLecture?.resources && currentLecture.resources.length > 0 ? (
                  currentLecture.resources.map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-200">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>{res.title}</span>
                      </div>
                      <a href={res.fileUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" icon={Download}>Download PDF</Button>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No downloadable files attached to this lecture.</p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Take timestamped notes while watching..."
                  rows={4}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                />
                <Button variant="secondary" size="sm" onClick={() => alert('Note saved locally!')}>Save Notes</Button>
              </div>
            )}
          </div>

        </div>

        {/* SIDEBAR NAVIGATION PANEL */}
        <div className="w-full lg:w-96 border-l border-slate-800 bg-slate-900/50 p-4 space-y-4 overflow-y-auto max-h-[85vh] lg:max-h-none">
          <h3 className="text-sm font-bold font-outfit text-white uppercase tracking-wider px-2">Course Curriculum</h3>

          <div className="space-y-3">
            {course?.sections && course.sections.map((section, sIdx) => (
              <div key={section._id || sIdx} className="glass-panel rounded-2xl border border-slate-800 p-3 space-y-2">
                <div className="text-xs font-bold font-outfit text-indigo-300">
                  Section {sIdx + 1}: {section.title}
                </div>

                {/* Lectures List */}
                <div className="space-y-1">
                  {section.lectures && section.lectures.map((lec) => (
                    <button
                      key={lec._id}
                      onClick={() => setCurrentLecture(lec)}
                      className={`w-full p-2.5 rounded-xl text-xs flex items-center justify-between text-left transition-all cursor-pointer ${
                        currentLecture?._id === lec._id
                          ? 'bg-indigo-600 text-white font-semibold shadow-md'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isCompleted(lec._id) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{lec.title}</span>
                      </div>
                      <span className="text-[10px] opacity-75">{lec.duration || '10:00'}</span>
                    </button>
                  ))}

                  {/* Section Quiz Link */}
                  {section.quiz && (
                    <Link to={`/quiz/${section.quiz._id || section.quiz}`}>
                      <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-between hover:bg-purple-600/30 transition-colors mt-2">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-purple-400" /> Section Quiz
                        </span>
                        <span>Take Quiz →</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseLearningPage;
