// frontend/src/components/CouponInput.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, X, Check, AlertCircle } from 'lucide-react';

const CouponInput = ({ backendUrl, cartAmount, onCouponApply, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/coupon/active`);
      if (response.data.success) {
        setAvailableCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const validateAndApplyCoupon = async (code) => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${backendUrl}/api/coupon/validate`, {
        code: code.toUpperCase(),
        orderAmount: cartAmount
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        onCouponApply({
          code: response.data.coupon.code,
          discount: response.data.discount,
          type: response.data.coupon.type,
          value: response.data.coupon.value
        });
      } else {
        setMessage({ type: 'error', text: response.data.message });
        onCouponApply(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate coupon' });
      onCouponApply(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => validateAndApplyCoupon(couponCode);

  const handleRemove = () => {
    setCouponCode('');
    setMessage({ type: '', text: '' });
    onCouponApply(null);
  };

  const applyCouponFromList = (code) => {
    setCouponCode(code);
    validateAndApplyCoupon(code);
    setShowCoupons(false);
  };

  return (
    <div className="w-full">
      {/* Coupon Input Box */}
      <div className="border-2 border-gray-300 rounded-xl p-3 sm:p-4 mb-4">

        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-gray-700 flex-shrink-0" />
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Have a Coupon?</span>
        </div>

        {/* ✅ Input + button row — min-w-0 on input prevents overflow on small screens */}
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="ENTER COUPON CODE"
            disabled={!!appliedCoupon}
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed uppercase text-xs sm:text-sm tracking-wide placeholder:text-gray-400 placeholder:text-[10px] placeholder:sm:text-xs"
          />

          {!appliedCoupon ? (
            <button
              type="button"
              onClick={handleApply}
              disabled={loading || !couponCode.trim()}
              className="flex-shrink-0 px-4 sm:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {loading ? '…' : 'Apply'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 px-3 sm:px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm font-medium flex items-center gap-1 whitespace-nowrap"
            >
              <X size={13} />
              <span>Remove</span>
            </button>
          )}
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`mt-2.5 flex items-start gap-1.5 text-xs sm:text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message.type === 'success'
              ? <Check size={14} className="flex-shrink-0 mt-0.5" />
              : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            }
            <span className="leading-snug">{message.text}</span>
          </div>
        )}

        {/* Applied Coupon Badge */}
        {appliedCoupon && (
          <div className="mt-3 bg-green-50 border border-green-300 rounded-lg p-2.5 sm:p-3">
            <div className="flex items-center gap-2">
              <Check size={15} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900 text-xs sm:text-sm">
                  {appliedCoupon.code} Applied!
                </p>
                <p className="text-xs text-green-700">
                  You saved ₹{appliedCoupon.discount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Coupons Toggle */}
      {availableCoupons.length > 0 && !appliedCoupon && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowCoupons(!showCoupons)}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            {showCoupons ? 'Hide' : 'View'} Available Coupons ({availableCoupons.length})
          </button>

          {showCoupons && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
              {availableCoupons.map((coupon) => {
                const isEligible = cartAmount >= coupon.minOrderAmount;
                return (
                  <div
                    key={coupon.code}
                    className={`border rounded-lg p-2.5 sm:p-3 transition-all ${
                      isEligible
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 truncate">
                          {coupon.code}
                        </p>
                        <p className="text-xs text-gray-700 mb-0.5">
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% OFF`
                            : `₹${coupon.value} OFF`}
                          {coupon.maxDiscount && ` (Max ₹${coupon.maxDiscount})`}
                        </p>
                        {coupon.description && (
                          <p className="text-xs text-gray-600 leading-snug">{coupon.description}</p>
                        )}
                        {coupon.minOrderAmount > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Min order: ₹{coupon.minOrderAmount}
                          </p>
                        )}
                      </div>
                      {isEligible && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyCouponFromList(coupon.code);
                          }}
                          className="flex-shrink-0 px-2.5 sm:px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-all"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {!isEligible && (
                      <p className="text-xs text-red-600 mt-1.5">
                        Add ₹{coupon.minOrderAmount - cartAmount} more to use this coupon
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponInput;