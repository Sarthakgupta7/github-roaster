// import { motion } from "framer-motion";

// export default function PageWrapper({ children }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       className="min-h-screen bg-gray-900 text-white"
//     >
//       {children}
//     </motion.div>
//   );
// }
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative z-10 min-h-screen text-white"
    >
      {children}
    </motion.div>
  );
}
