import React, { useContext, useState, useEffect } from "react";
import CartTotal from "../components/CartTotal";
import CouponInput from "../components/CouponInput";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import WhatsAppButton from "../components/WhatsAppButton";
import emailjs from "@emailjs/browser";
import {
  Package,
  ChevronLeft,
  Gift,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AnimatedBanner from "../components/AnimatedBanner";
import SavedAddresses from "../components/SavedAddresses";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
  const [method] = useState("cod");
  const [showPolicy, setShowPolicy] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [priorityDelivery, setPriorityDelivery] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    userData,
    glassToast,
  } = useContext(ShopContext);

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/address/list`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
        const defaultAddress = res.data.addresses.find((a) => a.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress);
      }
    } catch {
      glassToast("Failed to fetch addresses", "error");
    }
  };

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData);
  };

  // Single source of truth for the final order amount
  // Used by both onSubmitHandler and sendOrderConfirmationEmail
  const getFinalAmount = () => {
    const subtotal = getCartAmount();
    const priorityFee = priorityDelivery ? 100 : 0;
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    return subtotal + delivery_fee + priorityFee - couponDiscount;
  };

  const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
      if (!userData?.email) {
        console.log("No user email found, skipping email notification");
        return false;
      }

      emailjs.init("Xn4D3QqdkvYKjRScl");

      const orderItemsList = orderDetails.items
        .map(
          (item, index) =>
            `<p style="margin: 6px 0; padding: 8px; background: #f9fafb; border-radius: 6px;">${index + 1}. <strong>${item.name}</strong> — Size: ${item.size} — Qty: ${item.quantity} — ₹${item.price}</p>`
        )
        .join("");

      const today = new Date();
      const expectedDelivery = new Date(today);
      expectedDelivery.setDate(today.getDate() + (priorityDelivery ? 1 : 2));

      // Use the single source of truth for amount breakdown
      const subtotal = getCartAmount();
      const priorityFee = priorityDelivery ? 100 : 0;
      const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
      const totalAmount = getFinalAmount();

      const emailParams = {
        name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
        order_id: `${orderDetails.order_id?.slice(-10).toUpperCase()}`,
        order_items: orderItemsList,
        subtotal: `₹${subtotal}`,
        shipping_fee: `₹${delivery_fee}`,
        total_amount: `₹${totalAmount}`,
        delivery_date: expectedDelivery.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        payment_method: method === "cod" ? "Cash on Delivery" : "Online Payment",
        delivery_address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipcode}, ${selectedAddress.country}`,
        email: userData.email,
      };

      // Always include priority delivery field — ₹0 if not selected, fee if selected
      // This prevents email template errors if the field is expected
      emailParams.priority_delivery = `₹${priorityFee}`;

      // Always include coupon fields — empty strings if no coupon applied
      // This prevents email template errors if the fields are expected
      emailParams.coupon_code = appliedCoupon ? appliedCoupon.code : "";
      emailParams.coupon_discount = appliedCoupon ? `₹${couponDiscount}` : "₹0";

      const response = await emailjs.send(
        "service_wv3wqyt",
        "template_1vmr6gy",
        emailParams
      );

      if (response.status === 200) {
        console.log("✅ Order confirmation email sent successfully!");
        return true;
      }
    } catch (error) {
      console.error("❌ Failed to send confirmation email:", error);
      return false;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!selectedAddress) {
      glassToast("Please select or add an address before placing order", "error");
      return;
    }

    try {
      let orderItems = [];

      for (const itemId in cartItems) {
        const cartItem = cartItems[itemId];
        if (typeof cartItem === "object" && !Array.isArray(cartItem)) {
          for (const size in cartItem) {
            const quantity = cartItem[size];
            if (quantity > 0) {
              const productInfo = products.find(
                (product) => product._id === itemId
              );
              if (productInfo) {
                orderItems.push({ ...productInfo, size, quantity });
              }
            }
          }
        } else if (typeof cartItem === "number" && cartItem > 0) {
          const productInfo = products.find(
            (product) => product._id === itemId
          );
          if (productInfo) {
            orderItems.push({ ...productInfo, size: "N/A", quantity: cartItem });
          }
        }
      }

      if (orderItems.length === 0) {
        glassToast("Your cart is empty!", "error");
        return;
      }

      const totalAmount = getFinalAmount();
      const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;

      const orderData = {
        address: selectedAddress,
        items: orderItems,
        amount: totalAmount,
        method,
        priorityDelivery,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount: couponDiscount,
      };

      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        const backendOrderId = response.data.order_id;

        if (appliedCoupon) {
          await axios.post(`${backendUrl}/api/coupon/apply`, {
            code: appliedCoupon.code,
          });
        }

        await sendOrderConfirmationEmail({
          ...orderData,
          order_id: backendOrderId,
        });

        glassToast("Order placed successfully!", "success");
        setTimeout(() => {
          glassToast("✨ Order confirmation sent to your email!", "info");
        }, 800);
        setTimeout(() => {
          glassToast(
            priorityDelivery
              ? "✨ Your order will be delivered within 24 hours!"
              : "✨ Our team will personally deliver your order with utmost care",
            "info"
          );
        }, 1600);

        setCartItems({});
        navigate("/orders");
      } else {
        glassToast(response.data.message || "Order placement failed", "error");
      }
    } catch (error) {
      glassToast(error.response?.data?.message || error.message, "error");
    }
  };

  return (
    <>
      <div className="relative bg-gradient-to-b from-white via-gray-100 to-gray-200 min-h-[90vh] py-12">
        <div className="mb-8 mt-8">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex items-center text-gray-600 hover:text-black transition-colors gap-2 text-base sm:text-lg font-light tracking-wide"
          >
            <ChevronLeft size={22} />
            <span>Back to Your Cart</span>
          </button>
        </div>

        <AnimatedBanner />

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col lg:flex-row justify-between gap-10 max-w-7xl mx-auto px-6 sm:px-10 pt-8"
        >
          {/* LEFT SIDE */}
          <div className="w-full lg:max-w-[480px] bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 mt-8">
            <h2 className="text-3xl tracking-[2px] text-gray-900 font-light mb-6 uppercase">
              <span className="font-medium">Delivery</span> Address
            </h2>

            <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <Package className="w-6 h-6 text-gray-800" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Premium Handling & Delivery
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every order is elegantly packed and delivered by our personal team.
                </p>
              </div>
            </div>

            {addresses.length > 0 ? (
              <div className="space-y-3 mb-6">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddress(address)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all duration-300 ${
                      selectedAddress?._id === address._id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{address.street}</p>
                    <p className="text-xs text-gray-600">
                      {address.city}, {address.state} {address.zipcode}
                    </p>
                    <p className="text-xs text-gray-600">{address.country}</p>
                    <p className="text-xs text-gray-600">{address.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">
                No saved addresses found. Please add one.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              className="w-full border border-gray-300 rounded-md py-3 text-sm hover:bg-gray-100 transition-all"
            >
              Manage Addresses
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 mt-8 flex flex-col items-center">

            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              className="flex justify-between items-center w-full max-w-sm border border-gray-300 rounded-md py-3 px-4 bg-gray-50 hover:bg-gray-100 transition-all text-sm text-gray-800 font-medium mb-6"
            >
              {selectedAddress
                ? `Delivering To: ${selectedAddress.firstName} ${selectedAddress.lastName}`
                : "Choose Delivery Address"}
              <ChevronDown size={18} className="text-gray-700" />
            </button>

            {/* Coupon Input */}
            <div className="w-full max-w-md mb-6">
              <CouponInput
                backendUrl={backendUrl}
                cartAmount={getCartAmount()}
                onCouponApply={handleCouponApply}
                appliedCoupon={appliedCoupon}
              />
            </div>

            {/* Cart Total — appliedCoupon passed as prop so discount is always live */}
            <div className="w-full max-w-md mb-6">
              <CartTotal
                priorityDelivery={priorityDelivery}
                setPriorityDelivery={setPriorityDelivery}
                appliedCoupon={appliedCoupon}
              />
            </div>

            <div className="flex items-center justify-center mb-6 gap-2">
              <MapPin className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800 font-medium text-sm tracking-wide">
                Mumbai
              </span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-5 mb-10 max-w-md w-full">
              <button
                type="button"
                onClick={() => setShowPolicy(!showPolicy)}
                className="flex items-center justify-between w-full text-gray-900 font-medium tracking-wide text-sm"
              >
                <span>Payment & Delivery Policy (within Mumbai)</span>
                {showPolicy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showPolicy && (
                <div className="mt-4 text-gray-700 text-sm leading-relaxed border-t border-gray-200 pt-4 space-y-3">
                  <p>
                    For all orders placed within{" "}
                    <strong>Mumbai city limits</strong>, payment is accepted via
                    Cash, UPI, or Digital payment apps at the time of{" "}
                    <span className="font-semibold text-gray-900">
                      Delivery.
                    </span>{" "}
                    You can pay directly to our team once your order is delivered.
                  </p>
                  <p>
                    We also offer{" "}
                    <strong className="text-gray-900">
                      Open Box Delivery
                    </strong>{" "}
                    — your parcel will be unsealed in your presence for
                    verification.
                  </p>
                </div>
              )}
            </div>

            {/* Only this button is type="submit" */}
            <button
              type="submit"
              className="relative overflow-hidden mx-auto px-16 py-3 rounded-md text-sm tracking-widest font-medium shadow-lg transition-all duration-500 group"
              style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
                backgroundSize: "200% 200%",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "0.2em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundPosition = "right center";
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundPosition = "left center";
                e.currentTarget.style.boxShadow = "";
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = "scale(0.97)";
                // inject keyframes once
                if (!document.getElementById("po-style")) {
                  const s = document.createElement("style");
                  s.id = "po-style";
                  s.textContent = `
                    @keyframes poSheen {
                      0%   { left: -120%; }
                      100% { left: 140%; }
                    }
                    @keyframes poGlow {
                      0%,100% { opacity: 0; }
                      50%     { opacity: 1; }
                    }
                    .po-sheen {
                      position: absolute;
                      top: 0; bottom: 0;
                      width: 60%;
                      background: linear-gradient(
                        105deg,
                        transparent 20%,
                        rgba(255,255,255,0.18) 50%,
                        transparent 80%
                      );
                      animation: poSheen 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
                      pointer-events: none;
                      z-index: 2;
                    }
                    .po-glow {
                      position: absolute;
                      inset: 0;
                      border-radius: inherit;
                      background: radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%);
                      animation: poGlow 0.5s ease forwards;
                      pointer-events: none;
                      z-index: 1;
                    }
                  `;
                  document.head.appendChild(s);
                }
                // sheen sweep
                const sheen = document.createElement("span");
                sheen.className = "po-sheen";
                e.currentTarget.appendChild(sheen);
                setTimeout(() => sheen.remove(), 750);
                // glow pulse
                const glow = document.createElement("span");
                glow.className = "po-glow";
                e.currentTarget.appendChild(glow);
                setTimeout(() => glow.remove(), 550);
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onTouchStart={e => {
                e.currentTarget.style.transform = "scale(0.97)";
                if (!document.getElementById("po-style")) {
                  const s = document.createElement("style");
                  s.id = "po-style";
                  s.textContent = `
                    @keyframes poSheen {
                      0%   { left: -120%; }
                      100% { left: 140%; }
                    }
                    @keyframes poGlow {
                      0%,100% { opacity: 0; }
                      50%     { opacity: 1; }
                    }
                    .po-sheen {
                      position: absolute; top: 0; bottom: 0; width: 60%;
                      background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
                      animation: poSheen 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
                      pointer-events: none; z-index: 2;
                    }
                    .po-glow {
                      position: absolute; inset: 0; border-radius: inherit;
                      background: radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%);
                      animation: poGlow 0.5s ease forwards;
                      pointer-events: none; z-index: 1;
                    }
                  `;
                  document.head.appendChild(s);
                }
                const sheen = document.createElement("span");
                sheen.className = "po-sheen";
                e.currentTarget.appendChild(sheen);
                setTimeout(() => sheen.remove(), 750);
                const glow = document.createElement("span");
                glow.className = "po-glow";
                e.currentTarget.appendChild(glow);
                setTimeout(() => glow.remove(), 550);
              }}
              onTouchEnd={e => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Static thin top shimmer line */}
              <span style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                pointerEvents: "none", zIndex: 3,
              }} />
              <span className="relative z-10 tracking-[0.25em]">PLACE ORDER</span>
            </button>

            <div className="mt-12 p-6 border border-gray-300 rounded-2xl bg-white/70 backdrop-blur-lg text-center shadow-lg hover:shadow-2xl transition-all duration-500 max-w-md w-full">
              <div className="flex justify-center mb-4">
                <Gift className="w-8 h-8 text-[#b8860b]" />
              </div>
              <p className="text-lg text-gray-800 font-light mb-4">
                Once you place an order, you'll receive a{" "}
                <span className="font-semibold text-[#b8860b]">
                  complimentary luxury gift
                </span>{" "}
                from us 🎁
              </p>
              <button
                type="button"
                onClick={() => navigate("/our-gifts")}
                className="text-sm tracking-wide border border-[#b8860b] text-[#b8860b] px-8 py-2 rounded-full hover:bg-[#b8860b] hover:text-white transition-all duration-300"
              >
                Click here to view our surprises
              </button>
            </div>
          </div>
        </form>
      </div>

      <WhatsAppButton />

      {showAddressModal && (
        <SavedAddresses
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            fetchAddresses();
          }}
          onSelectAddress={(address) => {
            setSelectedAddress(address);
            setShowAddressModal(false);
          }}
        />
      )}
    </>
  );
};

export default PlaceOrder;