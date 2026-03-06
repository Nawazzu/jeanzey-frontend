export const flyToCart = (imgEl, cartEl) => {
  if (!imgEl || !cartEl) return;

  const imgRect = imgEl.getBoundingClientRect();
  const cartRect = cartEl.getBoundingClientRect();

  const clone = imgEl.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.zIndex = 9999;
  clone.style.left = `${imgRect.left}px`;
  clone.style.top = `${imgRect.top}px`;
  clone.style.width = `${imgRect.width}px`;
  clone.style.height = `${imgRect.height}px`;
  clone.style.objectFit = "cover";
  clone.style.borderRadius = "12px";
  clone.style.transition = "all 0.8s cubic-bezier(0.65, -0.2, 0.3, 1.4)";
  clone.style.pointerEvents = "none";
  clone.style.boxShadow = "0 10px 40px rgba(0,0,0,0.3)";

  document.body.appendChild(clone);

  // Trigger animation on next frame
  requestAnimationFrame(() => {
    clone.style.left = `${cartRect.left + cartRect.width / 2}px`;
    clone.style.top = `${cartRect.top}px`;
    clone.style.width = "30px";
    clone.style.height = "30px";
    clone.style.opacity = "0";
    clone.style.transform = "scale(0.2) rotate(360deg)";
  });

  // Remove after animation
  setTimeout(() => {
    clone.remove();
  }, 800);
};