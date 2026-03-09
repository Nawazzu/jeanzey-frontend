// frontend/src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import WhatsAppButton from "../components/WhatsAppButton";
import SkeletonOrderCard from "../components/SkeletonOrderCard";
import ComplaintModal, { StatusBadge } from "../components/ComplaintModal";
import { ChevronLeft, X, HelpCircle, Package, Zap, Tag, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orderData, setOrderData]             = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedItem, setSelectedItem]       = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [expandedBreakdown, setExpandedBreakdown]   = useState({});

  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintItem, setComplaintItem]           = useState(null);
  const [complaintsMap, setComplaintsMap]           = useState({});

  const location = useLocation();

  const cancellationReasons = [
    "Found a better price elsewhere",
    "Changed my mind",
    "Ordered by mistake",
    "Delivery time too long",
    "Product not needed anymore",
    "Quality concerns",
    "Other",
  ];

  // ── 12-hour format ──────────────────────────────────────────────────────
  const formatDateTime = (timestamp) => {
    const date  = new Date(timestamp);
    const day   = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year  = date.getFullYear();
    let   hours = date.getHours();
    const mins  = String(date.getMinutes()).padStart(2, "0");
    const ampm  = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} at ${hours}:${mins} ${ampm}`;
  };

  const formatDateOnly = (timestamp) =>
    new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

  // ── Load orders (grouped by orderId) ────────────────────────────────────
  const loadOrderData = async () => {
    if (!token) { setIsLoading(false); return; }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        const grouped = res.data.orders.map((order) => ({
          orderId:            order._id,
          date:               order.date,
          payment:            order.payment,
          paymentMethod:      order.paymentMethod,
          status:             order.status,
          amount:             order.amount,
          priorityDelivery:   order.priorityDelivery   || false,
          priorityDeliveryFee:order.priorityDeliveryFee|| 100,
          couponCode:         order.couponCode         || null,
          couponDiscount:     order.couponDiscount      || 0,
          items: order.items.map((item) => ({
            ...item,
            orderId:            order._id,
            status:             item.status || order.status,
            payment:            order.payment,
            paymentMethod:      order.paymentMethod,
            date:               order.date,
            cancellationReason: item.cancellationReason,
            cancellationDate:   item.cancellationDate,
          })),
        }));
        grouped.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrderData(grouped);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const loadComplaints = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/complaint/user-list`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        const map = {};
        res.data.complaints.forEach((c) => { map[`${c.orderId}_${c.itemId}`] = c; });
        setComplaintsMap(map);
      }
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  useEffect(() => { loadOrderData(); loadComplaints(); }, [token, location]);

  const handleCancelClick   = (item) => { setSelectedItem(item); setShowCancelModal(true); setCancellationReason(""); };
  const handleComplaintClick = (item) => { setComplaintItem(item); setShowComplaintModal(true); };
  const handleComplaintClose = ()     => { setShowComplaintModal(false); setComplaintItem(null); loadComplaints(); };

  const handleCancelConfirm = async () => {
    if (!cancellationReason) { toast.error("Please select a reason for cancellation"); return; }
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel-item`,
        { orderId: selectedItem.orderId, itemId: selectedItem._id, cancellationReason },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        setShowCancelModal(false); setSelectedItem(null); setCancellationReason("");
        loadOrderData();
      } else { toast.error(res.data.message); }
    } catch (error) { console.error(error); toast.error("Failed to cancel order"); }
  };

  const getProgressStep = (status) => {
    switch (status?.toLowerCase()) {
      case "cancelled":                                    return 0;
      case "order placed": case "placed": case "packing": return 1;
      case "shipped":                                      return 2;
      case "out for delivery":                             return 3;
      case "delivered":                                    return 4;
      default:                                             return 1;
    }
  };

  const steps = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

  const getDisplaySize = (item) =>
    item.size && item.size.trim() !== "" && item.size.toLowerCase() !== "null"
      ? item.size : "Regular";

  // ── Progress bar ─────────────────────────────────────────────────────────
  const ProgressBar = ({ progress, isDelivered, status, isPriority }) => (
    <div className="w-full">
      <div className="flex justify-between text-[10px] sm:text-xs font-medium mb-2">
        {steps.map((step, i) => (
          <span key={i} className={
            i + 1 <= progress
              ? isPriority ? "text-black font-bold" : "text-black font-semibold"
              : "text-gray-300"
          }>{step}</span>
        ))}
      </div>
      <div className={`relative w-full h-1.5 rounded-full overflow-hidden ${isPriority ? "bg-gray-200" : "bg-gray-200"}`}>
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-700 ${
            isPriority
              ? "bg-gradient-to-r from-yellow-400 to-yellow-300"
              : "bg-gradient-to-r from-gray-900 to-gray-600"
          }`}
          style={{ width: progress === 1 ? "25%" : progress === 2 ? "50%" : progress === 3 ? "75%" : progress === 4 ? "100%" : "0%" }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
        Status:{" "}
        <span className={`font-semibold ${isDelivered ? "text-green-700" : isPriority ? "text-black" : "text-gray-900"}`}>
          {status}
        </span>
      </p>
    </div>
  );

  // ── Price breakdown panel ─────────────────────────────────────────────────
  const PriceBreakdown = ({ order }) => {
    const { orderId, items, priorityDelivery, priorityDeliveryFee, couponCode, couponDiscount, amount } = order;
    const isOpen = expandedBreakdown[orderId];

    const activeItems   = items.filter((i) => i.status?.toLowerCase() !== "cancelled");
    const subtotal      = activeItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping      = 50;
    const priorityFee   = priorityDelivery ? (priorityDeliveryFee || 100) : 0;
    const discount      = couponDiscount || 0;
    const computedTotal = subtotal + shipping + priorityFee - discount;

    return (
      <div className={`mt-3 rounded-lg border overflow-hidden ${
        priorityDelivery
          ? "border-gray-200 bg-gray-50/40"
          : "border-gray-100 bg-gray-50/60"
      }`}>
        {/* Toggle row */}
        <button
          type="button"
          onClick={() => setExpandedBreakdown((p) => ({ ...p, [orderId]: !p[orderId] }))}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
            priorityDelivery
              ? "text-gray-700 hover:bg-gray-100/60"
              : "text-gray-600 hover:bg-gray-100/60"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Tag size={11} />
            Price Breakdown · <span className={`font-bold ${priorityDelivery ? "text-gray-900" : "text-gray-900"}`}>{currency}{amount}</span>
          </span>
          {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {isOpen && (
          <div className="px-4 pb-3 space-y-1.5 text-xs border-t border-dashed border-gray-200">
            {/* Items subtotal */}
            <div className="flex justify-between pt-2.5">
              <span className="text-gray-500">
                Items ({activeItems.length} × subtotal)
              </span>
              <span className="font-medium text-gray-800">{currency}{subtotal}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-gray-500">
                <Truck size={10} />
                Shipping
              </span>
              <span className="font-medium text-gray-800">{currency}{shipping}</span>
            </div>

            {/* Priority fee */}
            {priorityDelivery && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-black font-semibold">
                  <Zap size={10} className="fill-yellow-400 text-yellow-400" />
                  Same-Day Priority Fee
                </span>
                <span className="font-semibold text-black">+{currency}{priorityFee}</span>
              </div>
            )}

            {/* Coupon */}
            {couponCode && discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <Tag size={10} />
                  Coupon: <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold border border-green-200">{couponCode}</span>
                </span>
                <span className="font-semibold text-green-700">−{currency}{discount}</span>
              </div>
            )}
            {(!couponCode || discount === 0) && (
              <div className="flex justify-between items-center opacity-50">
                <span className="flex items-center gap-1 text-gray-400">
                  <Tag size={10} />
                  No coupon applied
                </span>
                <span className="text-gray-400">—</span>
              </div>
            )}

            {/* Divider + Total */}
            <div className={`flex justify-between items-center pt-2 mt-1 border-t font-bold text-sm ${
              priorityDelivery ? "border-gray-200 text-gray-900" : "border-gray-200 text-gray-900"
            }`}>
              <span>Total</span>
              <span>{currency}{computedTotal}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════
  // UNIFIED ORDER CARD — works for both single & multi-item
  // ════════════════════════════════════════════════════════════════════════
  const renderOrderCard = (order) => {
    const { orderId, date, paymentMethod, amount, items, priorityDelivery } = order;

    const allCancelled  = items.every((i) => i.status?.toLowerCase() === "cancelled");
    const someCancelled = items.some((i)  => i.status?.toLowerCase() === "cancelled");
    const allDelivered  = items.every((i) => i.status?.toLowerCase() === "delivered");
    const repItem       = items.find((i) => i.status?.toLowerCase() !== "cancelled") || items[0];
    const progress      = getProgressStep(repItem.status);
    const isMulti       = items.length > 1;

    // ── Card border/bg: priority (gold) > cancelled (red) > delivered (green) > default ──
    const cardClass = priorityDelivery && !allCancelled
      ? "border-black bg-white shadow-md"
      : allCancelled
      ? "border-red-300 bg-red-50"
      : allDelivered
      ? "border-green-200 bg-white"
      : "border-gray-200 bg-white";

    return (
      <div className={`border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${cardClass}`}>

        {/* ── TOP BANNER ─────────────────────────────────────────────── */}
        <div className={`px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
          priorityDelivery && !allCancelled
            ? "bg-black border-black"
            : allCancelled
            ? "bg-red-100 border-red-200"
            : "bg-gray-50 border-gray-200"
        }`}>
          {/* Left: label chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Package size={13} className={priorityDelivery && !allCancelled ? "text-white" : "text-gray-400"} />
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-[1.5px] uppercase ${
              priorityDelivery && !allCancelled ? "text-white" : "text-gray-500"
            }`}>
              {isMulti ? `${items.length} Items` : "1 Item"}
            </span>

            {priorityDelivery && !allCancelled && (
              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-yellow-400 text-black border border-yellow-500 px-2 py-0.5 rounded-full">
                <Zap size={9} className="fill-black" />
                Same-Day Priority
              </span>
            )}
            {someCancelled && !allCancelled && (
              <span className="text-[9px] sm:text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full">
                Partial Cancellation
              </span>
            )}
            {allCancelled && (
              <span className="text-[9px] sm:text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                Fully Cancelled
              </span>
            )}
          </div>

          {/* Right: date + payment */}
          <div className={`text-[10px] sm:text-[11px] font-medium text-right leading-snug ${
            priorityDelivery && !allCancelled ? "text-gray-300" : "text-gray-400"
          }`}>
            <span>{formatDateTime(date)}</span>
            <span className="mx-1">·</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        {/* ── PROGRESS BAR (skip if all cancelled) ────────────────────── */}
        {!allCancelled && (
          <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-gray-100/80">
            <ProgressBar
              progress={progress}
              isDelivered={allDelivered}
              status={repItem.status}
              isPriority={priorityDelivery}
            />
          </div>
        )}

        {/* ── ITEMS LIST ──────────────────────────────────────────────── */}
        <div className="divide-y divide-gray-100">
          {items.map((item, idx) => {
            const isCancelled       = item.status?.toLowerCase() === "cancelled";
            const isItemDelivered   = item.status?.toLowerCase() === "delivered";
            const canCancel         = !isCancelled && getProgressStep(item.status) < 3;
            const complaintKey      = `${orderId}_${item._id}`;
            const existingComplaint = complaintsMap[complaintKey] || null;

            return (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4 ${isCancelled ? "opacity-60" : ""}`}>

                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image[0]} alt={item.name} loading="lazy"
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 ${
                      isCancelled
                        ? "border-red-200 grayscale"
                        : priorityDelivery
                        ? "border-yellow-400"
                        : "border-gray-200"
                    }`}
                  />
                  {isCancelled && (
                    <div className="absolute inset-0 flex items-end justify-center pb-1 rounded-lg">
                      <span className="text-[8px] font-bold text-red-600 bg-white/95 px-1.5 py-0.5 rounded border border-red-200 shadow-sm">
                        CANCELLED
                      </span>
                    </div>
                  )}
                  {priorityDelivery && !isCancelled && (
                    <div className="absolute -top-1.5 -right-1.5">
                      <span className="flex items-center justify-center w-5 h-5 bg-yellow-400 rounded-full shadow-sm border border-yellow-500">
                        <Zap size={10} className="text-black fill-black" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  {/* Name + price row */}
                  <div className="flex flex-wrap items-start justify-between gap-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-snug pr-2">{item.name}</h3>
                    <span className={`text-sm font-bold tabular-nums flex-shrink-0 ${
                      isCancelled
                        ? "text-gray-400 line-through"
                        : priorityDelivery
                        ? "text-black"
                        : "text-gray-900"
                    }`}>
                      {currency}{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-1">
                    <span>Size: <b className="text-gray-700">{getDisplaySize(item)}</b></span>
                    <span>Qty: <b className="text-gray-700">{item.quantity}</b></span>
                    <span>
                      {currency}{item.price}
                      <span className="text-gray-400"> /pc</span>
                    </span>
                  </div>

                  {/* Status (for single-item or if item has different status in multi) */}
                  {(!isMulti || isCancelled || isItemDelivered) && (
                    <div className={`inline-flex items-center mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isCancelled
                        ? "bg-red-50 text-red-600 border-red-200"
                        : isItemDelivered
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}>
                      {item.status}
                    </div>
                  )}

                  {/* Cancellation reason */}
                  {isCancelled && item.cancellationReason && (
                    <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <span className="font-semibold">Reason:</span> {item.cancellationReason}
                      {item.cancellationDate && (
                        <span className="block text-red-400 mt-0.5">{formatDateTime(item.cancellationDate)}</span>
                      )}
                    </div>
                  )}

                  {/* Complaint badge */}
                  {existingComplaint && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500 capitalize">{existingComplaint.type} request:</span>
                      <StatusBadge status={existingComplaint.status} />
                      {existingComplaint.adminNote && (
                        <button type="button" onClick={() => handleComplaintClick(item)}
                          className="text-xs text-blue-600 underline hover:text-blue-800">View response</button>
                      )}
                    </div>
                  )}

                  {/* Per-item action buttons */}
                  {!isCancelled && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {canCancel && (
                        <button type="button" onClick={() => handleCancelClick(item)}
                          className="text-xs border border-red-400 text-red-600 hover:bg-red-600 hover:text-white transition-all px-3 py-1.5 rounded-lg font-medium">
                          {isMulti ? "Cancel This Item" : "Cancel Order"}
                        </button>
                      )}
                      {isItemDelivered && (
                        <button type="button" onClick={() => handleComplaintClick(item)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            existingComplaint
                              ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                              : priorityDelivery
                              ? "border-black bg-black text-yellow-400 hover:bg-gray-900"
                              : "border-black bg-black text-white hover:bg-gray-800"
                          }`}>
                          <HelpCircle size={11} />
                          {existingComplaint ? "View Request" : "Help / Return / Refund"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── PRICE BREAKDOWN (collapsible) ──────────────────────────── */}
        <div className="px-4 sm:px-6 pb-4">
          <PriceBreakdown order={order} />
        </div>

        {/* ── ORDER INFO + REFRESH ─────────────────────────────────────── */}
        {!allCancelled && (
          <div className={`px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
            priorityDelivery ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/40"
          }`}>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <p><span className="font-medium text-gray-500">Ordered:</span> {formatDateTime(date)}</p>
              <p><span className="font-medium text-gray-500">Payment:</span> {paymentMethod}</p>
            </div>
            <button type="button" onClick={loadOrderData}
              className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all w-full sm:w-auto ${
                priorityDelivery
                  ? "border-black text-black hover:bg-black hover:text-yellow-400"
                  : "border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white"
              }`}>
              Refresh Status
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Informative separator ─────────────────────────────────────────────────
  const OrderSeparator = ({ prevOrder, nextOrder }) => {
    const prevDate = formatDateOnly(prevOrder.date);
    const nextDate = formatDateOnly(nextOrder.date);
    const sameDay  = prevDate === nextDate;
    const msPerDay = 86_400_000;
    const daysAgo  = Math.round((Date.now() - new Date(nextOrder.date)) / msPerDay);
    const daysLabel =
      daysAgo === 0 ? "Today" :
      daysAgo === 1 ? "Yesterday" :
      daysAgo < 7   ? `${daysAgo} days ago` :
      daysAgo < 30  ? `${Math.round(daysAgo / 7)} week${Math.round(daysAgo / 7) > 1 ? "s" : ""} ago` :
                      nextDate;
    const label = sameDay ? `Same day · ${prevDate}` : daysLabel;

    return (
      <div className="flex items-center gap-3 my-6 select-none px-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-gray-200" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm">
          <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
          <span className="text-[10px] font-semibold tracking-[2px] text-gray-400 uppercase whitespace-nowrap">{label}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-200 to-gray-200" />
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <>
      <div className="border-t pt-16 px-4 sm:px-8 md:px-16 lg:px-24 min-h-screen pb-20">

        {/* Back */}
        <div className="mb-6 mt-6 sm:mb-8 sm:mt-8">
          <button type="button" onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-black transition-colors gap-2 text-sm sm:text-base font-light tracking-wide">
            <ChevronLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-2xl mb-6 sm:mb-8">
          <Title text1="MY" text2="ORDERS" />
        </div>

        <div>
          {isLoading ? (
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => <SkeletonOrderCard key={i} />)}
            </div>
          ) : orderData.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">No orders yet.</p>
          ) : (
            orderData.map((order, index) => {
              const isLast = index === orderData.length - 1;
              return (
                <div key={order.orderId}>
                  {renderOrderCard(order)}
                  {!isLast && (
                    <OrderSeparator
                      prevOrder={order}
                      nextOrder={orderData[index + 1]}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Cancel Modal ─────────────────────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 relative shadow-2xl">
            <button type="button" onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={22} />
            </button>
            <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-3">Cancel Order?</h3>
            <div className="w-12 h-px bg-gray-900 mb-5" />
            <p className="text-gray-600 mb-5 leading-relaxed text-sm">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            {selectedItem && (
              <div className="flex items-center gap-4 mb-5 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <img src={selectedItem.image[0]} alt={selectedItem.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" />
                <div>
                  <p className="font-medium text-sm">{selectedItem.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currency}{selectedItem.price} · Qty: {selectedItem.quantity}</p>
                </div>
              </div>
            )}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation <span className="text-red-600">*</span>
              </label>
              <select value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900">
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason, i) => (
                  <option key={i} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg text-sm font-light">
                Keep Order
              </button>
              <button type="button" onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg text-sm font-light">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Complaint Modal ───────────────────────────────────────────────── */}
      {showComplaintModal && complaintItem && (
        <ComplaintModal
          item={complaintItem}
          backendUrl={backendUrl}
          token={token}
          onClose={handleComplaintClose}
          existingComplaint={complaintsMap[`${complaintItem.orderId}_${complaintItem._id}`] || null}
        />
      )}

      <WhatsAppButton />
    </>
  );
};

export default Orders;