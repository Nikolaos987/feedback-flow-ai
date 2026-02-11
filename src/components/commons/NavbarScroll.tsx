"use client"

import { useMotionValueEvent, useScroll } from "framer-motion";
import { ReactNode, useState } from "react";
import { MotionHeader } from "./MotionHeader";

/** Scrolling effectt for the navbar when going down and up*/

export function NavbarScroll({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <MotionHeader
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-20 h-auto w-full bg-white/30 backdrop-blur-sm"
    >
      {children}
    </MotionHeader>
  );
}
