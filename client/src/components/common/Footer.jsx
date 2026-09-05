import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const links = {
    'LearnPulse': ['About us', 'Careers', 'Blog', 'Press'],
    'Community': ['Students', 'Instructors', 'Affiliate', 'Partners'],
    'Teach on LearnPulse': ['Become an instructor', 'Get the app', 'Teaching center', 'Rules & guidelines'],
    'Support': ['Help center', 'Verify certificate', 'Terms of service', 'Privacy policy'],
  };

  return (
    <footer className="bg-[#070a12] text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-outfit font-black text-lg text-white tracking-tight">
                Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A modern, production-grade Learning Management System empowering students, instructors, and teams with interactive coursework, verifiable credentials, and hands-on masterclasses.
            </p>
            <div className="flex gap-2 pt-2">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 hover:bg-slate-800 transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="space-y-3">
              <h4 className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-200">
                {heading}
              </h4>
              <ul className="space-y-2 text-xs">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LearnPulse, Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart size={12} className="text-rose-500 fill-rose-500" /> for lifelong learners worldwide
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
