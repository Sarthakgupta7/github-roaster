// import { useState } from "react";
// import { Link } from "react-router-dom";
// import PageWrapper from "../components/PageWrapper";

// /* ==================== HELPERS ==================== */

// const getGrade = (score) => {
//   if (score >= 80) return "A";
//   if (score >= 65) return "B";
//   if (score >= 50) return "C";
//   if (score >= 35) return "D";
//   return "F";
// };

// const Bar = ({ label, value }) => (
//   <div className="space-y-1">
//     <div className="flex justify-between text-sm">
//       <span>{label}</span>
//       <span className="font-semibold">{value}/100</span>
//     </div>
//     <div className="h-2 bg-gray-700 rounded overflow-hidden">
//       <div
//         className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   </div>
// );

// /* ==================== HISTORY ==================== */

// const saveHistory = (user, repoUrl, finalScore) => {
//   if (!user) return;
//   const key = `history_${user.login}`;
//   const history = JSON.parse(localStorage.getItem(key) || "[]");

//   history.unshift({
//     repoUrl,
//     score: finalScore,
//     date: new Date().toLocaleDateString(),
//   });

//   localStorage.setItem(key, JSON.stringify(history.slice(0, 10)));
// };

// const getHistory = (user) =>
//   JSON.parse(localStorage.getItem(`history_${user.login}`) || "[]");

// /* ==================== PAGE ==================== */

// function Roast({ user }) {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [mode, setMode] = useState("light");
//   const [roast, setRoast] = useState("");
//   const [stats, setStats] = useState(null);
//   const [codeIQ, setCodeIQ] = useState(null);
//   const [commitCrimes, setCommitCrimes] = useState(null);
//   const [personality, setPersonality] = useState(null);
//   const [improvements, setImprovements] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [shareUrl, setShareUrl] = useState(null);

//   const roastRepo = async () => {
//     if (!repoUrl) return;

//     setLoading(true);
//     setRoast("");
//     setStats(null);
//     setCodeIQ(null);
//     setCommitCrimes(null);
//     setPersonality(null);
//     setImprovements(null);
//     setShareUrl(null);

//     try {
//       const res = await fetch("http://localhost:5002/roast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ repoUrl, mode }),
//       });

//       const data = await res.json();

//       setRoast(data.roast);
//       setStats(data.stats);
//       setCodeIQ(data.codeIQ);
//       setCommitCrimes(data.commitCrimes);
//       setPersonality(data.personality);
//       setImprovements(data.improvements);

//       saveHistory(user, repoUrl, data.codeIQ.final);
//     } catch {
//       alert("Roast failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ==================== SHARE IMAGE ==================== */
//   const generateImage = () => {
//     const c = document.createElement("canvas");
//     c.width = 800;
//     c.height = 450;
//     const ctx = c.getContext("2d");

//     ctx.fillStyle = "#111827";
//     ctx.fillRect(0, 0, 800, 450);

//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 30px sans-serif";
//     ctx.fillText("🔥 RoastMyRepo", 30, 50);

//     ctx.font = "18px sans-serif";
//     roast
//       .split("\n")
//       .slice(0, 6)
//       .forEach((line, i) =>
//         ctx.fillText(line, 30, 120 + i * 28)
//       );

//     ctx.fillStyle = "#9ca3af";
//     ctx.font = "14px sans-serif";
//     ctx.fillText("roastmyrepo.dev", 30, 420);

//     setShareUrl(c.toDataURL("image/png"));
//   };

//   const history = getHistory(user);

//   return (
//     <PageWrapper>
//       <div className="flex justify-center px-4 py-12">
//         <div className="w-full max-w-xl space-y-6">

//           {/* MAIN CARD */}
//           <div className="bg-gray-800/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
//             <h2 className="text-3xl font-extrabold text-center">
//               🔥 Roast a GitHub Repo
//             </h2>

//             <input
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl"
//               placeholder="https://github.com/user/repo"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//             />

//             <select
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl"
//             >
//               <option value="light">😅 Light Roast</option>
//               <option value="brutal">🔥 Brutal Roast</option>
//               <option value="hr">🧑‍💼 HR-Friendly</option>
//               <option value="faang">🧠 FAANG Interviewer</option>
//             </select>

//             <button
//               onClick={roastRepo}
//               disabled={loading}
//               className={`w-full p-3 rounded-xl font-semibold ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-red-500 hover:bg-red-600"
//               }`}
//             >
//               {loading ? "Roasting..." : "Roast 🔥"}
//             </button>

//             {stats && (
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="bg-gray-900 p-3 rounded-xl">⭐ {stats.stars}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">🍴 {stats.forks}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">🐞 {stats.issues}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">💻 {stats.language}</div>
//               </div>
//             )}
//           </div>

//           {/* PERSONALITY */}
//           {personality && (
//             <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center font-semibold">
//               🧬 Repo Personality: <span className="text-orange-400">{personality}</span>
//             </div>
//           )}

//           {/* CODE IQ */}
//           {codeIQ && (
//             <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-lg">🧠 Code IQ Breakdown</h3>
//                 <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600">
//                   Grade {getGrade(codeIQ.final)}
//                 </span>
//               </div>

//               <Bar label="Readability" value={codeIQ.readability} />
//               <Bar label="Structure" value={codeIQ.structure} />
//               <Bar label="Commits" value={codeIQ.commits} />
//               <Bar label="Documentation" value={codeIQ.documentation} />
//               <Bar label="Test Readiness" value={codeIQ.testReadiness} />

//               <div className="pt-3 text-right text-xl font-extrabold">
//                 Final Code IQ: {codeIQ.final}/100
//               </div>
//             </div>
//           )}

//           {/* COMMIT CRIMES */}
//           {commitCrimes && (
//             <div className="bg-gray-900 border border-white/10 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">🚓 Commit Crime Detector</h3>
//               <p className="text-sm text-gray-300">
//                 Crimes: <b>{commitCrimes.count}</b> | Grade: <b>{commitCrimes.grade}</b>
//               </p>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {commitCrimes.crimes.map((c, i) => (
//                   <span
//                     key={i}
//                     className="px-2 py-1 text-xs rounded bg-red-600/20 border border-red-500/30"
//                   >
//                     {c}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* IMPROVEMENTS */}
//           {improvements && (
//             <div className="bg-black/40 border border-white/10 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">🛠 How to Improve</h3>
//               <p className="text-sm whitespace-pre-line text-gray-300">
//                 {improvements}
//               </p>
//             </div>
//           )}

//           {/* ROAST */}
//           {roast && (
//             <div className="bg-gray-900/90 border border-red-500/30 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">
//                 🔥 Roast ({mode.toUpperCase()})
//               </h3>
//               <p className="whitespace-pre-line text-sm leading-relaxed">
//                 {roast}
//               </p>
//             </div>
//           )}

//           {/* SHARE */}
//           {roast && (
//             <button
//               onClick={generateImage}
//               className="w-full bg-gray-700 p-3 rounded-xl hover:bg-gray-600"
//             >
//               📸 Generate Share Image
//             </button>
//           )}

//           {shareUrl && (
//             <a
//               href={shareUrl}
//               download="roastmyrepo.png"
//               className="block text-center text-blue-400 underline"
//             >
//               Download Image
//             </a>
//           )}

//           {/* HISTORY */}
//           {history.length > 0 && (
//             <div className="bg-gray-800 p-4 rounded-xl text-sm">
//               <h4 className="font-semibold mb-2">📜 Your Roast History</h4>
//               {history.map((h, i) => (
//                 <div key={i} className="flex justify-between text-gray-300">
//                   <span className="truncate">{h.repoUrl}</span>
//                   <span>{h.score}/100</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="text-center text-sm text-gray-400">
//             Want a serious breakdown?{" "}
//             <Link to="/explain" className="text-blue-400 hover:underline">
//               Explain this repo →
//             </Link>
//           </div>

//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// export default Roast;
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { AlertTriangle } from "lucide-react";
// import PageWrapper from "../components/PageWrapper";
// import { generatePremiumRoastCard } from "../utils/premiumCardGenerator";
// import { analyzeTechDebt } from "../utils/techDebtAnalyzer";

// /* ==================== HELPERS ==================== */

// const getGrade = (score) => {
//   if (score >= 80) return "A";
//   if (score >= 65) return "B";
//   if (score >= 50) return "C";
//   if (score >= 35) return "D";
//   return "F";
// };

// const Bar = ({ label, value }) => (
//   <div className="space-y-1">
//     <div className="flex justify-between text-sm">
//       <span>{label}</span>
//       <span className="font-semibold">{value}/100</span>
//     </div>
//     <div className="h-2 bg-gray-700 rounded overflow-hidden">
//       <div
//         className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   </div>
// );

// /* ==================== HISTORY ==================== */

// const saveHistory = (user, repoUrl, finalScore) => {
//   if (!user) return;
//   const key = `history_${user.login}`;
//   const history = JSON.parse(localStorage.getItem(key) || "[]");

//   history.unshift({
//     repoUrl,
//     score: finalScore,
//     date: new Date().toLocaleDateString(),
//   });

//   localStorage.setItem(key, JSON.stringify(history.slice(0, 10)));
// };

// const getHistory = (user) =>
//   JSON.parse(localStorage.getItem(`history_${user.login}`) || "[]");

// /* ==================== PAGE ==================== */

// function Roast({ user }) {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [mode, setMode] = useState("light");
//   const [roast, setRoast] = useState("");
//   const [stats, setStats] = useState(null);
//   const [codeIQ, setCodeIQ] = useState(null);
//   const [commitCrimes, setCommitCrimes] = useState(null);
//   const [personality, setPersonality] = useState(null);
//   const [improvements, setImprovements] = useState(null);
//   const [techDebt, setTechDebt] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [shareUrl, setShareUrl] = useState(null);

//   const roastRepo = async () => {
//     if (!repoUrl) return;

//     setLoading(true);
//     setRoast("");
//     setStats(null);
//     setCodeIQ(null);
//     setCommitCrimes(null);
//     setPersonality(null);
//     setImprovements(null);
//     setTechDebt(null);
//     setShareUrl(null);

//     try {
//       const res = await fetch("http://localhost:5002/roast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ repoUrl, mode }),
//       });

//       const data = await res.json();

//       setRoast(data.roast);
//       setStats(data.stats);
//       setCodeIQ(data.codeIQ);
//       setCommitCrimes(data.commitCrimes);
//       setPersonality(data.personality);
//       setImprovements(data.improvements);
//       setTechDebt(data.techDebt);

//       saveHistory(user, repoUrl, data.codeIQ.final);
//     } catch {
//       alert("Roast failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ==================== PREMIUM SHARE IMAGE ==================== */
//   const generateImage = () => {
//     const imageUrl = generatePremiumRoastCard({
//       roast,
//       stats,
//       codeIQ,
//       commitCrimes,
//       personality,
//       techDebt,
//     });
//     setShareUrl(imageUrl);
//   };

//   const history = getHistory(user);

//   return (
//     <PageWrapper>
//       <div className="flex justify-center px-4 py-12">
//         <div className="w-full max-w-xl space-y-6">

//           {/* MAIN CARD */}
//           <div className="bg-gray-800/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
//             <h2 className="text-3xl font-extrabold text-center">
//               🔥 Roast a GitHub Repo
//             </h2>

//             <input
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
//               placeholder="https://github.com/user/repo"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//             />

//             <select
//               value={mode}
//               onChange={(e) => setMode(e.target.value)}
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
//             >
//               <option value="light">😅 Light Roast</option>
//               <option value="brutal">🔥 Brutal Roast</option>
//               <option value="hr">🧑‍💼 HR-Friendly</option>
//               <option value="faang">🧠 FAANG Interviewer</option>
//             </select>

//             <button
//               onClick={roastRepo}
//               disabled={loading}
//               className={`w-full p-3 rounded-xl font-semibold transition-all ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg shadow-red-500/30"
//               }`}
//             >
//               {loading ? "Roasting..." : "Roast 🔥"}
//             </button>

//             {stats && (
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="bg-gray-900 p-3 rounded-xl">⭐ {stats.stars}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">🍴 {stats.forks}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">🐞 {stats.issues}</div>
//                 <div className="bg-gray-900 p-3 rounded-xl">💻 {stats.language}</div>
//               </div>
//             )}
//           </div>

//           {/* PERSONALITY */}
//           {personality && (
//             <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center font-semibold">
//               🧬 Repo Personality: <span className="text-orange-400">{personality}</span>
//             </div>
//           )}

//           {/* CODE IQ */}
//           {codeIQ && (
//             <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-lg">🧠 Code IQ Breakdown</h3>
//                 <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-orange-600">
//                   Grade {getGrade(codeIQ.final)}
//                 </span>
//               </div>

//               <Bar label="Readability" value={codeIQ.readability} />
//               <Bar label="Structure" value={codeIQ.structure} />
//               <Bar label="Commits" value={codeIQ.commits} />
//               <Bar label="Documentation" value={codeIQ.documentation} />
//               <Bar label="Test Readiness" value={codeIQ.testReadiness} />

//               <div className="pt-3 text-right text-xl font-extrabold">
//                 Final Code IQ: {codeIQ.final}/100
//               </div>
//             </div>
//           )}

//           {/* TECH DEBT METER */}
//           {techDebt && (
//             <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-5 space-y-4">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <AlertTriangle className="w-5 h-5 text-yellow-400" />
//                   <h3 className="font-semibold text-lg">⚠️ Tech Debt Meter</h3>
//                 </div>
//                 <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-600">
//                   Grade {techDebt.grade}
//                 </span>
//               </div>

//               {/* Progress Bar */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Tech Debt Score</span>
//                   <span className="font-semibold">{techDebt.score}/100</span>
//                 </div>
//                 <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700"
//                     style={{ width: `${techDebt.score}%` }}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-400 text-center">
//                   {techDebt.score <= 20 && "🟢 Excellent - Minimal tech debt"}
//                   {techDebt.score > 20 && techDebt.score <= 40 && "🟡 Good - Some refactoring needed"}
//                   {techDebt.score > 40 && techDebt.score <= 60 && "🟠 Moderate - Consider cleanup"}
//                   {techDebt.score > 60 && techDebt.score <= 80 && "🔴 High - Needs attention"}
//                   {techDebt.score > 80 && "🔥 Critical - Immediate refactoring required"}
//                 </p>
//               </div>

//               {/* Metrics Grid */}
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="bg-black/40 p-3 rounded-xl">
//                   <p className="text-gray-400">TODOs</p>
//                   <p className="text-lg font-bold text-yellow-400">{techDebt.metrics.todoCount}</p>
//                 </div>
//                 <div className="bg-black/40 p-3 rounded-xl">
//                   <p className="text-gray-400">Long Files</p>
//                   <p className="text-lg font-bold text-orange-400">{techDebt.metrics.longFiles}</p>
//                 </div>
//                 <div className="bg-black/40 p-3 rounded-xl">
//                   <p className="text-gray-400">Avg File Length</p>
//                   <p className="text-lg font-bold text-blue-400">{techDebt.metrics.avgFileLength} lines</p>
//                 </div>
//                 <div className="bg-black/40 p-3 rounded-xl">
//                   <p className="text-gray-400">Comment Ratio</p>
//                   <p className="text-lg font-bold text-green-400">
//                     {((techDebt.metrics.commentLines / (techDebt.metrics.codeLines || 1)) * 100).toFixed(1)}%
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* COMMIT CRIMES */}
//           {commitCrimes && (
//             <div className="bg-gray-900 border border-white/10 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">🚓 Commit Crime Detector</h3>
//               <p className="text-sm text-gray-300">
//                 Crimes: <b>{commitCrimes.count}</b> | Grade: <b>{commitCrimes.grade}</b>
//               </p>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {commitCrimes.crimes.map((c, i) => (
//                   <span
//                     key={i}
//                     className="px-2 py-1 text-xs rounded bg-red-600/20 border border-red-500/30"
//                   >
//                     {c}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* IMPROVEMENTS */}
//           {improvements && (
//             <div className="bg-black/40 border border-white/10 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">🛠 How to Improve</h3>
//               <p className="text-sm whitespace-pre-line text-gray-300">
//                 {improvements}
//               </p>
//             </div>
//           )}

//           {/* ROAST */}
//           {roast && (
//             <div className="bg-gray-900/90 border border-red-500/30 rounded-xl p-4">
//               <h3 className="font-semibold mb-2">
//                 🔥 Roast ({mode.toUpperCase()})
//               </h3>
//               <p className="whitespace-pre-line text-sm leading-relaxed">
//                 {roast}
//               </p>
//             </div>
//           )}

//           {/* SHARE - PREMIUM */}
//           {roast && (
//             <button
//               onClick={generateImage}
//               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg shadow-purple-500/30"
//             >
//               🎨 Generate Premium Share Card
//             </button>
//           )}

//           {shareUrl && (
//             <div className="bg-gray-900 border border-white/10 rounded-xl p-4 space-y-3">
//               <img src={shareUrl} alt="Share Card" className="w-full rounded-lg" />
//               <a
//                 href={shareUrl}
//                 download="roastmyrepo-card.png"
//                 className="block text-center bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold transition"
//               >
//                 💾 Download Image
//               </a>
//             </div>
//           )}

//           {/* HISTORY */}
//           {history.length > 0 && (
//             <div className="bg-gray-800 p-4 rounded-xl text-sm">
//               <h4 className="font-semibold mb-2">📜 Your Roast History</h4>
//               {history.map((h, i) => (
//                 <div key={i} className="flex justify-between text-gray-300 py-1">
//                   <span className="truncate">{h.repoUrl}</span>
//                   <span className="font-semibold">{h.score}/100</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="text-center text-sm text-gray-400">
//             Want a serious breakdown?{" "}
//             <Link to="/explain" className="text-blue-400 hover:underline">
//               Explain this repo →
//             </Link>
//           </div>

//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// export default Roast;

import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";
import { generatePremiumRoastCard } from "../utils/premiumCardGenerator";
import { analyzeTechDebt } from "../utils/techDebtAnalyzer";

/* ==================== HELPERS ==================== */

const getGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
};

const Bar = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-semibold">{value}/100</span>
    </div>
    <div className="h-2 bg-gray-700 rounded overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

/* ==================== HISTORY ==================== */

const saveHistory = (user, repoUrl, finalScore) => {
  if (!user) return;
  const key = `history_${user.login}`;
  const history = JSON.parse(localStorage.getItem(key) || "[]");

  history.unshift({
    repoUrl,
    score: finalScore,
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem(key, JSON.stringify(history.slice(0, 10)));
};

const getHistory = (user) =>
  JSON.parse(localStorage.getItem(`history_${user.login}`) || "[]");

/* ==================== PAGE ==================== */

function Roast({ user }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [mode, setMode] = useState("light");
  const [roast, setRoast] = useState("");
  const [stats, setStats] = useState(null);
  const [codeIQ, setCodeIQ] = useState(null);
  const [commitCrimes, setCommitCrimes] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [improvements, setImprovements] = useState(null);
  const [techDebt, setTechDebt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  const roastRepo = async () => {
    if (!repoUrl) return;

    setLoading(true);
    setRoast("");
    setStats(null);
    setCodeIQ(null);
    setCommitCrimes(null);
    setPersonality(null);
    setImprovements(null);
    setTechDebt(null);
    setShareUrl(null);

    try {
      const res = await fetch("http://localhost:5002/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, mode }),
      });

      const data = await res.json();

      setRoast(data.roast);
      setStats(data.stats);
      setCodeIQ(data.codeIQ);
      setCommitCrimes(data.commitCrimes);
      setPersonality(data.personality);
      setImprovements(data.improvements);
      setTechDebt(data.techDebt);

      saveHistory(user, repoUrl, data.codeIQ.final);
    } catch {
      alert("Roast failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==================== PREMIUM SHARE IMAGE ==================== */
  const generateImage = () => {
    const imageUrl = generatePremiumRoastCard({
      roast,
      stats,
      codeIQ,
      commitCrimes,
      personality,
      techDebt,
    });
    setShareUrl(imageUrl);
  };

  const history = getHistory(user);

  return (
    <PageWrapper>
      <AnimatedBackground variant="roast" />
      
      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">

          {/* MAIN CARD */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <h2 className="text-3xl font-extrabold text-center">
              🔥 Roast a GitHub Repo
            </h2>

            <input
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="light">😅 Light Roast</option>
              <option value="brutal">🔥 Brutal Roast</option>
              <option value="hr">🧑‍💼 HR-Friendly</option>
              <option value="faang">🧠 FAANG Interviewer</option>
            </select>

            <button
              onClick={roastRepo}
              disabled={loading}
              className={`w-full p-3 rounded-xl font-semibold transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg shadow-red-500/30"
              }`}
            >
              {loading ? "Roasting..." : "Roast 🔥"}
            </button>

            {stats && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-900 p-3 rounded-xl">⭐ {stats.stars}</div>
                <div className="bg-gray-900 p-3 rounded-xl">🍴 {stats.forks}</div>
                <div className="bg-gray-900 p-3 rounded-xl">🐞 {stats.issues}</div>
                <div className="bg-gray-900 p-3 rounded-xl">💻 {stats.language}</div>
              </div>
            )}
          </div>

          {/* PERSONALITY */}
          {personality && (
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center font-semibold">
              🧬 Repo Personality: <span className="text-orange-400">{personality}</span>
            </div>
          )}

          {/* CODE IQ */}
          {codeIQ && (
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">🧠 Code IQ Breakdown</h3>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-orange-600">
                  Grade {getGrade(codeIQ.final)}
                </span>
              </div>

              <Bar label="Readability" value={codeIQ.readability} />
              <Bar label="Structure" value={codeIQ.structure} />
              <Bar label="Commits" value={codeIQ.commits} />
              <Bar label="Documentation" value={codeIQ.documentation} />
              <Bar label="Test Readiness" value={codeIQ.testReadiness} />

              <div className="pt-3 text-right text-xl font-extrabold">
                Final Code IQ: {codeIQ.final}/100
              </div>
            </div>
          )}

          {/* TECH DEBT METER */}
          {techDebt && (
            <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-lg">⚠️ Tech Debt Meter</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-600">
                  Grade {techDebt.grade}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tech Debt Score</span>
                  <span className="font-semibold">{techDebt.score}/100</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700"
                    style={{ width: `${techDebt.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  {techDebt.score <= 20 && "🟢 Excellent - Minimal tech debt"}
                  {techDebt.score > 20 && techDebt.score <= 40 && "🟡 Good - Some refactoring needed"}
                  {techDebt.score > 40 && techDebt.score <= 60 && "🟠 Moderate - Consider cleanup"}
                  {techDebt.score > 60 && techDebt.score <= 80 && "🔴 High - Needs attention"}
                  {techDebt.score > 80 && "🔥 Critical - Immediate refactoring required"}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-black/40 p-3 rounded-xl">
                  <p className="text-gray-400">TODOs</p>
                  <p className="text-lg font-bold text-yellow-400">{techDebt.metrics.todoCount}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl">
                  <p className="text-gray-400">Long Files</p>
                  <p className="text-lg font-bold text-orange-400">{techDebt.metrics.longFiles}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl">
                  <p className="text-gray-400">Avg File Length</p>
                  <p className="text-lg font-bold text-blue-400">{techDebt.metrics.avgFileLength} lines</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl">
                  <p className="text-gray-400">Comment Ratio</p>
                  <p className="text-lg font-bold text-green-400">
                    {((techDebt.metrics.commentLines / (techDebt.metrics.codeLines || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COMMIT CRIMES */}
          {commitCrimes && (
            <div className="bg-gray-900 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">🚓 Commit Crime Detector</h3>
              <p className="text-sm text-gray-300">
                Crimes: <b>{commitCrimes.count}</b> | Grade: <b>{commitCrimes.grade}</b>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {commitCrimes.crimes.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-red-600/20 border border-red-500/30"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* IMPROVEMENTS */}
          {improvements && (
            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">🛠 How to Improve</h3>
              <p className="text-sm whitespace-pre-line text-gray-300">
                {improvements}
              </p>
            </div>
          )}

          {/* ROAST */}
          {roast && (
            <div className="bg-gray-900/90 border border-red-500/30 rounded-xl p-4">
              <h3 className="font-semibold mb-2">
                🔥 Roast ({mode.toUpperCase()})
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {roast}
              </p>
            </div>
          )}

          {/* SHARE - PREMIUM */}
          {roast && (
            <button
              onClick={generateImage}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg shadow-purple-500/30"
            >
              🎨 Generate Premium Share Card
            </button>
          )}

          {shareUrl && (
            <div className="bg-gray-900 border border-white/10 rounded-xl p-4 space-y-3">
              <img src={shareUrl} alt="Share Card" className="w-full rounded-lg" />
              <a
                href={shareUrl}
                download="roastmyrepo-card.png"
                className="block text-center bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold transition"
              >
                💾 Download Image
              </a>
            </div>
          )}

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-xl text-sm">
              <h4 className="font-semibold mb-2">📜 Your Roast History</h4>
              {history.map((h, i) => (
                <div key={i} className="flex justify-between text-gray-300 py-1">
                  <span className="truncate">{h.repoUrl}</span>
                  <span className="font-semibold">{h.score}/100</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-center text-sm text-gray-400">
            Want a serious breakdown?{" "}
            <Link to="/explain" className="text-blue-400 hover:underline">
              Explain this repo →
            </Link>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Roast;