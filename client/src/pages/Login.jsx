// function Login() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center text-white">
//       <div className="bg-gray-800/90 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full animate-fade-in">

//         <h1 className="text-4xl font-extrabold mb-2">🔥 RoastMyRepo</h1>
//         <p className="text-gray-400 mb-8 text-sm">
//           AI-powered GitHub roasts & Code IQ analysis
//         </p>

//         <a
//           href="https://github-roaster-mvtz.vercel.app/auth/github"
//           className="flex justify-center items-center gap-3 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
//         >
//           Continue with GitHub
//         </a>

//         <p className="text-xs text-gray-500 mt-6">
//           No repos are modified. Roasts are (mostly) harmless 😅
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { motion } from "framer-motion";
import { Github, Sparkles, Shield, Zap } from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 -right-40 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Main Card */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Logo & Title */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-red-500/30">
                <span className="text-3xl">🔥</span>
              </div>

              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                RoastMyRepo
              </h1>

              <p className="text-gray-400 text-sm">
                AI-powered GitHub analysis & roasting
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <div className="bg-gray-800/50 border border-white/5 rounded-xl p-3 text-center">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <p className="text-xs text-gray-400">Code IQ</p>
              </div>
              <div className="bg-gray-800/50 border border-white/5 rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                <p className="text-xs text-gray-400">Instant</p>
              </div>
              <div className="bg-gray-800/50 border border-white/5 rounded-xl p-3 text-center">
                <Shield className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <p className="text-xs text-gray-400">Safe</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.a
              href="https://github-roaster-mvtz.vercel.app/auth/github"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center gap-3 w-full bg-white text-gray-900 px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-white/20 hover:shadow-white/30 transition-all overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <Github className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Continue with GitHub</span>
            </motion.a>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>No repos are modified or stored</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>Roasts are AI-generated & harmless</span>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-white/5"
            >
              <div className="flex items-center justify-center gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">1000+</p>
                  <p className="text-xs text-gray-500">Repos Roasted</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-white">A+</p>
                  <p className="text-xs text-gray-500">Top Score</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-center text-xs text-gray-600 mt-6"
          >
            By continuing, you agree to our Terms of Service
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;