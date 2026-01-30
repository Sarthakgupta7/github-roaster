// import { motion } from "framer-motion";

// function AnimatedBackground({ variant = "default" }) {
//   const variants = {
//     default: {
//       primary: "from-purple-900/20 via-pink-900/20 to-red-900/20",
//       orb1: "bg-purple-500/30",
//       orb2: "bg-pink-500/30",
//       orb3: "bg-red-500/30",
//     },
//     roast: {
//       primary: "from-red-900/20 via-orange-900/20 to-yellow-900/20",
//       orb1: "bg-red-500/30",
//       orb2: "bg-orange-500/30",
//       orb3: "bg-yellow-500/30",
//     },
//     explain: {
//       primary: "from-blue-900/20 via-cyan-900/20 to-teal-900/20",
//       orb1: "bg-blue-500/30",
//       orb2: "bg-cyan-500/30",
//       orb3: "bg-teal-500/30",
//     },
//     profile: {
//       primary: "from-purple-900/20 via-indigo-900/20 to-blue-900/20",
//       orb1: "bg-purple-500/30",
//       orb2: "bg-indigo-500/30",
//       orb3: "bg-blue-500/30",
//     },
//     compare: {
//       primary: "from-green-900/20 via-emerald-900/20 to-teal-900/20",
//       orb1: "bg-green-500/50",
//       orb2: "bg-emerald-500/50",
//       orb3: "bg-teal-500/50",
//     },
//   };

//   const colors = variants[variant] || variants.default;

//   return (
//     <div className="fixed inset-0 -z-10 overflow-hidden">
//       {/* Base Gradient */}
//       <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary}`} />

//       {/* Animated Grid */}
//       <div 
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
//             linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: '50px 50px',
//         }}
//       />

//       {/* Floating Orbs */}
//       <motion.div
//         animate={{
//           x: [0, 100, 0],
//           y: [0, -100, 0],
//           scale: [1, 1.2, 1],
//           rotate: [0, 90, 0],
//         }}
//         transition={{
//           duration: 2000,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className={`absolute top-0 -right-40 w-96 h-96 ${colors.orb1} rounded-full blur-3xl`}
//       />

//       <motion.div
//         animate={{
//           x: [0, -150, 0],
//           y: [0, 100, 0],
//           scale: [1.2, 1, 1.2],
//           rotate: [0, -90, 0],
//         }}
//         transition={{
//           duration: 25,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className={`absolute -bottom-40 -left-40 w-96 h-96 ${colors.orb2} rounded-full blur-3xl`}
//       />

//       <motion.div
//         animate={{
//           x: [0, -100, 100, 0],
//           y: [0, 100, -100, 0],
//           scale: [1, 1.3, 1, 1],
//           rotate: [0, 180, 360, 0],
//         }}
//         transition={{
//           duration: 30,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className={`absolute top-1/2 left-1/2 w-80 h-80 ${colors.orb3} rounded-full blur-3xl opacity-50`}
//       />

//       {/* Particle Effect */}
//       {[...Array(20)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-white/20 rounded-full"
//           initial={{
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//           }}
//           animate={{
//             y: [null, -1000],
//             opacity: [0, 1, 1],
//           }}
//           transition={{
//             duration: Math.random() * 10 + 10,
//             repeat: Infinity,
//             delay: Math.random() * 5,
//           }}
//         />
//       ))}

//       {/* Glassmorphism Overlay */}
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
//     </div>
//   );
// }

// export default AnimatedBackground;
import { motion } from "framer-motion";

function AnimatedBackground({ variant = "default" }) {
  const variants = {
    default: {
      primary: "from-purple-900/20 via-pink-900/20 to-red-900/20",
      orb1: "bg-purple-500/30",
      orb2: "bg-pink-500/30",
      orb3: "bg-red-500/30",
    },
    roast: {
      primary: "from-red-900/20 via-orange-900/20 to-yellow-900/20",
      orb1: "bg-red-500/30",
      orb2: "bg-orange-500/30",
      orb3: "bg-yellow-500/30",
    },
    explain: {
      primary: "from-blue-900/20 via-cyan-900/20 to-teal-900/20",
      orb1: "bg-blue-500/30",
      orb2: "bg-cyan-500/30",
      orb3: "bg-teal-500/30",
    },
    profile: {
      primary: "from-purple-900/20 via-indigo-900/20 to-blue-900/20",
      orb1: "bg-purple-500/30",
      orb2: "bg-indigo-500/30",
      orb3: "bg-blue-500/30",
    },
    compare: {
      primary: "from-green-900/20 via-emerald-900/20 to-teal-900/20",
      orb1: "bg-green-500/40",
      orb2: "bg-emerald-500/40",
      orb3: "bg-teal-500/40",
    },
  };

  const colors = variants[variant] || variants.default;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary}`} />

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ORB 1 */}
      <motion.div
        initial={false}
        animate={{
          x: [0, 120, 0],
          y: [0, -120, 0],
          scale: [1, 1.25, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-0 -right-40 w-96 h-96 ${colors.orb1} rounded-full blur-3xl`}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />

      {/* ORB 2 */}
      <motion.div
        initial={false}
        animate={{
          x: [0, -160, 0],
          y: [0, 120, 0],
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-40 -left-40 w-96 h-96 ${colors.orb2} rounded-full blur-3xl`}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />

      {/* ORB 3 */}
      <motion.div
        initial={false}
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -100, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360, 0],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 w-80 h-80 ${colors.orb3} rounded-full blur-3xl opacity-50`}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />

      {/* PARTICLES */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "-120vh"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* Light Glass Overlay (keeps orbs visible) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
    </div>
  );
}

export default AnimatedBackground;
