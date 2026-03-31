import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { Helmet } from 'react-helmet-async';

const STATUSES = [
  { key: 'Order Placed',      label: 'Order Placed',      desc: 'Your order has been received and confirmed.' },
  { key: 'Packing',           label: 'Packing',           desc: 'Your items are being carefully packed.' },
  { key: 'Shipped',           label: 'Shipped',           desc: 'Your order is on its way.' },
  { key: 'Out for Delivery',  label: 'Out for Delivery',  desc: 'Your order is out for delivery today.' },
  { key: 'Delivered',         label: 'Delivered',         desc: 'Your order has been delivered.' },
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
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

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
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    try {
      const res = await axios.post(`${backendUrl}/api/order/track`, { orderId: oid });
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setError(res.data.message || 'Order not found.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const currentIdx = order ? getStatusIndex(order.status) : 0;
  const isCancelled = order?.status?.toLowerCase() === 'cancelled';

  return (
    <>
      <Helmet>
        <title>Track Your Order | Jeanzey</title>
        <meta name="description" content="Track your Jeanzey order in real time. Enter your Order ID to see live delivery status." />
        <link rel="canonical" href="https://jeanzey.com/track-order" />
      </Helmet>

      <h1 className="sr-only">Track Your Jeanzey Order</h1>

      <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>

        {/* Hero */}
        <div style={{ borderBottom: '1px solid #e8e6e1', padding: '64px 24px 48px', textAlign: 'center', background: '#fff' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#b0a898', margin: '0 0 16px', fontFamily: 'sans-serif' }}>
            Jean-Zey · Order Tracking
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Track Your Order
          </h2>
          <p style={{ fontSize: '15px', color: '#888', fontWeight: 400, margin: 0, fontStyle: 'italic' }}>
            Enter the Order ID from your confirmation email
          </p>
        </div>

        {/* Search Box */}
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px 0' }}>
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', padding: '32px' }}>
            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '12px', fontFamily: 'sans-serif' }}>
              Order ID
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="e.g. 6849f2a3c1..."
                style={{
                  flex: 1,
                  border: '1px solid #ddd',
                  borderRadius: 0,
                  padding: '14px 16px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  color: '#1a1a1a',
                  background: '#fafaf8',
                  letterSpacing: '0.05em',
                }}
              />
              <button
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
                }}
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
            {error && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: '#c0392b', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {order && (
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>

            {/* Order Meta */}
            <div style={{ background: '#fff', border: '1px solid #e8e6e1', padding: '28px 32px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 6px', fontFamily: 'sans-serif' }}>Order ID</p>
                  <p style={{ fontSize: '13px', fontFamily: 'monospace', color: '#1a1a1a', margin: 0, letterSpacing: '0.05em' }}>{order._id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 6px', fontFamily: 'sans-serif' }}>Placed On</p>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif' }}>{formatDate(order.date)}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f0ede8', marginTop: '20px', paddingTop: '20px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Payment</p>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif' }}>
                    {order.paymentMethod || 'COD'} ·{' '}
                    <span style={{ color: order.payment ? '#2d6a4f' : '#c0392b' }}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Total</p>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, fontFamily: 'sans-serif' }}>{currency}{order.amount}</p>
                </div>
                {order.priorityDelivery && (
                  <div>
                    <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 4px', fontFamily: 'sans-serif' }}>Delivery</p>
                    <p style={{ fontSize: '13px', color: '#b8860b', margin: 0, fontFamily: 'sans-serif' }}>⚡ Priority (24hrs)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div style={{ background: '#fff', border: '1px solid #e8e6e1', padding: '32px', marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 28px', fontFamily: 'sans-serif' }}>
                Delivery Status
              </p>

              {isCancelled ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fdf0f0', border: '2px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px' }}>
                    ✕
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
                            background: isDone && idx < currentIdx ? '#1a1a1a' : '#e8e6e1',
                            transition: 'background 0.3s',
                          }} />
                        )}
                        {/* Dot */}
                        <div style={{ flexShrink: 0, marginTop: '4px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: `2px solid ${isDone ? '#1a1a1a' : '#ddd'}`,
                            background: isCurrent ? '#1a1a1a' : isDone ? '#1a1a1a' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            position: 'relative',
                            zIndex: 1,
                          }}>
                            {isDone && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
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
                                background: '#1a1a1a',
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
            <div style={{ background: '#fff', border: '1px solid #e8e6e1', padding: '28px 32px', marginBottom: '20px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
                Order Items ({order.items?.length || 0})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: i < order.items.length - 1 ? '16px' : 0, borderBottom: i < order.items.length - 1 ? '1px solid #f5f3ef' : 'none' }}>
                    {item.image?.[0] && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        style={{ width: '60px', height: '72px', objectFit: 'cover', flexShrink: 0, background: '#f5f3ef' }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '0 0 4px', fontWeight: 400, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#999', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
                        {item.size && item.size !== 'N/A' ? `Size: ${item.size} · ` : ''}Qty: {item.quantity}
                        {item.status && item.status.toLowerCase() === 'cancelled' && (
                          <span style={{ marginLeft: '8px', color: '#c0392b' }}>· Cancelled</span>
                        )}
                      </p>
                    </div>
                    <p style={{ fontSize: '14px', color: '#1a1a1a', margin: 0, flexShrink: 0, fontFamily: 'sans-serif' }}>
                      {currency}{item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div style={{ background: '#fff', border: '1px solid #e8e6e1', padding: '28px 32px' }}>
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
                    📞 {order.address.phone}
                  </p>
                )}
              </div>
            )}

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
    </>
  );
};

export default TrackOrder;