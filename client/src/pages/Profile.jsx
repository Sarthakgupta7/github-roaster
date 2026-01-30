// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Briefcase, DollarSign, TrendingUp, Award, Target, Zap } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import { analyzeGitHubProfile } from "../utils/profileAnalyzer";

// function Profile({ user }) {
//   const [loading, setLoading] = useState(false);
//   const [profileData, setProfileData] = useState(null);
//   const [error, setError] = useState(null);

//   const analyzeProfile = async () => {
//     if (!user?.login) return;

//     setLoading(true);
//     setError(null);
//     setProfileData(null);

//     try {
//       const data = await analyzeGitHubProfile(user.login);
//       setProfileData(data);
//     } catch (err) {
//       setError("Failed to analyze profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageWrapper>
//       <div className="flex justify-center px-4 py-12">
//         <div className="w-full max-w-4xl space-y-6">

//           {/* HEADER CARD */}
//           <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
//             <div className="flex items-center gap-6 mb-6">
//               {user?.avatar && (
//                 <img
//                   src={user.avatar}
//                   alt={user.login}
//                   className="w-20 h-20 rounded-full border-4 border-white/20"
//                 />
//               )}
//               <div>
//                 <h2 className="text-3xl font-extrabold">Career Analysis</h2>
//                 <p className="text-gray-300 text-sm mt-1">
//                   Get AI-powered role recommendations & salary estimates
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={analyzeProfile}
//               disabled={loading}
//               className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Analyzing your GitHub...
//                 </span>
//               ) : (
//                 "🔍 Analyze My Profile"
//               )}
//             </button>

//             {error && (
//               <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-200">
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* RESULTS */}
//           <AnimatePresence>
//             {profileData && (
//               <>
//                 {/* EXPERIENCE LEVEL */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <Award className="w-6 h-6 text-yellow-400" />
//                       <h3 className="text-xl font-bold">Experience Level</h3>
//                     </div>
//                     <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500">
//                       {profileData.experienceLevel}
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     <div className="bg-black/40 p-3 rounded-xl">
//                       <p className="text-gray-400">Account Age</p>
//                       <p className="text-lg font-semibold">{profileData.analysis.accountAge} years</p>
//                     </div>
//                     <div className="bg-black/40 p-3 rounded-xl">
//                       <p className="text-gray-400">Projects</p>
//                       <p className="text-lg font-semibold">{profileData.analysis.originalProjects}</p>
//                     </div>
//                     <div className="bg-black/40 p-3 rounded-xl">
//                       <p className="text-gray-400">Total Stars</p>
//                       <p className="text-lg font-semibold">⭐ {profileData.analysis.totalStars}</p>
//                     </div>
//                     <div className="bg-black/40 p-3 rounded-xl">
//                       <p className="text-gray-400">Active</p>
//                       <p className="text-lg font-semibold">
//                         {profileData.analysis.recentlyActive ? "✅ Yes" : "❌ No"}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* TOP LANGUAGES */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <Zap className="w-6 h-6 text-blue-400" />
//                     <h3 className="text-xl font-bold">Tech Stack</h3>
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     {profileData.analysis.topLanguages.map((lang, i) => (
//                       <span
//                         key={i}
//                         className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/30 rounded-full text-sm font-semibold"
//                       >
//                         {lang}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
//                     <div className="bg-black/40 p-3 rounded-xl text-center">
//                       <p className="text-gray-400">Full Stack</p>
//                       <p className="text-lg font-bold text-purple-400">
//                         {profileData.analysis.fullstackProjects}
//                       </p>
//                     </div>
//                     <div className="bg-black/40 p-3 rounded-xl text-center">
//                       <p className="text-gray-400">AI/ML</p>
//                       <p className="text-lg font-bold text-green-400">
//                         {profileData.analysis.aiMlProjects}
//                       </p>
//                     </div>
//                     <div className="bg-black/40 p-3 rounded-xl text-center">
//                       <p className="text-gray-400">DevOps</p>
//                       <p className="text-lg font-bold text-orange-400">
//                         {profileData.analysis.devopsProjects}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* RECOMMENDED ROLES */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <Briefcase className="w-6 h-6 text-green-400" />
//                     <h3 className="text-xl font-bold">Recommended Roles</h3>
//                   </div>

//                   <div className="space-y-3">
//                     {profileData.roles.map((role, i) => (
//                       <div
//                         key={i}
//                         className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-green-500/30 transition"
//                       >
//                         <div>
//                           <h4 className="font-semibold text-lg">{role.title}</h4>
//                           <p className="text-sm text-gray-400">{role.reason}</p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-bold text-green-400">
//                             {role.match}%
//                           </div>
//                           <div className="text-xs text-gray-500">Match</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>

//                 {/* SALARY ESTIMATE */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6"
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <DollarSign className="w-6 h-6 text-green-400" />
//                     <h3 className="text-xl font-bold">Estimated Salary Range</h3>
//                   </div>

//                   <div className="text-center py-6">
//                     <div className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
//                       ₹{profileData.salary.min} - {profileData.salary.max} {profileData.salary.currency}
//                     </div>
//                     <p className="text-gray-400 mt-2 text-sm">
//                       Based on {profileData.experienceLevel} level in India
//                     </p>
//                   </div>

//                   <div className="bg-black/40 border border-green-500/20 rounded-xl p-4 mt-4">
//                     <div className="flex items-start gap-3">
//                       <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
//                       <div className="text-sm text-gray-300">
//                         <p className="font-semibold mb-1">💡 How to increase your range:</p>
//                         <ul className="list-disc list-inside space-y-1 text-xs">
//                           <li>Build more complex, production-ready projects</li>
//                           <li>Contribute to popular open-source repositories</li>
//                           <li>Document your work with detailed READMEs</li>
//                           <li>Gain stars on your best projects</li>
//                           <li>Stay active with consistent commits</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* DISCLAIMER */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   className="text-center text-xs text-gray-500"
//                 >
//                   <p>
//                     💼 Estimates based on GitHub activity, Indian tech market (2025), and role complexity.
//                   </p>
//                   <p className="mt-1">
//                     Actual salaries vary by company, location, skills, and interview performance.
//                   </p>
//                 </motion.div>
//               </>
//             )}
//           </AnimatePresence>

//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// export default Profile;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, DollarSign, TrendingUp, Award, Target, Zap, HelpCircle } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";
import { analyzeGitHubProfile } from "../utils/profileAnalyzer";

function Profile({ user }) {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const analyzeProfile = async () => {
    if (!user?.login) return;

    setLoading(true);
    setError(null);
    setProfileData(null);

    try {
      const data = await analyzeGitHubProfile(user.login);
      setProfileData(data);
    } catch (err) {
      setError("Failed to analyze profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="profile" />
      
      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-6">

          {/* HEADER CARD */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-6 mb-6">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.login}
                  className="w-20 h-20 rounded-full border-4 border-white/20"
                />
              )}
              <div>
                <h2 className="text-3xl font-extrabold">Career Analysis</h2>
                <p className="text-gray-300 text-sm mt-1">
                  Get AI-powered role recommendations & salary estimates
                </p>
              </div>
            </div>

            <button
              onClick={analyzeProfile}
              disabled={loading}
              className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing your GitHub...
                </span>
              ) : (
                "🔍 Analyze My Profile"
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* RESULTS */}
          <AnimatePresence>
            {profileData && (
              <>
                {/* EXPERIENCE LEVEL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-bold">Experience Level</h3>
                    </div>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500">
                      {profileData.experienceLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">Account Age</p>
                      <p className="text-lg font-semibold">{profileData.analysis.accountAge} years</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">Projects</p>
                      <p className="text-lg font-semibold">{profileData.analysis.originalProjects}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">Total Stars</p>
                      <p className="text-lg font-semibold">⭐ {profileData.analysis.totalStars}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-gray-400">Active</p>
                      <p className="text-lg font-semibold">
                        {profileData.analysis.recentlyActive ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* TOP LANGUAGES */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold">Tech Stack</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {profileData.analysis.topLanguages.map((lang, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/30 rounded-full text-sm font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                    <div className="bg-black/40 p-3 rounded-xl text-center">
                      <p className="text-gray-400">Full Stack</p>
                      <p className="text-lg font-bold text-purple-400">
                        {profileData.analysis.fullstackProjects}
                      </p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl text-center">
                      <p className="text-gray-400">AI/ML</p>
                      <p className="text-lg font-bold text-green-400">
                        {profileData.analysis.aiMlProjects}
                      </p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl text-center">
                      <p className="text-gray-400">DevOps</p>
                      <p className="text-lg font-bold text-orange-400">
                        {profileData.analysis.devopsProjects}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* RECOMMENDED ROLES */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-900/90 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold">Recommended Roles</h3>
                  </div>

                  <div className="space-y-3">
                    {profileData.roles.map((role, i) => (
                      <div
                        key={i}
                        className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-green-500/30 transition"
                      >
                        <div>
                          <h4 className="font-semibold text-lg">{role.title}</h4>
                          <p className="text-sm text-gray-400">{role.reason}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            {role.match}%
                          </div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* SALARY ESTIMATE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold">Estimated Salary Range</h3>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ₹{profileData.salary.min} - {profileData.salary.max} {profileData.salary.currency}
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      Based on {profileData.experienceLevel} level in India
                    </p>
                  </div>

                  <div className="bg-black/40 border border-green-500/20 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                      <div className="text-sm text-gray-300">
                        <p className="font-semibold mb-1">💡 How to increase your range:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Build more complex, production-ready projects</li>
                          <li>Contribute to popular open-source repositories</li>
                          <li>Document your work with detailed READMEs</li>
                          <li>Gain stars on your best projects</li>
                          <li>Stay active with consistent commits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* DISCLAIMER */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-xs text-gray-500"
                >
                  <p>
                    💼 Estimates based on GitHub activity, Indian tech market (2025), and role complexity.
                  </p>
                  <p className="mt-1">
                    Actual salaries vary by company, location, skills, and interview performance.
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Profile;