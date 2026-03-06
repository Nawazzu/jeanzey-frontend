export const useRipple = () => {
  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-circle");

    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  return createRipple;
};