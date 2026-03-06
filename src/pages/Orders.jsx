// frontend/src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import WhatsAppButton from "../components/WhatsAppButton";
import SkeletonOrderCard from "../components/SkeletonOrderCard";
import ComplaintModal, { StatusBadge } from "../components/ComplaintModal";
import { ChevronLeft, X, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Complaint state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintItem, setComplaintItem] = useState(null);
  // Map of "orderId_itemId" → complaint object for quick lookup
  const [complaintsMap, setComplaintsMap] = useState({});

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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

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
        const all = [];
        res.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            all.push({
              ...item,
              orderId: order._id,
              status: item.status || order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              cancellationReason: item.cancellationReason,
              cancellationDate: item.cancellationDate,
            });
          });
        });
        setOrderData(all.reverse());
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's complaints and build a quick lookup map
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
        res.data.complaints.forEach((c) => {
          map[`${c.orderId}_${c.itemId}`] = c;
        });
        setComplaintsMap(map);
      }
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  };

  useEffect(() => {
    loadOrderData();
    loadComplaints();
  }, [token, location]);

  const handleCancelClick = (item) => {
    setSelectedItem(item);
    setShowCancelModal(true);
    setCancellationReason("");
  };

  const handleCancelConfirm = async () => {
    if (!cancellationReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel-item`,
        { orderId: selectedItem.orderId, itemId: selectedItem._id, cancellationReason },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        setShowCancelModal(false);
        setSelectedItem(null);
        setCancellationReason("");
        loadOrderData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order");
    }
  };

  const handleComplaintClick = (item) => {
    setComplaintItem(item);
    setShowComplaintModal(true);
  };

  const handleComplaintClose = () => {
    setShowComplaintModal(false);
    setComplaintItem(null);
    loadComplaints(); // Refresh complaint map after modal closes
  };

  const getProgressStep = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "cancelled": return 0;
      case "order placed": case "placed": case "packing": return 1;
      case "shipped": return 2;
      case "out for delivery": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  const steps = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <>
      <div className="border-t pt-16 px-6 sm:px-12 md:px-24 min-h-screen pb-20">
        {/* Back Button */}
        <div className="mb-8 mt-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-black transition-colors gap-2 text-base sm:text-lg font-light tracking-wide"
          >
            <ChevronLeft size={22} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-2xl mb-8">
          <Title text1="MY" text2="ORDERS" />
        </div>

        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <SkeletonOrderCard key={i} />)
          ) : orderData.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">No orders yet.</p>
          ) : (
            orderData.map((item, index) => {
              const progress = getProgressStep(item.status);
              const isCancelled = item.status?.toLowerCase() === "cancelled";
              const isDelivered = item.status?.toLowerCase() === "delivered";
              const canCancel = !isCancelled && progress < 3;

              // Look up if this item already has a complaint
              const complaintKey = `${item.orderId}_${item._id}`;
              const existingComplaint = complaintsMap[complaintKey] || null;

              const displaySize =
                item.size && item.size.trim() !== "" && item.size.toLowerCase() !== "null"
                  ? item.size
                  : "Regular";

              return (
                <div
                  key={index}
                  className={`py-6 px-6 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                    isCancelled
                      ? "border-red-300 bg-red-50"
                      : isDelivered
                      ? "border-green-200 bg-white"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {isCancelled ? (
                    // ── Cancelled Layout ──
                    <div>
                      <div className="flex items-start gap-6 mb-4">
                        <img
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-red-200 opacity-60"
                          src={item.image[0]}
                          alt={item.name}
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">{item.name}</h3>
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                              CANCELLED
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <p className="font-medium">{currency}{item.price}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Size: {displaySize}</p>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Ordered:</span> {formatDateTime(item.date)}</p>
                            <p><span className="font-medium">Payment:</span> {item.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-sm font-semibold text-red-900 mb-2">❌ Cancellation Details</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-red-800"><span className="font-medium">Reason:</span> {item.cancellationReason}</p>
                          <p className="text-red-700"><span className="font-medium">Cancelled on:</span> {formatDateTime(item.cancellationDate)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // ── Active / Delivered Layout ──
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left: Order Info */}
                      <div className="flex items-start gap-6 lg:w-1/2">
                        <img
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-gray-200"
                          src={item.image[0]}
                          alt={item.name}
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <p className="font-medium">{currency}{item.price}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Size: {displaySize}</p>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Ordered:</span> {formatDateTime(item.date)}</p>
                            <p><span className="font-medium">Payment:</span> {item.paymentMethod}</p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              <span className={`font-medium ${isDelivered ? 'text-green-700' : 'text-gray-900'}`}>
                                {item.status}
                              </span>
                            </p>
                          </div>

                          {/* ── Complaint Status Badge (if exists) ── */}
                          {existingComplaint && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-gray-500 capitalize">{existingComplaint.type} request:</span>
                              <StatusBadge status={existingComplaint.status} />
                              {existingComplaint.adminNote && (
                                <button
                                  type="button"
                                  onClick={() => handleComplaintClick(item)}
                                  className="text-xs text-blue-600 underline hover:text-blue-800"
                                >
                                  View response
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Timeline + Buttons */}
                      <div className="lg:w-1/2 flex flex-col gap-4">
                        {/* Timeline */}
                        <div className="w-full">
                          <div className="flex justify-between text-xs sm:text-sm font-medium mb-2">
                            {steps.map((step, i) => (
                              <span
                                key={i}
                                className={i + 1 <= progress ? "text-black font-semibold" : "text-gray-400"}
                              >
                                {step}
                              </span>
                            ))}
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-900 to-gray-600 transition-all duration-700"
                              style={{
                                width:
                                  progress === 1 ? "25%" :
                                  progress === 2 ? "50%" :
                                  progress === 3 ? "75%" :
                                  progress === 4 ? "100%" : "0%"
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Current Status:{" "}
                            <span className={`font-medium ${isDelivered ? 'text-green-700' : 'text-gray-900'}`}>
                              {item.status}
                            </span>
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={loadOrderData}
                            className="flex-1 border border-gray-800 hover:bg-gray-900 hover:text-white transition-all px-4 py-2.5 text-sm font-medium rounded"
                          >
                            Refresh Status
                          </button>

                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => handleCancelClick(item)}
                              className="flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all px-4 py-2.5 text-sm font-medium rounded"
                            >
                              Cancel Order
                            </button>
                          )}

                          {/* ── Help/Return/Refund button — only on Delivered items ── */}
                          {isDelivered && (
                            <button
                              type="button"
                              onClick={() => handleComplaintClick(item)}
                              className={`flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium rounded border transition-all ${
                                existingComplaint
                                  ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                  : 'border-black bg-black text-white hover:bg-gray-800'
                              }`}
                            >
                              <HelpCircle size={15} />
                              {existingComplaint ? 'View Request' : 'Help / Return / Refund'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-light tracking-wide mb-4">Cancel Order?</h3>
            <div className="w-16 h-px bg-gray-900 mb-6"></div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            {selectedItem && (
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedItem.image[0]}
                  alt={selectedItem.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-sm">{selectedItem.name}</p>
                  <p className="text-sm text-gray-600">
                    {currency}{selectedItem.price} • Qty: {selectedItem.quantity}
                  </p>
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation <span className="text-red-600">*</span>
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason, i) => (
                  <option key={i} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded font-light tracking-wide"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded font-light tracking-wide"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint / Return / Refund Modal */}
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