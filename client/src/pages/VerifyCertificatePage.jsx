import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, XCircle, Search, CheckCircle2, Award, Calendar, User, BookOpen } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const VerifyCertificatePage = () => {
  const { certificateId: paramId } = useParams();
  const [certIdInput, setCertIdInput] = useState(paramId || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyId = async (idToVerify) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const res = await api.get(`/certificates/verify/${idToVerify.trim()}`);
      if (res.success && res.verified) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Certificate ID could not be verified in the LearnPulse public database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      verifyId(paramId);
    }
  }, [paramId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyId(certIdInput);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold font-outfit text-white">Public Certificate Verification</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Enter any LearnPulse Certificate ID below to verify its authenticity and student accreditation record.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-2 glass-panel rounded-2xl border-slate-800 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={certIdInput}
            onChange={(e) => setCertIdInput(e.target.value)}
            placeholder="e.g. LP-A8K2F9-2026"
            className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="gradient" size="md" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Credential'}
        </Button>
      </form>

      {/* Verification Output Card */}
      {verificationResult && (
        <div className="glass-panel p-8 rounded-3xl border-emerald-500/30 space-y-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authenticated & Valid
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-mono uppercase">Certificate ID: {verificationResult.certificateId}</div>
            <h2 className="text-2xl font-bold font-outfit text-white">{verificationResult.studentName}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-400" /> Course Completed</span>
              <div className="font-bold text-white text-sm">{verificationResult.courseTitle}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400" /> Instructor</span>
              <div className="font-bold text-white text-sm">{verificationResult.instructorName}</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Issued on {new Date(verificationResult.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 glass-panel rounded-3xl border-rose-500/30 text-center space-y-3">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold font-outfit text-white">Verification Failed</h3>
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      )}

    </div>
  );
};

export default VerifyCertificatePage;
