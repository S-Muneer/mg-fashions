import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0,
  type = "fadeUp" 
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animationMap = {
    fadeUp: "fadeInUp",
    scaleIn: "scaleIn",
    slideLeft: "fadeInLeft",
    slideDown: "fadeInDown",
    slideUp: "slideUp",
  };

  const animationType = animationMap[type] || "fadeInUp";

  return (
    <div
      ref={ref}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: visible ? `${animationType} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : "none",
        opacity: visible ? 1 : 0
      }}
      className={className}
    >
      {children}
    </div>
  );
}
