import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Helmet } from 'react-helmet-async';
import WhatsAppButton from '../components/WhatsAppButton';
import { Check, Package, Truck, Clock, MapPin, Phone, Copy, RefreshCw, XCircle, Star, Zap } from "lucide-react";

const STATUSES = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Your order has been received and confirmed.', icon: <Star size={12} /> },
  { key: 'Packing', label: 'Packing', desc: 'Your items are being carefully packed.', icon: <Package size={12} /> },
  { key: 'Shipped', label: 'Shipped', desc: 'Your order is on its way.', icon: <Truck size={12} /> },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Your order is out for delivery today.', icon: <Truck size={12} /> },
  { key: 'Delivered', label: 'Delivered', desc: 'Your order has been delivered.', icon: <Check size={12} /> },
];

const getStatusIndex = (status) => {
  if (!status) return 0;
  const idx = STATUSES.findIndex(s => s.key.toLowerCase() === status.toLowerCase());
  return idx === -1 ? 0 : idx;
};

const formatDate = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const TrackOrder = () => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showTracking, setShowTracking] = useState(true);

  // Auto-fetch if orderId in URL
  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleTrack(urlOrderId);
    }
  }, []);

  const handleTrack = async (id) => {
    const oid = (id || orderId).trim();
    if (!oid) { setError('Please enter your Order ID.'); return; }
    setShowTracking(true);
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    try {
      const res = await axios.post(`${backendUrl}/api/order/track`, { orderId: oid });
      if (res.data.success) {
        setOrder(res.data.order);
        setLastRefreshed(new Date());
      } else {
        setError(res.data.message || 'Order not found.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  // CHANGE 1: Refresh uses short orderId if available, falls back to _id
  const handleRefresh = async () => {
    if (!order || refreshing) return;
    setRefreshing(true);
    try {
      const trackId = order.orderId || order._id;
      const res = await axios.post(`${backendUrl}/api/order/track`, { orderId: trackId });
      if (res.data.success) {
        setOrder(res.data.order);
        setLastRefreshed(new Date());
      }
    } catch {}
    setRefreshing(false);
  };

  // CHANGE 2: Copy uses short orderId if available, falls back to _id
  const handleCopyId = () => {
    if (!order) return;
    const displayId = order.orderId || order._id;
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentIdx = order ? getStatusIndex(order.status) : 0;
  const isCancelled = order?.status?.toLowerCase() === 'cancelled';

  const progressPercent = isCancelled ? 0 : (currentIdx / (STATUSES.length - 1)) * 100;

  return (
    <>
      <Helmet>
        <title>Track Your Order | Jeanzey</title>
        <meta name="description" content="Track your Jeanzey order in real time. Enter your Order ID to see live delivery status." />
        <link rel="canonical" href="https://jeanzey.com/track-order" />
      </Helmet>

      <h1 className="sr-only">Track Your Jeanzey Order</h1>

      <style>{`
        .track-input:focus { border-color: #b8860b !important; outline: none; box-shadow: 0 0 0 3px rgba(184,134,11,0.08); }
        .track-btn-primary { transition: all 0.3s ease; }
        .track-btn-primary:hover:not(:disabled) { background: #b8860b !important; }
        .refresh-btn { transition: all 0.3s ease; }
        .refresh-btn:hover:not(:disabled) { background: #1a1a1a !important; color: #fff !important; }
        .refresh-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .status-dot-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.4); } 50% { box-shadow: 0 0 0 8px rgba(184,134,11,0); } }
        .track-card { transition: box-shadow 0.3s ease; }
        .track-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.06) !important; }
        .progress-bar-fill { transition: width 1s ease; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .copy-btn { transition: all 0.2s ease; }
        .copy-btn:hover { color: #b8860b !important; }
        @media (max-width: 600px) {
          .track-hero-title { font-size: 28px !important; }
          .track-meta-grid { flex-direction: column !important; gap: 16px !important; }
          .track-id-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .track-search-row { flex-direction: column !important; }
          .track-search-row button { width: 100% !important; }
          .track-items-row { flex-direction: column !important; align-items: flex-start !important; }
          .track-items-price { margin-top: 4px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: "'Playfair Display', serif" }}>

        {/* Hero */}
        <div style={{ borderBottom: '1px solid #e8e6e1', padding: 'clamp(40px,8vw,72px) 24px clamp(32px,5vw,52px)', textAlign: 'center', background: '#fff', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(184,134,11,0.03) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(184,134,11,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '12px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#b8860b', margin: '28px 16px', fontFamily: 'sans-serif', position: 'relative' }}>
            Jean-Zey · Order Tracking
          </p>
          <h2 className="track-hero-title" style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 400, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.01em', position: 'relative' }}>
            Track Your Order
          </h2>
          <p style={{ fontSize: 'clamp(13px,2vw,15px)', color: '#888', fontWeight: 400, margin: '0 0 20px', fontStyle: 'italic', position: 'relative' }}>
            Enter the Order ID from your confirmation email
          </p>
          {/* Decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative' }}>
            <div style={{ width: '40px', height: '1px', background: '#e8e6e1' }} />
            <span style={{ color: '#b8860b', fontSize: '12px' }}>✦</span>
            <div style={{ width: '40px', height: '1px', background: '#e8e6e1' }} />
          </div>
        </div>

        {/* Search Box */}
        <div style={{ maxWidth: '580px', margin: '0 auto', padding: 'clamp(24px,5vw,48px) 16px 0' }}>
          <div className="track-card" style={{ background: '#fff', border: '1px solid #e8e6e1', padding: 'clamp(20px,4vw,32px)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '12px', fontFamily: 'sans-serif' }}>
              Order ID
            </label>
            <div className="track-search-row" style={{ display: 'flex', gap: '12px' }}>
              <input
                className="track-input"
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="e.g. JZ-260318-4A2F"
                style={{
                  flex: 1,
                  border: '1px solid #ddd',
                  borderRadius: 0,
                  padding: '14px 16px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#1a1a1a',
                  background: '#fafaf8',
                  letterSpacing: '0.05em',
                  transition: 'border-color 0.2s',
                  minWidth: 0,
                }}
              />
              <button
                className="track-btn-primary"
                onClick={() => handleTrack()}
                disabled={loading}
                style={{
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 28px',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'sans-serif',
                  opacity: loading ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {loading ? '...' : 'Track'}
              </button>
            </div>
            {error && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: '#c0392b', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                ⚠ {error}
              </p>
            )}
            <p style={{ marginTop: '14px', fontSize: '11px', color: '#bbb', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
              Your Order ID was sent in your confirmation email after placing the order.
            </p>
          </div>
        </div>

        

        {/* Results */}
       {order && showTracking && (
        
          <div className="fade-in" style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(24px,4vw,40px) 16px clamp(48px,8vw,80px)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
  <button
  onClick={() => {
  setShowTracking(false);
  setOrder(null);          // ✅ reset order
  setSearched(false);      // ✅ reset search state
  setError('');            // ✅ clear errors
}}
    style={{
      background: 'transparent',
      border: '1px solid #e8e6e1',
      padding: '6px 12px',
      fontSize: '10px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      fontFamily: 'sans-serif',
      color: '#888'
    }}
  >
    ✕ Close
  </button>
</div>

            {/* Progress Bar */}
            {!isCancelled && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', fontFamily: 'sans-serif' }}>
                    Delivery Progress
                  </span>
                  <span style={{ fontSize: '11px', color: '#b8860b', fontFamily: 'sans-serif', fontWeight: 500 }}>
                    {Math.round(progressPercent)}% complete
                  </span>
                </div>
                <div style={{ height: '3px', background: '#f0ede8', borderRadius: '2px', overflow: 'hidden' }}>
                  <div className="progress-bar-fill" style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #b8860b, #d4af37)', borderRadius: '2px' }} />
                </div>
              </div>
            )}

            {/* Order Meta */}
            <div className="track-card" style={{ background: '#fff', border: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div className="track-id-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 6px', fontFamily: 'sans-serif' }}>Order ID</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* CHANGE 3: Display short orderId, fallback to _id for old orders */}
                    <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', fontFamily: 'monospace', color: '#1a1a1a', margin: 0, letterSpacing: '0.08em', fontWeight: 500 }}>{order.orderId || order._id}</p>
                    <button className="copy-btn" onClick={handleCopyId} title="Copy Order ID" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: copied ? '#b8860b' : '#bbb', padding: '2px', flexShrink: 0 }}>
                   {copied ? 'Copied' : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 6px', fontFamily: 'sans-serif' }}>Placed On</p>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif' }}>{formatDate(order.date)}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f0ede8', paddingTop: '16px' }}>
                <div className="track-meta-grid" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Payment</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif' }}>
                      {order.paymentMethod || 'COD'} ·{' '}
                      <span style={{ color: order.payment ? '#2d6a4f' : '#c0392b' }}>
                       {order.payment ? (
  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <Check size={14} /> Paid
  </span>
) : (
  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <Clock size={14} /> Pending
  </span>
)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Total</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif', fontWeight: 500 }}>{currency}{order.amount}</p>
                  </div>
                  {order.priorityDelivery && (
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Delivery</p>
       <p style={{ fontSize: '13px', color: '#b8860b', margin: 0, fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
  <Zap size={14} /> Priority (24hrs)
</p>
                    </div>
                  )}
                  {lastRefreshed && (
                    <div style={{ marginLeft: 'auto' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Last Updated</p>
                      <p style={{ fontSize: '12px', color: '#aaa', margin: 0, fontFamily: 'sans-serif' }}>
                        {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="track-card" style={{ background: '#fff', border: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,32px)', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: 0, fontFamily: 'sans-serif' }}>
                  Delivery Status
                </p>
                {/* Refresh Button */}
                <button
                  className="refresh-btn"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="Refresh status"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fafaf8',
                    border: '1px solid #e8e6e1',
                    padding: '7px 14px',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    fontFamily: 'sans-serif',
                    color: '#888',
                    opacity: refreshing ? 0.6 : 1,
                  }}
                >
           <RefreshCw size={14} className={refreshing ? 'refresh-spin' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh Status'}
                </button>
              </div>

              {isCancelled ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fdf0f0', border: '2px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px' }}>
                  <XCircle size={18} />
                  </div>
                  <p style={{ fontSize: '18px', color: '#c0392b', fontWeight: 400, margin: '0 0 8px' }}>Order Cancelled</p>
                  <p style={{ fontSize: '13px', color: '#999', margin: 0, fontFamily: 'sans-serif', fontStyle: 'italic' }}>This order has been cancelled.</p>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {STATUSES.map((s, idx) => {
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isLast = idx === STATUSES.length - 1;
                    return (
                      <div key={s.key} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                        {/* Line */}
                        {!isLast && (
                          <div style={{
                            position: 'absolute',
                            left: '15px',
                            top: '32px',
                            width: '2px',
                            height: 'calc(100% - 8px)',
                            background: isDone && idx < currentIdx ? 'linear-gradient(180deg, #b8860b, #d4af37)' : '#e8e6e1',
                            transition: 'background 0.3s',
                          }} />
                        )}
                        {/* Dot */}
                        <div style={{ flexShrink: 0, marginTop: '4px' }}>
                          <div
                            className={isCurrent ? 'status-dot-pulse' : ''}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: `2px solid ${isCurrent ? '#b8860b' : isDone ? '#1a1a1a' : '#ddd'}`,
                              background: isCurrent ? '#b8860b' : isDone ? '#1a1a1a' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s',
                              position: 'relative',
                              zIndex: 1,
                              fontSize: '12px',
                            }}>
                            {isDone ? (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                             <span style={{ color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {s.icon}
</span>
                            )}
                          </div>
                        </div>
                        {/* Content */}
                        <div style={{ paddingBottom: isLast ? 0 : '32px', flex: 1 }}>
                          <p style={{
                            fontSize: isCurrent ? '15px' : '14px',
                            fontWeight: 400,
                            color: isDone ? '#1a1a1a' : '#bbb',
                            margin: '4px 0 4px',
                            letterSpacing: '0.02em',
                          }}>
                            {s.label}
                            {isCurrent && (
                              <span style={{
                                marginLeft: '10px',
                                fontSize: '9px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                background: '#b8860b',
                                color: '#fff',
                                padding: '2px 8px',
                                fontFamily: 'sans-serif',
                                verticalAlign: 'middle',
                              }}>
                                Current
                              </span>
                            )}
                          </p>
                          {isCurrent && (
                            <p style={{ fontSize: '12px', color: '#888', margin: 0, fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                              {s.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="track-card" style={{ background: '#fff', border: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
                Order Items ({order.items?.length || 0})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} className="track-items-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: i < order.items.length - 1 ? '16px' : 0, borderBottom: i < order.items.length - 1 ? '1px solid #f5f3ef' : 'none' }}>
                    {item.image?.[0] && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        style={{ width: 'clamp(48px,8vw,60px)', height: 'clamp(60px,10vw,72px)', objectFit: 'cover', flexShrink: 0, background: '#f5f3ef' }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 'clamp(13px,2vw,14px)', color: '#1a1a1a', margin: '0 0 4px', fontWeight: 400, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
                        {item.size && item.size !== 'N/A' ? `Size: ${item.size} · ` : ''}Qty: {item.quantity}
                        {item.status && item.status.toLowerCase() === 'cancelled' && (
                          <span style={{ marginLeft: '8px', color: '#c0392b' }}>· Cancelled</span>
                        )}
                      </p>
                    </div>
                    <p className="track-items-price" style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, flexShrink: 0, fontFamily: 'sans-serif', fontWeight: 500 }}>
                      {currency}{item.price}
                    </p>
                  </div>
                ))}
              </div>
              {/* Order total summary */}
              <div style={{ borderTop: '1px solid #f0ede8', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', fontFamily: 'sans-serif' }}>Order Total</span>
                <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: 400 }}>{currency}{order.amount}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="track-card" style={{ background: '#fff', border: '1px solid #e8e6e1', padding: 'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 16px', fontFamily: 'sans-serif' }}>
                  Delivery Address
                </p>
                <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px', fontWeight: 400 }}>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 2px', fontFamily: 'sans-serif' }}>
                  {order.address.street}
                </p>
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 2px', fontFamily: 'sans-serif' }}>
                  {order.address.city}, {order.address.state} — {order.address.zipcode}
                </p>
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 2px', fontFamily: 'sans-serif' }}>
                  {order.address.country}
                </p>
                {order.address.phone && (
                  <p style={{ fontSize: '13px', color: '#666', margin: '0', fontFamily: 'sans-serif' }}>
                   <Phone size={14} style={{ display: 'inline', marginRight: '6px' }} /> {order.address.phone}
                  </p>
                )}
              </div>
            )}

            {/* Help nudge */}
            <div style={{ marginTop: '24px', textAlign: 'center', padding: '20px', border: '1px dashed #e8e6e1', background: '#fffdf9' }}>
              <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 4px', fontStyle: 'italic' }}>Need help with your order?</p>
              <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8860b', fontFamily: 'sans-serif', textDecoration: 'none' }}>
                Contact Support →
              </a>
            </div>

          </div>
        )}

        {/* Empty state */}
        {searched && !order && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#bbb' }}>
            <p style={{ fontSize: '32px', margin: '0 0 12px' }}>—</p>
            <p style={{ fontStyle: 'italic', fontSize: '15px' }}>No order found</p>
          </div>
        )}

      </div>
      <WhatsAppButton/>
    </>
  );
};

export default TrackOrder;