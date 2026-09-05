import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2, Sparkles, Image, DollarSign } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CourseBuilderPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    requirements: [''],
    learningObjectives: [''],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, field) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setError('Please complete title, description, and category fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/courses', {
        ...formData,
        requirements: formData.requirements.filter(Boolean),
        learningObjectives: formData.learningObjectives.filter(Boolean),
      });

      if (res.success) {
        alert('🎉 Course created successfully!');
        navigate('/instructor/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/instructor/dashboard')}>
            Back to Studio
          </Button>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-outfit">Course Builder Studio</span>
            <h1 className="text-2xl font-extrabold font-outfit text-white">Create New Masterclass</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Basic Course Information */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-outfit text-white">1. Basic Information</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Course Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Master React & Redux Toolkit Complete Guide"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Course Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary of what students will master..."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Difficulty Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Price (USD)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Thumbnail Image URL</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-outfit text-white">2. What Students Will Learn</h3>
            <Button type="button" variant="outline" size="sm" icon={Plus} onClick={() => addArrayItem('learningObjectives')}>Add Objective</Button>
          </div>

          {formData.learningObjectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={obj}
                onChange={(e) => handleArrayChange(i, e.target.value, 'learningObjectives')}
                placeholder={`Objective ${i + 1}`}
                className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
              {formData.learningObjectives.length > 1 && (
                <button type="button" onClick={() => removeArrayItem(i, 'learningObjectives')} className="p-2 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => navigate('/instructor/dashboard')}>Cancel</Button>
          <Button type="submit" variant="gradient" size="lg" disabled={loading} icon={Sparkles}>
            {loading ? 'Publishing...' : 'Publish Course'}
          </Button>
        </div>

      </form>

    </div>
  );
};

export default CourseBuilderPage;
