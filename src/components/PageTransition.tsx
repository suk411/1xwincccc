import { motion } from "framer-motion";
import { useTransitionNavigate } from "../providers/NavigationProvider";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "20%" : "-20%",
  }),
  center: { x: 0 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-20%" : "20%",
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
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
