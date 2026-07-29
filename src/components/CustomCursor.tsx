import { useEffect, useRef } from "react";

/**
 * Premium minimal hardware-accelerated floating cursor dot (widescreen only).
 * Mounted once at the router root so it works globally across every route
 * without duplicating listeners or re-mounting on navigation.
 */
export default function CustomCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHidden = true;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (isHidden) {
        // Snap instantly to the initial coordinate upon first movement
        currentX = targetX;
        currentY = targetY;
        isHidden = false;
        wrapper.style.opacity = "1";
      }
    };

    const handleMouseEnter = () => {
      wrapper.style.opacity = "1";
    };
    const handleMouseLeave = () => {
      wrapper.style.opacity = "0";
    };

    const updateCursorPosition = () => {
      // Easing speed: 0.25 creates a sleek, snappy, fast responsive inertia effect
      const ease = 0.25;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      // Translate 3D for hardware acceleration, offset by half of 12px diameter to center it
      wrapper.style.transform = `translate3d(${currentX - 6}px, ${currentY - 6}px, 0)`;

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    animationFrameId = requestAnimationFrame(updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="minimal-cursor-wrapper"
      className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[10000] will-change-transform opacity-0 transition-opacity duration-300"
      style={{ transform: "translate3d(-100px, -100px, 0)", width: "12px", height: "12px" }}
    >
      <div id="minimal-dot-cursor" className="w-full h-full bg-[#FF6B00] rounded-full" />
    </div>
  );
}
