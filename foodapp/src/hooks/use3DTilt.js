import { useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook that applies 3D tilt effect to an element based on mouse position.
 * Uses CSS custom properties --rx and --ry to control rotation.
 * 
 * @param {Object} options
 * @param {number} options.max - Maximum tilt angle in degrees (default: 15)
 * @param {number} options.speed - Transition speed in ms (default: 400)
 * @param {boolean} options.glare - Whether to show a glare overlay (default: false)
 * @returns {Object} ref - Attach this ref to the element you want to tilt
 */
const use3DTilt = ({ max = 15, speed = 400, glare = false } = {}) => {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation values
    const rotateX = ((y - centerY) / centerY) * -max;
    const rotateY = ((x - centerX) / centerX) * max;

    el.style.setProperty('--rx', `${rotateX}deg`);
    el.style.setProperty('--ry', `${rotateY}deg`);
    el.style.transition = `transform ${speed * 0.1}ms ease-out`;

    // Glare effect
    if (glare) {
      const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;
      const glareOpacity = Math.min(
        Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / Math.max(centerX, centerY) * 0.4,
        0.4
      );
      el.style.setProperty('--glare-angle', `${glareAngle}deg`);
      el.style.setProperty('--glare-opacity', glareOpacity);
    }
  }, [max, speed, glare]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.transition = `transform ${speed}ms ease-out`;

    if (glare) {
      el.style.setProperty('--glare-opacity', 0);
    }
  }, [speed, glare]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
};

export default use3DTilt;
