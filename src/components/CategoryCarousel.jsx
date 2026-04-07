import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import p16 from "../assets/p16.webp";
import p17 from "../assets/p17.webp";
import p20 from "../assets/p20.webp";
import p21 from "../assets/p21.webp";
import p22 from "../assets/p22.webp";
import p24 from "../assets/p24.webp";

const CARDS = [
  {
    label: "Baggy Jeans",
    sub: "Oversized & Relaxed",
    img: p16,
  },
  {
    label: "Wide Leg",
    sub: "Bold Silhouettes",
    img: p17,
  },
  {
    label: "Retro",
    sub: "Street-Ready Style",
    img: p20,
  },
  {
    label: "Denim",
    sub: "Classic Indigo",
    img: p21,
  },
  {
    label: "Street Fit",
    sub: "Modern Edge",
    img: p22,
  },
  {
    label: "Everyday Wear",
    sub: "Essential Styles",
    img: p24,
  },
];


const CategoryCarousel = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef(null);
  const dragDelta = useRef(0);

  // ── Pointer drag / swipe ──
  const onPointerDown = (e) => {
    setIsDragging(false);
    dragStart.current = e.clientX;
    dragDelta.current = 0;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

const onPointerMove = (e) => {
  if (dragStart.current === null) return;
  dragDelta.current = e.clientX - dragStart.current;

  if (Math.abs(dragDelta.current) > 6) setIsDragging(true);

  // ✅ Smooth live movement
  setDragOffset(dragDelta.current);
};

const onPointerUp = () => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);

  if (Math.abs(dragDelta.current) > 40) {
    if (dragDelta.current < 0) {
      setActiveIdx((p) => (p + 1) % CARDS.length);
    } else {
      setActiveIdx((p) => (p - 1 + CARDS.length) % CARDS.length);
    }
  }

  // ✅ Reset smoothly
  setDragOffset(0);

  dragStart.current = null;
  dragDelta.current = 0;

  setTimeout(() => setIsDragging(false), 50);
};

  const handleCardClick = (idx) => {
    if (isDragging) return;
    if (idx === activeIdx) {
      navigate("/collection");
    } else {
      setActiveIdx(idx);
    }
  };

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(28px,6vw,60px) 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .cc-section { user-select: none;
        touch-action: pan-y;
         }

        .cc-card {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          will-change: transform, opacity;
          transition: transform 0.55s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.55s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.55s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 8px 40px rgba(0,0,0,0.6);
        }
        .cc-card:hover { box-shadow: 0 16px 60px rgba(0,0,0,0.8); }
        .cc-img {
          width: 100%; height: "clamp(260px,50vw,420px)";
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
          display: block;
        }
        .cc-card:hover .cc-img { transform: scale(1.04); }
        .cc-label-wrap {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: clamp(16px,3vw,28px);
          background: linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
        }
        .cc-label {
          font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
          font-weight: 400;
          color: #fff;
          letter-spacing: 0.03em;
          margin: 0 0 2px;
          line-height: 1.1;
        }
        .cc-sub {
          font-family: sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }
        .cc-active-badge {
          position: absolute; top: 16px; left: 16px;
          font-family: sans-serif;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 5px 12px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .cc-tap-hint {
          position: absolute; bottom: 72px; left: 50%; transform: translateX(-50%);
          font-family: sans-serif; font-size: 9px; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          padding: 6px 16px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap; pointer-events: none;
          animation: tapPulse 2s ease-in-out infinite;
        }
        @keyframes tapPulse {
          0%,100% { opacity: 0.7; } 50% { opacity: 1; }
        }
   .cc-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 18px;
}

.cc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db; /* light grey visible */
  transition: all 0.3s ease;
  cursor: pointer;
}

.cc-dot.active {
  background: #2c2f36; /* dark active */
  width: 22px;
  border-radius: 4px;
}
        .cc-arrow {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .cc-arrow:hover { background: rgba(184,134,11,0.3); border-color: #b8860b; color: #fff; }
        .cc-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
        .cc-header { text-align: center; margin-bottom: clamp(32px,5vw,52px); padding: 0 24px; }
   .cc-eyebrow {
  font-family: sans-serif;
  font-size: 11px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #92620a;
  margin: 0 0 14px;
}
     .cc-title {
  font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
  font-weight: 400;
  font-size: clamp(36px, 6vw, 72px);
  letter-spacing: -0.02em;
  color: #2c2f36;
  line-height: 1.05;
  text-align: center;
}
     .cc-title em {
  font-style: italic;
  color: #8b8f97;
  font-weight: 400;
}
      `}</style>

      {/* Header */}
      <div className="cc-header">
        <p className="cc-eyebrow">Jean-Zey · Explore the range</p>
        <h2 className="cc-title">
          Wardrobe<em>Essentials</em>
        </h2>
      </div>

      {/* Card track */}
      <div
        ref={trackRef}
        className="cc-section"
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(360px,65vw,580px)",
        }}
        onPointerDown={onPointerDown}
      >
        {CARDS.map((card, idx) => {
          const total = CARDS.length;

          let offset = idx - activeIdx;

          // 🔥 infinite loop adjustment
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const absOffset = Math.abs(offset); // ✅ FIX

          // Layout math
          const cardW = "clamp(200px,36vw,320px)";
          const cardH = "clamp(280px,52vw,460px)";
          const xShift =
            offset *
            (absOffset === 0 ? 0 : 1) *
            (window.innerWidth < 640 ? 90 : 130);
          const scale =
            absOffset === 0
              ? 1
              : absOffset === 1
                ? 0.82
                : absOffset === 2
                  ? 0.68
                  : 0.56;
          const zIndex = 10 - absOffset;
          const opacity =
            absOffset > 2
              ? 0
              : absOffset === 2
                ? 0.45
                : absOffset === 1
                  ? 0.75
                  : 1;
          const rotate = offset * (window.innerWidth < 640 ? 4 : 6);

          return (
            <div
              key={idx}
              className="cc-card"
              style={{
                width: cardW,
                height: cardH,
         transform: `translate(-50%, -50%) translateX(${xShift + dragOffset * 0.35}px) scale(${scale}) rotate(${rotate}deg)`,
                zIndex,
                opacity,
              }}
              onClick={() => handleCardClick(idx)}
            >
              <img
                src={card.img}
                alt={card.label}
                className="cc-img"
                draggable="false"
              />
              {/* Label */}
              <div className="cc-label-wrap">
                <p
                  className="cc-label"
                  style={{ fontSize: "clamp(18px,3vw,26px)" }}
                >
                  {card.label}
                </p>
                <p className="cc-sub">{card.sub}</p>
              </div>
              {/* Active badge */}
              {idx === activeIdx && (
                <div className="cc-active-badge">Tap to Shop</div>
              )}
            </div>
          );
        })}

        {/* Tap hint on active card */}
        <div className="cc-tap-hint">Swipe to explore</div>
      </div>

      {/* Dots + arrows */}
      <div className="cc-dots">
        {CARDS.map((_, idx) => (
          <div
            key={idx}
            className={`cc-dot ${idx === activeIdx ? "active" : ""}`}
            onClick={() => setActiveIdx(idx)}
          />
        ))}
      </div>
      {/* <div className="cc-arrows">
        <button
          className="cc-arrow"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx((p) => Math.max(p - 1, 0))}
        >
          ←
        </button>
        <button
          className="cc-arrow"
          disabled={activeIdx === CARDS.length - 1}
          onClick={() => setActiveIdx((p) => Math.min(p + 1, CARDS.length - 1))}
        >
          →
        </button>
      </div> */}
    </section>
  );
};

export default CategoryCarousel;
