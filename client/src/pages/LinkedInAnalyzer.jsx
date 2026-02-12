import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Linkedin, TrendingUp, AlertCircle, CheckCircle, 
  Zap, Award, Users, FileText, Briefcase 
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";

function LinkedInAnalyzer() {
  // Form state
  const [profileData, setProfileData] = useState({
    headline: '',
    summaryLength: 0,
    experienceCount: 0,
    educationCount: 0,
    skillsCount: 0,
    connections: 0,
    hasPhoto: false,
    hasRecommendations: false,
    hasCertifications: false,
    hasProjects: false
  });

  // Results state
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("http://localhost:5002/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="profile" />

      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-5xl space-y-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
              <Linkedin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              LinkedIn Profile Analyzer
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get AI-powered insights to optimize your LinkedIn profile and boost your career prospects
            </p>
          </motion.div>

          {/* INPUT FORM */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold mb-4">Enter Your Profile Information</h3>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Headline <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-500"
                placeholder="e.g., Software Engineer | React.js, Node.js"
                value={profileData.headline}
                onChange={(e) => updateField('headline', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {profileData.headline.length}/120 characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Summary Length */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Summary Length (characters)
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
                  placeholder="e.g., 250"
                  value={profileData.summaryLength || ''}
                  onChange={(e) => updateField('summaryLength', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Experience Count */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Experiences
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
                  placeholder="e.g., 2"
                  value={profileData.experienceCount || ''}
                  onChange={(e) => updateField('experienceCount', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Education Count */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Education Entries
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
                  placeholder="e.g., 1"
                  value={profileData.educationCount || ''}
                  onChange={(e) => updateField('educationCount', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Skills Count */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Skills Listed
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
                  placeholder="e.g., 8"
                  value={profileData.skillsCount || ''}
                  onChange={(e) => updateField('skillsCount', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Connections */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Connections
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
                  placeholder="e.g., 150"
                  value={profileData.connections || ''}
                  onChange={(e) => updateField('connections', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800/70 transition">
                <input
                  type="checkbox"
                  checked={profileData.hasPhoto}
                  onChange={(e) => updateField('hasPhoto', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm">I have a professional photo</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800/70 transition">
                <input
                  type="checkbox"
                  checked={profileData.hasRecommendations}
                  onChange={(e) => updateField('hasRecommendations', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm">I have recommendations</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800/70 transition">
                <input
                  type="checkbox"
                  checked={profileData.hasCertifications}
                  onChange={(e) => updateField('hasCertifications', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm">I have certifications</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800/70 transition">
                <input
                  type="checkbox"
                  checked={profileData.hasProjects}
                  onChange={(e) => updateField('hasProjects', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm">I have projects listed</span>
              </label>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeProfile}
              disabled={loading || !profileData.headline}
              className={`w-full mt-6 p-4 rounded-xl font-semibold text-lg transition-all ${
                loading || !profileData.headline
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Profile...
                </span>
              ) : (
                "🔍 Analyze My Profile"
              )}
            </button>
          </div>

          {/* RESULTS */}
          <AnimatePresence>
            {analysis && (
              <>
                {/* COMPLETENESS SCORE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Award className="w-6 h-6 text-yellow-400" />
                      Profile Completeness
                    </h3>
                    <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${
                      analysis.analysis.grade.color === 'green' ? 'bg-green-500/20 text-green-400' :
                      analysis.analysis.grade.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      analysis.analysis.grade.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                      analysis.analysis.grade.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {analysis.analysis.grade.grade}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completeness Score</span>
                      <span className="font-semibold">{analysis.analysis.completeness}/100</span>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.analysis.completeness}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${
                          analysis.analysis.completeness >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          analysis.analysis.completeness >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          analysis.analysis.completeness >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Grade Label */}
                  <p className="text-center text-lg font-medium text-gray-300">
                    {analysis.analysis.grade.label}
                  </p>
                </motion.div>

                {/* PROFILE STRENGTH BREAKDOWN */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Strength Breakdown
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(analysis.analysis.strength).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-semibold">{Math.round(value)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full ${
                              value >= 70 ? 'bg-green-500' :
                              value >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* MISSING SECTIONS */}
                {analysis.analysis.missingSections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-red-400">
                        Missing Sections ({analysis.analysis.missingSections.length})
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {analysis.analysis.missingSections.map((section, i) => (
                        <div key={i} className="bg-black/40 p-3 rounded-lg flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                          <span className="text-sm">{section}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* HEADLINE ANALYSIS */}
                {analysis.analysis.headlineScore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-purple-400" />
                      Headline Analysis
                    </h3>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Headline Effectiveness</span>
                        <span className="font-semibold">{analysis.analysis.headlineScore.score}/100</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                          style={{ width: `${analysis.analysis.headlineScore.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {analysis.analysis.headlineScore.feedback.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-gray-300">{tip}</span>
                        </div>
                      ))}
                    </div>

                    {analysis.analysis.headlineScore.example && (
                      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">💡 Suggested Headline:</p>
                        <p className="text-sm text-blue-300 font-medium">{analysis.analysis.headlineScore.example}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* NETWORK HEALTH */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-green-400" />
                    Network Health
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-black/40 rounded-lg">
                      <p className="text-3xl font-bold text-green-400">{analysis.analysis.networkHealth.connections}</p>
                      <p className="text-sm text-gray-400 mt-1">Connections</p>
                    </div>
                    <div className="text-center p-4 bg-black/40 rounded-lg">
                      <p className="text-3xl font-bold text-blue-400">{analysis.analysis.networkHealth.score}/100</p>
                      <p className="text-sm text-gray-400 mt-1">Health Score</p>
                    </div>
                    <div className="md:col-span-1 text-center p-4 bg-black/40 rounded-lg flex items-center justify-center">
                      <p className="text-sm font-medium text-white">{analysis.analysis.networkHealth.status}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">💡 {analysis.analysis.networkHealth.advice}</p>
                  </div>
                </motion.div>

                {/* JOB READINESS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold">Job Readiness</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-black/40 rounded-lg">
                      <p className="text-4xl font-bold text-yellow-400">{analysis.analysis.jobReadiness.score}/100</p>
                      <p className="text-sm text-gray-400 mt-1">Readiness Score</p>
                    </div>
                    <div className="text-center p-4 bg-black/40 rounded-lg flex flex-col items-center justify-center">
                      <p className="text-xl font-semibold text-white">{analysis.analysis.jobReadiness.status}</p>
                      <p className="text-sm text-gray-400 mt-1">Current Status</p>
                    </div>
                  </div>

                  {analysis.analysis.jobReadiness.canApply ? (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-green-300">✨ You're ready to apply for jobs! Your profile is strong enough.</span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <span className="text-sm text-orange-300">Complete the missing sections below before applying to improve your chances.</span>
                    </div>
                  )}
                </motion.div>

                {/* RECOMMENDATIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold">Personalized Recommendations</h3>
                  </div>

                  <div className="space-y-4">
                    {analysis.analysis.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${
                          rec.priority === 'Critical' ? 'bg-red-500/10 border-red-500/30' :
                          rec.priority === 'High' ? 'bg-orange-500/10 border-orange-500/30' :
                          rec.priority === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                rec.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                rec.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {rec.priority}
                              </span>
                              <span className="text-sm font-semibold">{rec.action}</span>
                            </div>
                            <p className="text-xs text-gray-400">{rec.reason}</p>
                          </div>
                          <span className="text-xs text-green-400 font-semibold ml-2">{rec.impact}</span>
                        </div>

                        {rec.tips && rec.tips.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {rec.tips.map((tip, j) => (
                              <li key={j} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-blue-400 mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {rec.example && (
                          <div className="mt-3 p-2 bg-black/40 rounded text-xs text-gray-300">
                            <span className="text-gray-500">Example: </span>{rec.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* AI ROAST */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🔥 AI Career Coach Feedback
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{analysis.roast}</p>
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

export default LinkedInAnalyzer;