// frontend/src/components/ComplaintModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertCircle, RotateCcw, CreditCard, ChevronDown, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TYPES = [
  {
    value: 'complaint',
    label: 'Complaint',
    icon: AlertCircle,
    desc: 'Report an issue with your order (damaged, wrong item, etc.)',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-300',
    activeBg: 'bg-orange-600 text-white border-orange-600'
  },
  {
    value: 'return',
    label: 'Return',
    icon: RotateCcw,
    desc: 'Request to return the item and get a replacement',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-300',
    activeBg: 'bg-blue-600 text-white border-blue-600'
  },
  {
    value: 'refund',
    label: 'Refund',
    icon: CreditCard,
    desc: 'Request a refund for this item',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-300',
    activeBg: 'bg-green-600 text-white border-green-600'
  }
];

const ComplaintModal = ({ item, backendUrl, token, onClose, existingComplaint }) => {
  const [type, setType] = useState('complaint');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 10) {
      toast.error('Please describe your issue in at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/complaint/submit`,
        {
          orderId: item.orderId,
          itemId: item._id,
          itemName: item.name,
          itemImage: item.image?.[0] || '',
          itemPrice: item.price,
          type,
          message
        },
        { headers: { token } }
      );

      if (res.data.success) {
        setSubmitted(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order ID: #{item.orderId?.slice(-8).toUpperCase()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          // ── Success State ──
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your {type} request has been submitted. Our team will review it and get back to you within 24–48 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-all"
            >
              Done
            </button>
          </div>
        ) : existingComplaint ? (
          // ── Existing Complaint State ──
          <div className="px-6 py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Existing Request
                </span>
                <StatusBadge status={existingComplaint.status} />
              </div>
              <p className="text-sm font-medium text-gray-800 capitalize mb-1">{existingComplaint.type}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{existingComplaint.message}</p>
              {existingComplaint.adminNote && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">Admin Response:</p>
                  <p className="text-sm text-gray-700">{existingComplaint.adminNote}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">
                Submitted {new Date(existingComplaint.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          // ── Submit Form ──
          <div className="px-6 py-5">
            {/* Item Preview */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">₹{item.price} · Qty: {item.quantity}</p>
              </div>
            </div>

            {/* Type Selector */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Request Type
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-white' : t.color} />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mb-5 -mt-2">
              {TYPES.find(t => t.value === type)?.desc}
            </p>

            {/* Message */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Describe Your Issue <span className="text-red-500">*</span>
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe the issue in detail. The more information you provide, the faster we can resolve it."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors resize-none bg-gray-50 placeholder:text-gray-400"
            />
            <p className={`text-xs mt-1 mb-5 text-right ${message.length < 10 ? 'text-gray-400' : 'text-green-600'}`}>
              {message.length} chars {message.length < 10 && message.length > 0 ? `(${10 - message.length} more needed)` : ''}
            </p>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || message.trim().length < 10}
                className="flex-1 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Status badge used inside existing complaint view
export const StatusBadge = ({ status }) => {
  const map = {
    open: { label: 'Open', cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    in_review: { label: 'In Review', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800 border-green-200' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800 border-red-200' },
  };
  const s = map[status] || map.open;
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
};

export default ComplaintModal;