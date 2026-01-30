// import { Link } from "react-router-dom";
// import { LogOut, User } from "lucide-react";

// function Navbar({ user, onLogout }) {
//   return (
//     <nav className="bg-gray-900/80 text-gray-200 backdrop-blur border-b border-white/10 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3">
//         <div className="flex items-center justify-between">
          
//           {/* Logo */}
//           <Link to="/roast" className="flex items-center gap-2 hover:opacity-80 transition">
//             <span className="text-2xl">🔥</span>
//             <span className="font-bold text-lg">RoastMyRepo</span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="flex items-center gap-4">
//             <Link
//               to="/roast"
//               className="px-4 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium"
//             >
//               Roast
//             </Link>
//             <Link
//               to="/explain"
//               className="px-4 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium"
//             >
//               Explain
//             </Link>
//             <Link
//               to="/profile"
//               className="px-4 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium flex items-center gap-2"
//             >
//               <User className="w-4 h-4" />
//               Profile
//             </Link>
//           </div>

//           {/* User Section */}
//           <div className="flex items-center gap-3">
//             {user && (
//               <>
//                 <img
//                   src={user.avatar}
//                   alt={user.login}
//                   className="w-8 h-8 rounded-full border-2 border-white/20"
//                 />
//                 <span className="text-sm font-medium">{user.login}</span>
//               </>
//             )}
//             <button
//               onClick={onLogout}
//               className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"
//               title="Logout"
//             >
//               <LogOut className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link, useLocation } from "react-router-dom";
import { LogOut, Flame, BookOpen, User, GitCompare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: "/roast", label: "Roast", icon: Flame },
    { path: "/explain", label: "Explain", icon: BookOpen },
    { path: "/compare", label: "Compare", icon: GitCompare },
    { path: "/profile", label: "Career", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-white/10"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xl" />
      
      {/* Gradient Border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link 
            to="/roast" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition" />
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                RoastMyRepo
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1 flex items-center gap-1">
                <Sparkles className="w-2 h-2" />
                Powered by AI
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                      active
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <img
                  src={user.avatar}
                  alt={user.login}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500/50"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user.login}</p>
                  <p className="text-xs text-gray-500">Developer</p>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              className="group relative p-2 rounded-xl hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-xl blur transition" />
              <LogOut className="relative w-5 h-5 text-gray-400 group-hover:text-red-400 transition" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/5">
        <div className="relative flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -inset-2 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={`relative w-5 h-5 transition ${
                    active ? "text-white" : "text-gray-500"
                  }`}
                />
                <span
                  className={`relative text-xs transition ${
                    active ? "text-white font-semibold" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;