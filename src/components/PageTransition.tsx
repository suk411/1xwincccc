import { motion } from "framer-motion";
import { useTransitionNavigate } from "@/providers/NavigationProvider";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "20%" : "-20%",
  }),
  center: {
    x: 0,
  },
  exit: {
    x: 0,
  },
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
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
