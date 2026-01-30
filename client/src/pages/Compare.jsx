import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";

/* ================= COMPARISON CARD ================= */

const ComparisonMetric = ({ label, repos, getBetter }) => {
  const values = repos.map(r => r[label.key]);
  const bestIndex = getBetter === 'higher' 
    ? values.indexOf(Math.max(...values))
    : values.indexOf(Math.min(...values));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        {label.name}
      </h4>
      <div className="grid grid-cols-3 gap-4">
        {repos.map((repo, i) => {
          const value = repo[label.key];
          const isBest = i === bestIndex;
          
          return (
            <div
              key={i}
              className={`relative p-4 rounded-xl border transition ${
                isBest
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-gray-800/30 border-white/5"
              }`}
            >
              {isBest && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              )}
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{repo.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ================= VISUAL BAR CHART ================= */

const BarChart = ({ label, repos }) => {
  const values = repos.map(r => r[label.key] || 0);
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        {label.name}
      </h4>
      {repos.map((repo, i) => {
        const value = values[i];
        const percentage = (value / max) * 100;
        
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{repo.name}</span>
              <span className="font-semibold text-white">{value}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`h-full bg-gradient-to-r ${
                  i === 0 ? "from-blue-500 to-cyan-500" :
                  i === 1 ? "from-purple-500 to-pink-500" :
                  "from-green-500 to-emerald-500"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ================= MAIN PAGE ================= */

function Compare() {
  const [repoUrls, setRepoUrls] = useState(["", "", ""]);
  const [comparisons, setComparisons] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (index, value) => {
    const newUrls = [...repoUrls];
    newUrls[index] = value;
    setRepoUrls(newUrls);
  };

  const compareRepos = async () => {
    const validUrls = repoUrls.filter(url => url.trim());
    if (validUrls.length < 2) {
      alert("Please enter at least 2 repository URLs");
      return;
    }

    setLoading(true);
    setComparisons(null);

    try {
      const res = await fetch("http://localhost:5002/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrls: validUrls }),
      });

      const data = await res.json();
      setComparisons(data);
    } catch (err) {
      alert("Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const exportComparison = () => {
    // Create CSV export
    const csv = generateCSV(comparisons);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repo-comparison.csv';
    a.click();
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="compare" />
      
      <div className="relative z-10 flex justify-center px-4 py-12">
        <div className="w-full max-w-6xl space-y-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
              <GitCompare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Compare Repositories
            </h1>
            <p className="text-gray-400">
              Side-by-side analysis of up to 3 GitHub repositories
            </p>
          </motion.div>

          {/* INPUT SECTION */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Enter Repository URLs</h3>
            
            {repoUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i === 0 ? "bg-blue-500/20 text-blue-400" :
                  i === 1 ? "bg-purple-500/20 text-purple-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  {i + 1}
                </div>
                <input
                  className="flex-1 p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition text-white placeholder-gray-500"
                  placeholder={`https://github.com/user/repo${i === 2 ? " (optional)" : ""}`}
                  value={url}
                  onChange={(e) => handleUrlChange(i, e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={compareRepos}
              disabled={loading}
              className={`w-full mt-6 p-4 rounded-xl font-semibold text-lg transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "⚖️ Compare Repositories"
              )}
            </button>
          </div>

          {/* RESULTS */}
          <AnimatePresence>
            {comparisons && (
              <>
                {/* SUMMARY CARDS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-3 gap-4"
                >
                  {comparisons.repos.map((repo, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        i === 0 ? "bg-blue-500/20" :
                        i === 1 ? "bg-purple-500/20" :
                        "bg-green-500/20"
                      }`}>
                        <span className="text-2xl font-bold">{i + 1}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1 truncate">{repo.name}</h3>
                      <p className="text-sm text-gray-400">{repo.language}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-black/40 p-2 rounded-lg">
                          <p className="text-gray-500 text-xs">Stars</p>
                          <p className="font-semibold">⭐ {repo.stars}</p>
                        </div>
                        <div className="bg-black/40 p-2 rounded-lg">
                          <p className="text-gray-500 text-xs">Code IQ</p>
                          <p className="font-semibold text-green-400">{repo.codeIQ}/100</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* DETAILED COMPARISON */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Detailed Comparison</h2>
                    <button
                      onClick={exportComparison}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>

                  {/* Code Quality Metrics */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b border-white/10 pb-3">
                      📊 Code Quality Metrics
                    </h3>
                    
                    <BarChart
                      label={{ name: "Code IQ Score", key: "codeIQ" }}
                      repos={comparisons.repos}
                    />
                    
                    <BarChart
                      label={{ name: "Readability", key: "readability" }}
                      repos={comparisons.repos}
                    />
                    
                    <BarChart
                      label={{ name: "Documentation", key: "documentation" }}
                      repos={comparisons.repos}
                    />

                    <BarChart
                      label={{ name: "Test Coverage (Estimated)", key: "testReadiness" }}
                      repos={comparisons.repos}
                    />
                  </div>

                  {/* Repository Stats */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b border-white/10 pb-3">
                      📈 Repository Popularity
                    </h3>
                    
                    <ComparisonMetric
                      label={{ name: "GitHub Stars", key: "stars" }}
                      repos={comparisons.repos}
                      getBetter="higher"
                    />
                    
                    <ComparisonMetric
                      label={{ name: "Forks", key: "forks" }}
                      repos={comparisons.repos}
                      getBetter="higher"
                    />
                    
                    <ComparisonMetric
                      label={{ name: "Open Issues", key: "issues" }}
                      repos={comparisons.repos}
                      getBetter="lower"
                    />
                  </div>

                  {/* Tech Debt */}
                  {comparisons.repos[0].techDebt && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold border-b border-white/10 pb-3">
                        ⚠️ Technical Debt
                      </h3>
                      
                      <BarChart
                        label={{ name: "Tech Debt Score (Lower is Better)", key: "techDebt" }}
                        repos={comparisons.repos}
                      />
                    </div>
                  )}

                  {/* Winner Declaration */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Overall Winner</p>
                        <p className="text-2xl font-bold text-green-400">
                          {comparisons.winner.name}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {comparisons.winner.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageWrapper>
  );
}

// Helper: Generate CSV
const generateCSV = (data) => {
  const headers = ["Metric", ...data.repos.map(r => r.name)];
  const rows = [
    ["Code IQ", ...data.repos.map(r => r.codeIQ)],
    ["Stars", ...data.repos.map(r => r.stars)],
    ["Forks", ...data.repos.map(r => r.forks)],
    ["Issues", ...data.repos.map(r => r.issues)],
    ["Language", ...data.repos.map(r => r.language)],
  ];
  
  return [headers, ...rows].map(row => row.join(",")).join("\n");
};

export default Compare;