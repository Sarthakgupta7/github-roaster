// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { motion, AnimatePresence } from "framer-motion";
// import PageWrapper from "../components/PageWrapper";
// import { generatePremiumExplainCard } from "../utils/premiumCardGenerator";

// /* ================= PERSONAS ================= */

// const PERSONAS = [
//   { key: "junior", label: "👶 Junior Dev" },
//   { key: "pm", label: "📊 Product Manager" },
//   { key: "hr", label: "🧑‍💼 HR" },
// ];

// /* ================= PAGE ================= */

// function Explain() {
//   const [repoUrl, setRepoUrl] = useState("");
//   const [persona, setPersona] = useState("junior");
//   const [explanation, setExplanation] = useState("");
//   const [takeaways, setTakeaways] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [shareUrl, setShareUrl] = useState(null);

//   /* ================= EXPLAIN ================= */
//   const explainRepo = async () => {
//     if (!repoUrl) return;

//     setLoading(true);
//     setExplanation("");
//     setTakeaways([]);
//     setShareUrl(null);

//     try {
//       const res = await fetch("https://github-roaster-mvtz.vercel.app/explain", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ repoUrl, role: persona }),
//       });

//       const data = await res.json();
//       setExplanation(data.explanation);

//       /* Extract key takeaways safely */
//       const bullets = data.explanation
//         .split("\n")
//         .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("•"))
//         .slice(0, 3)
//         .map((l) => l.replace(/^[-•]\s*/, ""));

//       setTakeaways(bullets);
//     } catch {
//       alert("Explain failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= PREMIUM SHARE IMAGE ================= */
//   const generateShareImage = () => {
//     const imageUrl = generatePremiumExplainCard({
//       explanation,
//       persona,
//       repoUrl
//     });
//     setShareUrl(imageUrl);
//   };

//   return (
//     <PageWrapper>
//       <div className="flex justify-center px-4 py-12">
//         <div className="w-full max-w-2xl space-y-6">

//           {/* MAIN CARD */}
//           <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">

//             <h2 className="text-3xl font-extrabold text-center">
//               📘 Explain This Repo
//             </h2>

//             {/* INPUT */}
//             <input
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               placeholder="https://github.com/user/repo"
//               value={repoUrl}
//               onChange={(e) => setRepoUrl(e.target.value)}
//             />

//             {/* PERSONA TOGGLE */}
//             <div className="flex justify-center gap-3">
//               {PERSONAS.map((p) => (
//                 <button
//                   key={p.key}
//                   onClick={() => setPersona(p.key)}
//                   className={`px-4 py-2 rounded-full text-sm transition-all ${
//                     persona === p.key
//                       ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                 >
//                   {p.label}
//                 </button>
//               ))}
//             </div>

//             {/* BUTTON */}
//             <button
//               onClick={explainRepo}
//               disabled={loading}
//               className={`w-full p-3 rounded-xl font-semibold transition-all ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
//               }`}
//             >
//               {loading ? "Explaining..." : "Explain Repo 🧠"}
//             </button>

//             {/* EXPLANATION */}
//             <AnimatePresence>
//               {explanation && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="bg-gray-900 p-5 rounded-xl prose prose-invert max-w-none text-sm"
//                 >
//                   <ReactMarkdown>{explanation}</ReactMarkdown>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* KEY TAKEAWAYS */}
//             {takeaways.length > 0 && (
//               <div className="bg-black/40 border border-white/10 rounded-xl p-4">
//                 <h3 className="font-semibold mb-2">🧠 Key Takeaways</h3>
//                 <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
//                   {takeaways.map((t, i) => (
//                     <li key={i}>{t}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* SHARE - PREMIUM */}
//           {explanation && (
//             <button
//               onClick={generateShareImage}
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
//                 download="explainmyrepo-card.png"
//                 className="block text-center bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold transition"
//               >
//                 💾 Download Image
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

// export default Explain;

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, FileCode, Lightbulb, BookOpen } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";
import { generatePremiumExplainCard } from "../utils/premiumCardGenerator";

/* ================= PERSONAS ================= */

const PERSONAS = [
  { 
    key: "junior", 
    label: "👶 Junior Dev",
    description: "Explain with code examples and what it does"
  },
  { 
    key: "pm", 
    label: "📊 Product Manager",
    description: "Focus on business value and features"
  },
  { 
    key: "hr", 
    label: "🧑‍💼 HR",
    description: "Non-technical overview for recruiting"
  },
];

/* ================= PAGE ================= */

function Explain() {
  const [repoUrl, setRepoUrl] = useState("");
  const [persona, setPersona] = useState("junior");
  const [explanation, setExplanation] = useState("");
  const [codeAnalysis, setCodeAnalysis] = useState(null);
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [takeaways, setTakeaways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  /* ================= EXPLAIN ================= */
  const explainRepo = async () => {
    if (!repoUrl) return;

    setLoading(true);
    setExplanation("");
    setCodeAnalysis(null);
    setKeyFeatures([]);
    setTakeaways([]);
    setShareUrl(null);

    try {
      const res = await fetch(
        "https://github-roaster-mvtz.vercel.app/explain",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl, role: persona }),
        },
      );

      const data = await res.json();
      setExplanation(data.explanation);
      setCodeAnalysis(data.codeAnalysis);
      setKeyFeatures(data.keyFeatures || []);

      /* Extract key takeaways */
      const bullets = data.explanation
        .split("\n")
        .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("•"))
        .slice(0, 3)
        .map((l) => l.replace(/^[-•]\s*/, ""));

      setTakeaways(bullets);
    } catch {
      alert("Explain failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PREMIUM SHARE IMAGE ================= */
  const generateShareImage = () => {
    const imageUrl = generatePremiumExplainCard({
      explanation,
      persona,
      repoUrl,
    });
    setShareUrl(imageUrl);
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="explain" />
      
      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-6">

          {/* MAIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Explain This Repo
              </h2>
              <p className="text-gray-400">
                AI-powered repository explanation for any audience
              </p>
            </div>

            {/* INPUT */}
            <input
              className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-500"
              placeholder="https://github.com/user/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />

            {/* PERSONA SELECTOR */}
            <div className="mt-6 space-y-3">
              {PERSONAS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPersona(p.key)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    persona === p.key
                      ? "bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-gray-800/50 border border-white/5 hover:bg-gray-800/80 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{p.label}</p>
                      <p className="text-sm text-gray-400 mt-1">{p.description}</p>
                    </div>
                    {persona === p.key && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={explainRepo}
              disabled={loading}
              className={`w-full mt-6 p-4 rounded-xl font-semibold text-lg transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Repository...
                </span>
              ) : (
                "🧠 Explain Repo"
              )}
            </button>
          </motion.div>

          {/* CODE ANALYSIS (JUNIOR DEV MODE) */}
          <AnimatePresence>
            {codeAnalysis && persona === "junior" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">Code Analysis</h3>
                </div>

                {/* Main Language */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Primary Language</p>
                  <p className="text-lg font-semibold text-blue-400">{codeAnalysis.language}</p>
                </div>

                {/* File Structure */}
                {codeAnalysis.fileStructure && (
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">📁 Project Structure</p>
                    <div className="font-mono text-sm text-gray-300 space-y-1">
                      {codeAnalysis.fileStructure.map((file, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-blue-400" />
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Purpose */}
                {codeAnalysis.purpose && (
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">🎯 What This Code Does</p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {codeAnalysis.purpose}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* KEY FEATURES */}
          <AnimatePresence>
            {keyFeatures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold">Key Features</h3>
                </div>

                <div className="grid gap-3">
                  {keyFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-yellow-500/30 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-yellow-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EXPLANATION */}
          <AnimatePresence>
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Detailed Explanation</h3>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mb-3 mt-6" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mb-2 mt-4" {...props} />,
                      p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm" {...props} />
                        ) : (
                          <code className="block bg-black/60 border border-white/10 p-4 rounded-xl text-sm overflow-x-auto" {...props} />
                        ),
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* KEY TAKEAWAYS */}
          {takeaways.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 border border-white/10 rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* SHARE */}
          {explanation && (
            <button
              onClick={generateShareImage}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg shadow-purple-500/30"
            >
              🎨 Generate Share Card
            </button>
          )}

          {shareUrl && (
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-3">
              <img src={shareUrl} alt="Share Card" className="w-full rounded-lg" />
              <a
                href={shareUrl}
                download="explainmyrepo-card.png"
                className="block text-center bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold transition"
              >
                💾 Download Image
              </a>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}

export default Explain;