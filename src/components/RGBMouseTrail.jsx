import { useEffect, useRef } from "react";

export default function MouseFollower({
  size = 12,
  speed = 0.07,
}) {
  const dotRef = useRef(null);
  const haloRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const halo = useRef({ x: 0, y: 0 });

  const visible = useRef(false);

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    mouse.current = { x: centerX, y: centerY };
    current.current = { x: centerX, y: centerY };
    halo.current = { x: centerX, y: centerY };

    const handleMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      visible.current = true;
    };

    const handleEnter = () => {
      visible.current = true;
    };

    const handleLeave = () => {
      visible.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseenter", handleEnter);
    window.addEventListener("mouseleave", handleLeave);

    let raf;

    const animate = () => {
      current.current.x +=
        (mouse.current.x - current.current.x) * speed;

      current.current.y +=
        (mouse.current.y - current.current.y) * speed;

      halo.current.x +=
        (mouse.current.x - halo.current.x) *
        (speed * 0.35);

      halo.current.y +=
        (mouse.current.y - halo.current.y) *
        (speed * 0.35);

      const dx =
        mouse.current.x - current.current.x;

      const dy =
        mouse.current.y - current.current.y;

      const velocity = Math.min(
        Math.sqrt(dx * dx + dy * dy),
        100
      );

      const angle =
        Math.atan2(dy, dx) *
        (180 / Math.PI);

      const stretch = velocity * 0.015;

      const scaleX = 1 + stretch;

      const scaleY = Math.max(
        0.75,
        1 - stretch * 0.5
      );

      const opacity = visible.current ? 1 : 0;

      if (dotRef.current) {
        dotRef.current.style.opacity = opacity;

        dotRef.current.style.transform = `
          translate3d(
            ${current.current.x - size / 2}px,
            ${current.current.y - size / 2}px,
            0
          )
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      if (haloRef.current) {
        haloRef.current.style.opacity = opacity;

        haloRef.current.style.transform = `
          translate3d(
            ${halo.current.x - 30}px,
            ${halo.current.y - 30}px,
            0
          )
        `;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseenter",
        handleEnter
      );

      window.removeEventListener(
        "mouseleave",
        handleLeave
      );

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [size, speed]);

  return (
    <>
      {/* Cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",

          width: `${size}px`,
          height: `${size}px`,

          borderRadius: "9999px",

          background:
            "rgba(15,15,15,.85)",

          backdropFilter:
            "blur(12px)",

          WebkitBackdropFilter:
            "blur(12px)",

          border:
            "1px solid rgba(255,255,255,.08)",

          pointerEvents: "none",

          zIndex: 9999,

          opacity: 0,

          willChange:
            "transform, opacity",

          transform:
            "translate3d(0,0,0)",

          transition:
            "opacity .2s ease",
        }}
      />
    </>
  );
}