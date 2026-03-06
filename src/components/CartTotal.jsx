import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { Zap, Tag } from 'lucide-react';

// appliedCoupon, priorityDelivery, setPriorityDelivery are all props from PlaceOrder.
// On Cart page none of these are passed so they default safely.
const CartTotal = ({ priorityDelivery, setPriorityDelivery, appliedCoupon = null }) => {
  const { currency, delivery_fee, getCartAmount, priorityDeliveryFee } = useContext(ShopContext);

  const PRIORITY_FEE = priorityDeliveryFee || 100;

  // isPlaceOrderPage = both props are explicitly provided (even if false/null)
  const isPlaceOrderPage = priorityDelivery !== undefined && setPriorityDelivery !== undefined;

  const couponDiscount = appliedCoupon?.discount || 0;
  const cartAmount = getCartAmount();
  const priorityFee = isPlaceOrderPage && priorityDelivery ? PRIORITY_FEE : 0;

  const total = cartAmount === 0
    ? 0
    : cartAmount + delivery_fee + priorityFee - couponDiscount;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">

        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{currency} {cartAmount}.00</p>
        </div>
        <hr />

        {/* Shipping Fee */}
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr />

        {/* Coupon Discount — always visible when coupon is applied, regardless of priority toggle */}
        {appliedCoupon && couponDiscount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <p className="flex items-center gap-1">
                <Tag size={14} />
                Coupon ({appliedCoupon.code})
              </p>
              <p className="font-medium">
                - {currency} {couponDiscount}.00
              </p>
            </div>
            <hr />
          </>
        )}

        {/* Priority Delivery */}
        {!isPlaceOrderPage ? (
          // Cart page — informative banner only
          <div className="my-2 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Zap size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" fill="#ca8a04" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900 text-base">⚡ Same Day Priority Delivery Available!</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  Need it urgently? Get your order delivered within 24 hours with our priority delivery service.
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  Additional charge: {currency}{PRIORITY_FEE}.00
                </p>
                <p className="text-xs text-gray-600 mt-2 italic">
                  💡 You can select this option at checkout on the next page.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Place Order page — interactive checkbox
          <>
            <div className="my-2 border-2 border-gray-300 rounded-xl p-4 hover:border-black transition-all duration-300">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="priorityDelivery"
                  checked={priorityDelivery}
                  onChange={(e) => setPriorityDelivery(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="priorityDelivery" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-yellow-500" />
                    <span className="font-semibold text-gray-900">Same Day Priority Delivery</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Get your order delivered within 24 hours! Perfect for urgent needs.
                  </p>
                  <p className="text-xs font-medium text-gray-900 mt-1">
                    Additional charge: {currency}{PRIORITY_FEE}.00
                  </p>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="flex items-center gap-1">
                Priority Delivery
                {priorityDelivery && <Zap size={14} className="text-yellow-500" />}
              </p>
              <p className={priorityDelivery ? "font-medium text-gray-900" : ""}>
                {currency} {priorityDelivery ? PRIORITY_FEE : 0}.00
              </p>
            </div>
            <hr />
          </>
        )}

        {/* Total — always reflects: subtotal + shipping + priorityFee - couponDiscount */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>{currency} {total}.00</b>
        </div>

      </div>
    </div>
  );
};

export default CartTotal;