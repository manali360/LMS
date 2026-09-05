import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        if (res.success) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course for checkout');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      // 1. Create checkout session
      const sessionRes = await api.post('/payments/checkout-session', { courseId });
      
      // 2. Verify backend payment
      const verifyRes = await api.post('/payments/verify', {
        courseId,
        paymentId: sessionRes.data.orderId,
      });

      if (verifyRes.success) {
        alert('🎉 Payment verified! Enrollment complete.');
        navigate(`/learning/${courseId}`);
      }
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Preparing secure checkout...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-3">
        <h2 className="text-xl font-bold font-outfit text-white">Course Not Found</h2>
        <Button variant="secondary" onClick={() => navigate('/courses')}>Return to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
        Back to Details
      </Button>

      <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-outfit">Secure Checkout</span>
            <h1 className="text-2xl font-bold font-outfit text-white">Order Summary</h1>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
          </div>
        </div>

        {/* Course Card Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <img src={course.thumbnail} alt={course.title} className="w-32 h-20 object-cover rounded-xl shrink-0" />
          <div className="space-y-1 flex-1 text-center sm:text-left">
            <h3 className="text-base font-bold font-outfit text-white">{course.title}</h3>
            <p className="text-xs text-slate-400">Instructor: {course.instructor?.name}</p>
          </div>
          <div className="text-2xl font-extrabold font-outfit text-white">
            ${course.price}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800 py-4">
          <div className="flex justify-between">
            <span>Course Subtotal</span>
            <span>${course.price}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Service Fee</span>
            <span className="text-emerald-400">$0.00</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800/60">
            <span>Total Payable Amount</span>
            <span className="text-indigo-400">${course.price}</span>
          </div>
        </div>

        {/* Mock Payment Gateway CTA */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <div className="font-bold">Stripe / Razorpay Payment Gateway</div>
              <div className="text-[11px] text-slate-400">Click below to simulate instant payment verification and grant lifetime enrollment access.</div>
            </div>
          </div>

          <Button
            variant="gradient"
            fullWidth
            size="lg"
            disabled={processing}
            onClick={handleProcessPayment}
            icon={Sparkles}
          >
            {processing ? 'Verifying Gateway Response...' : `Complete Payment of $${course.price}`}
          </Button>
        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
