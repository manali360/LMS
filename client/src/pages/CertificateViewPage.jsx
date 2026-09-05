import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ShieldCheck, Printer, Download, Share2, CheckCircle2, Loader2, GraduationCap } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CertificateViewPage = () => {
  const { courseId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certificates/${courseId}`);
        if (res.success) {
          setCertificate(res.data);
        }
      } catch (err) {
        console.error('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Rendering certificate...</p>
      </div>
    );
  }

  const certData = certificate || {
    certificateId: `LP-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`,
    student: { name: 'Learner Account' },
    course: { title: 'MERN Stack Development Masterclass' },
    instructor: { name: 'Alex Rivera', headline: 'Principal Software Architect' },
    issueDate: new Date(),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      {/* Control Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> Certificate of Completion
          </h1>
          <p className="text-xs text-slate-400">ID: {certData.certificateId}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>
            Print / Download PDF
          </Button>
          <Link to={`/verify-certificate/${certData.certificateId}`}>
            <Button variant="outline" size="sm" icon={ShieldCheck}>
              Public Verification
            </Button>
          </Link>
        </div>
      </div>

      {/* CERTIFICATE CANVAS FRAME */}
      <div className="relative p-10 md:p-16 bg-slate-900 border-8 border-indigo-500/30 rounded-3xl shadow-2xl space-y-8 text-center print:border-black print:bg-white print:text-black">
        
        {/* Certificate Watermark Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold font-outfit text-white tracking-tight print:text-black">
                Learn<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold block print:text-gray-600">
                Official Credential
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold print:border-emerald-600 print:text-emerald-700">
            <ShieldCheck className="w-4 h-4" /> VERIFIED ACADEMIC CREDENTIAL
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-6 py-6">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold font-outfit print:text-indigo-700">
            CERTIFICATE OF COMPLETION
          </h2>

          <p className="text-sm text-slate-400 print:text-gray-600">This document certifies that</p>

          <h3 className="text-3xl md:text-5xl font-extrabold font-outfit text-white gradient-text-indigo tracking-tight print:text-black">
            {certData.student?.name}
          </h3>

          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed print:text-gray-600">
            has successfully completed all lectures, assignments, and assessments for the masterclass
          </p>

          <h4 className="text-2xl md:text-3xl font-bold font-outfit text-white print:text-black">
            "{certData.course?.title}"
          </h4>
        </div>

        {/* Certificate Footer Details & Signatures */}
        <div className="pt-10 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 print:border-gray-300 print:text-gray-600">
          <div>
            <div className="font-bold text-white text-sm font-outfit print:text-black">{certData.instructor?.name || 'Lead Instructor'}</div>
            <div className="text-slate-500">{certData.instructor?.headline || 'Instructor Signature'}</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-white text-sm font-outfit print:text-black">Issue Date</div>
            <div>{new Date(certData.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-white text-sm font-outfit print:text-black">Certificate ID</div>
            <div className="font-mono text-indigo-300 print:text-indigo-700">{certData.certificateId}</div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CertificateViewPage;
