import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import WhatsAppButton from '../components/WhatsAppButton';
import { Eye, EyeOff, X, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, setUserData } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPasword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotLoading, setForgotLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          const userData = { name, email };
          setUserData(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          toast.success('Account created successfully!');
        } else toast.error(response.data.message);
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          const userData = { name: response.data.name || name, email };
          setUserData(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          toast.success('Logged in successfully!');
        } else toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error('Please enter your email.');
    setForgotLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email: forgotEmail });
      if (res.data.success) {
        setForgotStep('sent');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotStep('email');
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── ROOT ─── */
        .jz-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fff;
          font-family: 'Jost', sans-serif;
        }
        @media (min-width: 960px) {
          .jz-root { flex-direction: row; }
        }

        /* ════════════════════════════════════
           LEFT EDITORIAL PANEL
        ════════════════════════════════════ */
        .jz-left {
          display: none;
          width: 52%;
          flex-shrink: 0;
          position: relative;
          background: #fff;
          border-right: 1px solid #e8e8e8;
          overflow: hidden;
        }
        @media (min-width: 960px) {
          .jz-left { display: flex; flex-direction: column; }
        }

        /* Noise grain */
        .jz-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        /* Diagonal accents */
        .jz-slash {
          position: absolute;
          top: -20%; right: -8%;
          width: 1px; height: 140%;
          background: rgba(0,0,0,0.04);
          transform: rotate(-15deg);
          transform-origin: top center;
        }
        .jz-slash2 {
          position: absolute;
          top: -20%; right: 10%;
          width: 1px; height: 140%;
          background: rgba(0,0,0,0.025);
          transform: rotate(-15deg);
          transform-origin: top center;
        }

        /* Inner padding — responsive */
        .jz-left-inner {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 56px 60px;
        }
        @media (max-width: 1200px) {
          .jz-left-inner { padding: 44px 44px; }
        }
        @media (max-width: 1060px) {
          .jz-left-inner { padding: 36px 32px; }
        }

        /* ✅ TOP ROW — centered */
        .jz-left-top {
          display: flex;
          align-items: center;
          justify-content: center;    /* ← centered */
          margin-bottom: 0;
        }

        /* ✅ BRAND — centered text, large, premium */
        .jz-brand {
          font-family: 'Cormorant', serif;
          font-size: 3.6rem;
          font-weight: 600;
          letter-spacing: 18px;
          text-transform: uppercase;
          color: #0c0c0c;
          line-height: 1;
          text-align: center;           /* ← centered */
          text-shadow:
            0 1px 0 rgba(0,0,0,0.05),
            0 12px 32px rgba(0,0,0,0.10);
          transition: letter-spacing 0.4s ease, transform 0.35s ease;
          display: inline-block;
        }
        .jz-brand:hover {
          letter-spacing: 22px;
          transform: translateY(-2px);
        }
        @media (max-width: 1200px) {
          .jz-brand { font-size: 2.8rem; letter-spacing: 14px; }
          .jz-brand:hover { letter-spacing: 17px; }
        }
        @media (max-width: 1060px) {
          .jz-brand { font-size: 2.2rem; letter-spacing: 10px; }
          .jz-brand:hover { letter-spacing: 13px; }
        }

        /* Headline */
        .jz-editorial {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .jz-headline {
          font-family: 'Cormorant', serif;
          font-size: clamp(3.2rem, 5.5vw, 7.5rem);
          font-weight: 500;
          line-height: 0.9;
          color: #0c0c0c;
          letter-spacing: -1px;
          margin-bottom: 36px;
        }
        .jz-headline em {
          font-style: italic;
          font-weight: 400;
          display: block;
          color: #aaa;
        }
        @media (max-width: 1060px) {
          .jz-headline { margin-bottom: 24px; }
        }

        .jz-caption-row {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
        }
        .jz-caption-line {
          width: 28px; height: 1px;
          background: #bbb;
          margin-bottom: 3px;
          flex-shrink: 0;
        }
        .jz-caption {
          font-size: 0.78rem;
          font-weight: 400;
          color: #666;
          line-height: 1.8;
          max-width: 300px;
          letter-spacing: 0.3px;
        }
        @media (max-width: 1060px) {
          .jz-caption { font-size: 0.72rem; max-width: 240px; }
        }

        /*
         * ✅ STATS FOOTER
         * margin-bottom lifts stats up from bottom edge
         * Increase to push further up, decrease to move lower
         */
        .jz-left-footer {
          border-top: 1px solid #e8e8e8;
          padding-top: 24px;          /* ← space above numbers */
          padding-bottom: 0;
          margin-bottom: 100px;       /* ← ✅ increased from 80→100px: stats sit higher */
          display: flex;
          gap: 0;
        }
        @media (max-width: 1200px) {
          .jz-left-footer { margin-bottom: 72px; }
        }
        @media (max-width: 1060px) {
          .jz-left-footer { margin-bottom: 48px; padding-top: 18px; }
        }
        .jz-stat {
          flex: 1;
          padding-right: 24px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .jz-stat + .jz-stat {
          border-left: 1px solid #e8e8e8;
          padding-left: 24px;
          padding-right: 0;
        }
        @media (max-width: 1060px) {
          .jz-stat { padding-right: 16px; }
          .jz-stat + .jz-stat { padding-left: 16px; }
        }
        .jz-stat-num {
          font-family: 'Cormorant', serif;
          font-size: 2.2rem;
          font-weight: 500;
          color: #0c0c0c;
          line-height: 1;
          margin-bottom: 4px;
        }
        @media (max-width: 1060px) {
          .jz-stat-num { font-size: 1.7rem; }
        }
        .jz-stat-lbl {
          font-size: 0.62rem;
          font-weight: 400;
          color: #888;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }
        @media (max-width: 1060px) {
          .jz-stat-lbl { letter-spacing: 1.5px; font-size: 0.58rem; }
        }

        /* ════════════════════════════════════
           RIGHT FORM PANEL
        ════════════════════════════════════ */
        .jz-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 32px;
          background: #fff;
          position: relative;
        }

        /* Mobile top accent bar */
        .jz-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #0c0c0c;
          display: none;
        }
        @media (max-width: 960px) {
          .jz-right {
            padding: 40px 24px 56px;
          }
          .jz-right::before { display: block; }
        }
        @media (max-width: 480px) {
          .jz-right { padding: 32px 18px 48px; }
        }

        .jz-right-inner {
          width: 100%;
          max-width: 360px;
        }
        @media (max-width: 480px) {
          .jz-right-inner { max-width: 100%; }
        }

        /* Mobile brand — shown only when left panel is hidden */
        .jz-mob-brand {
          display: block;
          font-family: 'Cormorant', serif;
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: 12px;
          text-transform: uppercase;
          color: #0c0c0c;
          margin-bottom: 36px;
          text-align: center;
        }
        @media (min-width: 960px) { .jz-mob-brand { display: none; } }
        @media (max-width: 480px) {
          .jz-mob-brand { font-size: 1.2rem; letter-spacing: 9px; margin-bottom: 28px; }
        }

        /* Eyebrow */
        .jz-form-eyebrow {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .jz-form-eyebrow::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: #888;
        }

        /* Title */
        .jz-form-title {
          font-family: 'Cormorant', serif;
          font-size: 3.6rem;
          font-weight: 500;
          color: #0c0c0c;
          line-height: 1;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        }
        .jz-form-title span {
          font-style: italic;
          font-weight: 400;
          color: #aaa;
        }
        @media (max-width: 640px) {
          .jz-form-title { font-size: 2.9rem; margin-bottom: 24px; }
        }
        @media (max-width: 480px) {
          .jz-form-title { font-size: 2.5rem; }
        }

        /* Tabs */
        .jz-tabs {
          display: flex;
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 32px;
        }
        @media (max-width: 480px) {
          .jz-tabs { margin-bottom: 24px; }
        }
        .jz-tab {
          flex: 1;
          background: none;
          border: none;
          padding: 10px 0 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          color: #bbb;
          position: relative;
          transition: color 0.2s;
        }
        .jz-tab::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 1.5px;
          background: #0c0c0c;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .jz-tab.active { color: #0c0c0c; }
        .jz-tab.active::after { transform: scaleX(1); }
        .jz-tab:not(.active):hover { color: #555; }

        /* Fields */
        .jz-field { margin-bottom: 20px; }
        @media (max-width: 480px) {
          .jz-field { margin-bottom: 16px; }
        }
        .jz-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
        }
        .jz-input {
          width: 100%;
          background: #f9f9f9;
          border: 1px solid #e8e8e8;
          border-bottom: 1.5px solid #ccc;
          padding: 13px 14px;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #0c0c0c;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          border-radius: 0;
          -webkit-appearance: none;
          appearance: none;
        }
        @media (max-width: 480px) {
          .jz-input { padding: 11px 12px; font-size: 16px; /* prevents iOS zoom */ }
        }
        .jz-input::placeholder { color: #bbb; }
        .jz-input:focus {
          background: #fff;
          border-color: #0c0c0c;
          border-bottom-color: #0c0c0c;
        }

        /* Password wrapper */
        .jz-pw-wrap { position: relative; }
        .jz-pw-wrap .jz-input { padding-right: 44px; }
        .jz-eye {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #bbb;
          display: flex; align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .jz-eye:hover { color: #0c0c0c; }

        /* Meta row */
        .jz-form-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          margin-top: -4px;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 360px) {
          .jz-form-meta { flex-direction: column; align-items: flex-start; }
        }
        .jz-meta-link {
          background: none; border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem; font-weight: 400;
          cursor: pointer; padding: 0;
          transition: color 0.2s;
          letter-spacing: 0.3px;
        }
        .jz-meta-link-grey { color: #888; }
        .jz-meta-link-grey:hover { color: #0c0c0c; }
        .jz-meta-link-dark {
          color: #0c0c0c;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: #ccc;
        }
        .jz-meta-link-dark:hover { text-decoration-color: #0c0c0c; }

        /* Submit button */
        .jz-btn {
          width: 100%;
          background: #0c0c0c;
          color: #fff;
          border: none;
          padding: 16px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: background 0.25s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }
        .jz-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .jz-btn:hover::before { transform: translateX(100%); }
        .jz-btn:hover { background: #222; transform: translateY(-1px); }
        .jz-btn:active { transform: translateY(0); }
        .jz-btn:disabled { background: #d0d0d0; cursor: not-allowed; transform: none; }
        .jz-btn:disabled::before { display: none; }
        @media (max-width: 480px) {
          .jz-btn { padding: 14px 16px; }
        }

        /* Spinner */
        .jz-spin {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: jz-spin 0.7s linear infinite;
        }
        @keyframes jz-spin { to { transform: rotate(360deg); } }

        /* Footer */
        .jz-form-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .jz-security-badge {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .jz-security-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }
        .jz-security-text {
          font-size: 0.65rem;
          font-weight: 400;
          color: #888;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .jz-tos {
          font-size: 0.65rem;
          font-weight: 300;
          color: #aaa;
          letter-spacing: 0.2px;
          text-align: right;
          line-height: 1.5;
        }

        /* ════════════════════════════════════
           FORGOT PASSWORD MODAL
        ════════════════════════════════════ */
        .jz-overlay {
          position: fixed; inset: 0;
          background: rgba(12,12,12,0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          padding: 20px;
          animation: jz-fade 0.2s ease;
        }
        @keyframes jz-fade { from{opacity:0} to{opacity:1} }

        .jz-modal {
          background: #fff;
          width: 100%;
          max-width: 400px;
          padding: 0;
          position: relative;
          animation: jz-rise 0.32s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
        }
        @keyframes jz-rise {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .jz-modal-stripe { height: 3px; background: #0c0c0c; }
        .jz-modal-body { padding: 36px 36px 32px; }

        .jz-modal-close {
          position: absolute;
          top: 18px; right: 16px;
          background: none;
          border: 1px solid #e8e8e8;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #aaa;
          transition: all 0.2s;
        }
        .jz-modal-close:hover { border-color: #0c0c0c; color: #0c0c0c; }

        .jz-m-kicker {
          font-size: 0.62rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #888; font-weight: 500;
          margin-bottom: 10px;
        }
        .jz-m-title {
          font-family: 'Cormorant', serif;
          font-size: 2.4rem;
          font-weight: 500;
          color: #0c0c0c;
          margin-bottom: 12px;
          line-height: 1;
        }
        .jz-m-desc {
          font-size: 0.82rem;
          font-weight: 400;
          color: #666;
          line-height: 1.8;
          margin-bottom: 24px;
          letter-spacing: 0.1px;
        }
        .jz-m-expire {
          margin-top: 14px;
          font-size: 0.68rem;
          color: #999;
          text-align: center;
          line-height: 1.7;
        }
        .jz-m-expire strong { color: #444; font-weight: 600; }

        .jz-modal-success { padding: 36px 36px 32px; text-align: center; }
        .jz-suc-check {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1px solid #e8e8e8;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          color: #22c55e;
        }
        .jz-suc-title {
          font-family: 'Cormorant', serif;
          font-size: 2.2rem;
          font-weight: 500;
          color: #0c0c0c;
          margin-bottom: 10px;
          line-height: 1;
        }
        .jz-suc-to {
          font-size: 0.84rem;
          color: #666; font-weight: 400;
          line-height: 1.7;
          margin-bottom: 22px;
        }
        .jz-suc-to strong { color: #0c0c0c; font-weight: 600; }

        .jz-sec-notice {
          text-align: left;
          background: #f9f9f9;
          border-left: 2px solid #0c0c0c;
          padding: 14px 16px;
          margin-bottom: 22px;
        }
        .jz-sec-notice p {
          font-size: 0.72rem; font-weight: 400;
          color: #555; line-height: 1.9;
        }
        .jz-sec-notice strong { color: #0c0c0c; font-weight: 600; }

        .jz-btn-outline {
          width: 100%;
          background: transparent;
          color: #0c0c0c;
          border: 1px solid #0c0c0c;
          padding: 14px 20px;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 4px; text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .jz-btn-outline:hover { background: #0c0c0c; color: #fff; }

        .jz-retry {
          margin-top: 14px;
          font-size: 0.7rem;
          color: #999; text-align: center;
        }
        .jz-retry-btn {
          background: none; border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem; color: #444;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0; font-weight: 500;
          transition: color 0.2s;
        }
        .jz-retry-btn:hover { color: #0c0c0c; }

        /* Modal responsive */
        @media (max-width: 480px) {
          .jz-modal-body, .jz-modal-success { padding: 28px 22px 24px; }
          .jz-m-title { font-size: 2rem; }
          .jz-suc-title { font-size: 1.9rem; }
        }
      `}</style>

      <div className="jz-root">

        {/* ══ LEFT EDITORIAL PANEL ══ */}
        <div className="jz-left">
          <div className="jz-slash" />
          <div className="jz-slash2" />
          <div className="jz-left-inner">

            {/* ✅ Brand — centered */}
            <div className="jz-left-top">
              <div className="jz-brand">Jean-Zey</div>
            </div>

            {/* Editorial copy */}
            <div className="jz-editorial">
              <h2 className="jz-headline">
                Wear<br />
                the<br />
                <em>Culture.</em>
              </h2>
              <div className="jz-caption-row">
                <div className="jz-caption-line" />
                <p className="jz-caption">
                  Jean-Zey is where raw identity meets refined fashion. Every piece is a statement. Every member is the story.
                </p>
              </div>
            </div>

            {/* ✅ Stats — pushed higher via margin-bottom: 100px */}
            <div className="jz-left-footer">
              <div className="jz-stat">
                <div className="jz-stat-num">Free</div>
                <div className="jz-stat-lbl">Shipping</div>
              </div>
              <div className="jz-stat">
                <div className="jz-stat-num">Easy</div>
                <div className="jz-stat-lbl">Returns</div>
              </div>
              <div className="jz-stat">
                <div className="jz-stat-num">New</div>
                <div className="jz-stat-lbl">Drops Weekly</div>
              </div>
            </div>

          </div>
        </div>

        {/* ══ RIGHT FORM PANEL — unchanged ══ */}
        <div className="jz-right">
          <div className="jz-right-inner">

            {/* Mobile only brand */}
            <span className="jz-mob-brand">Jean-Zey</span>

            <p className="jz-form-eyebrow">
              {currentState === 'Login' ? 'Member Access' : 'New Member'}
            </p>
            <h1 className="jz-form-title">
              {currentState === 'Login'
                ? <>Welcome<br /><span>back.</span></>
                : <>Create<br /><span>account.</span></>
              }
            </h1>

            <div className="jz-tabs">
              <button
                type="button"
                className={`jz-tab ${currentState === 'Login' ? 'active' : ''}`}
                onClick={() => setCurrentState('Login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`jz-tab ${currentState === 'Sign Up' ? 'active' : ''}`}
                onClick={() => setCurrentState('Sign Up')}
              >
                Register
              </button>
            </div>

            <form onSubmit={onSubmitHandler}>
              {currentState === 'Sign Up' && (
                <div className="jz-field">
                  <label className="jz-label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    className="jz-input"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="jz-field">
                <label className="jz-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="jz-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="jz-field">
                <label className="jz-label" htmlFor="password">Password</label>
                <div className="jz-pw-wrap">
                  <input
                    id="password"
                    className="jz-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="jz-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="jz-form-meta">
                <button
                  type="button"
                  className="jz-meta-link jz-meta-link-grey"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="jz-meta-link jz-meta-link-dark"
                  onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                >
                  {currentState === 'Login' ? 'Create account' : 'Sign in instead'}
                </button>
              </div>

              <button type="submit" className="jz-btn" disabled={loading}>
                {loading
                  ? <span className="jz-spin" />
                  : <>{currentState === 'Login' ? 'Sign In' : 'Create Account'} <ArrowRight size={14} /></>
                }
              </button>
            </form>

            <div className="jz-form-footer">
              <div className="jz-security-badge">
                <div className="jz-security-dot" />
                <span className="jz-security-text">SSL Secured</span>
              </div>
              <p className="jz-tos">Terms & Privacy apply</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FORGOT PASSWORD MODAL ══ */}
      {showForgot && (
        <div
          className="jz-overlay"
          onClick={(e) => e.target === e.currentTarget && closeForgot()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="jz-modal-title"
        >
          <div className="jz-modal">
            <div className="jz-modal-stripe" />
            <button className="jz-modal-close" onClick={closeForgot} aria-label="Close">
              <X size={12} />
            </button>

            {forgotStep === 'email' ? (
              <div className="jz-modal-body">
                <p className="jz-m-kicker">Account Recovery</p>
                <h2 className="jz-m-title" id="jz-modal-title">Reset Password</h2>
                <p className="jz-m-desc">
                  Enter the email address linked to your Jean-Zey account. We'll send a secure, time-limited reset link directly to your inbox.
                </p>
                <form onSubmit={handleForgotPassword}>
                  <div className="jz-field">
                    <label className="jz-label" htmlFor="forgot-email">Email Address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      className="jz-input"
                      placeholder="your@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="jz-btn" disabled={forgotLoading}>
                    {forgotLoading
                      ? <span className="jz-spin" />
                      : <>Send Reset Link <ArrowRight size={14} /></>
                    }
                  </button>
                </form>
                <p className="jz-m-expire">
                  This link expires in <strong>15 minutes</strong>.<br />
                  Check your spam folder if it doesn't arrive.
                </p>
              </div>
            ) : (
              <div className="jz-modal-success">
                <div className="jz-suc-check">
                  <ShieldCheck size={22} strokeWidth={1.5} />
                </div>
                <h2 className="jz-suc-title" id="jz-modal-title">Email Sent</h2>
                <p className="jz-suc-to">
                  A password reset link has been delivered to<br />
                  <strong>{forgotEmail}</strong>
                </p>
                <div className="jz-sec-notice">
                  <p>
                    <strong>Security Notice —</strong> This link expires in <strong>15 minutes</strong>.
                    Jean-Zey will <strong>never</strong> request your password via email, phone or message.
                    If you did not initiate this request, no action is needed — your account remains secure.
                  </p>
                </div>
                <button className="jz-btn-outline" onClick={closeForgot}>
                  Back to Sign In
                </button>
                <p className="jz-retry">
                  Didn't receive it?{' '}
                  <button className="jz-retry-btn" onClick={() => setForgotStep('email')}>
                    Resend link
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <WhatsAppButton />
    </>
  );
};

export default Login;