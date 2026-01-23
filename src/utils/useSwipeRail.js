import { useRef } from 'react';

export function useSwipeRail({
  threshold = 120,
  maxAngle = 12,
  onLeft,
  onRight,
}) {
  const ref = useRef(null);

  let startX = 0;
  let currentX = 0;
  let active = false;

  const onPointerDown = (e) => {
    startX = e.clientX;
    active = true;
    ref.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!active || !ref.current) return;

    currentX = e.clientX - startX;
    const progress = currentX / threshold;
    const angle = Math.max(-1, Math.min(1, progress)) * maxAngle;
    const yOffset = Math.abs(currentX) * 0.08;

    ref.current.style.transform = `
      translate(${currentX}px, ${yOffset}px)
      rotate(${angle}deg)
    `;
  };

  const onPointerUp = () => {
    if (!active || !ref.current) return;
    active = false;

    if (currentX > threshold) onRight?.();
    else if (currentX < -threshold) onLeft?.();

    // snap back
    ref.current.style.transition = 'transform 200ms ease';
    ref.current.style.transform = 'translateX(0) rotate(0deg)';

    setTimeout(() => {
      if (ref.current) ref.current.style.transition = '';
    }, 200);

    currentX = 0;
  };

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
