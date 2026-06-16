import { motion } from "framer-motion";
import { useTransitionNavigate } from "../providers/NavigationProvider";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "20%" : "-20%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, transition: { duration: 0.075, ease: "easeOut" } },
  exit: (direction: number) => ({
    x: direction > 0 ? "-20%" : "20%",
    opacity: 0,
    transition: { type: "spring", stiffness: 400, damping: 35 },
  }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { direction } = useTransitionNavigate();

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
