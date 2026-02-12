import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Upload, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Award, Zap, Target, FileCheck, Sparkles
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";

function ATSChecker() {
  // State
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
  };

  // Analyze resume
  const analyzeResume = async () => {
    if (!resumeFile) {
      alert('Please upload a resume first');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const res = await fetch("https://github-roaster-mvtz.vercel.app/analyze-ats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="explain" />

      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-5xl space-y-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ATS Resume Checker
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Upload your resume and get AI-powered insights to pass Applicant Tracking Systems
            </p>
          </motion.div>

          {/* UPLOAD SECTION */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            
            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Upload Resume <span className="text-red-400">*</span>
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
                  dragActive 
                    ? 'border-green-500 bg-green-500/10' 
                    : resumeFile
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                />
                
                {!resumeFile ? (
                  <label 
                    htmlFor="resume-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-white mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{resumeFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(resumeFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description <span className="text-gray-500">(Optional - for targeted analysis)</span>
              </label>
              <textarea
                className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition text-white placeholder-gray-500 min-h-[150px]"
                placeholder="Paste the job description here to get a targeted ATS score..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Add a job description for better keyword matching and tailored recommendations
              </p>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeResume}
              disabled={loading || !resumeFile}
              className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                loading || !resumeFile
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Resume...
                </span>
              ) : (
                "🔍 Check ATS Score"
              )}
            </button>
          </div>

          {/* RESULTS */}
          <AnimatePresence>
            {analysis && (
              <>
                {/* ATS SCORE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
                      <Award className="w-6 h-6 text-yellow-400" />
                      Overall ATS Score
                    </h3>

                    {/* Circular Progress */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-700"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysis.atsScore / 100)}`}
                          className={`${
                            analysis.atsScore >= 80 ? 'text-green-500' :
                            analysis.atsScore >= 60 ? 'text-blue-500' :
                            analysis.atsScore >= 40 ? 'text-yellow-500' :
                            'text-red-500'
                          } transition-all duration-1000`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold">{analysis.atsScore}</span>
                        <span className="text-gray-400 text-sm">/ 100</span>
                      </div>
                    </div>

                    {/* Grade */}
                    <div className={`inline-block px-6 py-3 rounded-xl font-bold text-2xl ${
                      analysis.grade.color === 'green' ? 'bg-green-500/20 text-green-400' :
                      analysis.grade.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      analysis.grade.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Grade {analysis.grade.grade} - {analysis.grade.label}
                    </div>
                  </div>
                </motion.div>

                {/* SCORE BREAKDOWN */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Score Breakdown
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(analysis.breakdown).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize flex items-center gap-2">
                            {key === 'keywords' && '🔑'}
                            {key === 'formatting' && '📄'}
                            {key === 'sections' && '📋'}
                            {key === 'experience' && '💼'}
                            {key === 'skills' && '⚡'}
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-semibold">{value}/100</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full ${
                              value >= 80 ? 'bg-green-500' :
                              value >= 60 ? 'bg-blue-500' :
                              value >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* FOUND vs MISSING KEYWORDS */}
                {analysis.keywords && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {/* Found Keywords */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        Found Keywords ({analysis.keywords.found.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.found.map((keyword, i) => (
                          <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                        <XCircle className="w-5 h-5" />
                        Missing Keywords ({analysis.keywords.missing.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.missing.length > 0 ? (
                          analysis.keywords.missing.map((keyword, i) => (
                            <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400">All important keywords found! ✨</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ISSUES & WARNINGS */}
                {analysis.issues && analysis.issues.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-400">
                      <AlertTriangle className="w-6 h-6" />
                      Issues Found ({analysis.issues.length})
                    </h3>

                    <div className="space-y-3">
                      {analysis.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-black/40 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            issue.severity === 'critical' ? 'bg-red-500/20' :
                            issue.severity === 'warning' ? 'bg-orange-500/20' :
                            'bg-yellow-500/20'
                          }`}>
                            <AlertTriangle className={`w-4 h-4 ${
                              issue.severity === 'critical' ? 'text-red-400' :
                              issue.severity === 'warning' ? 'text-orange-400' :
                              'text-yellow-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">{issue.title}</p>
                            <p className="text-xs text-gray-400">{issue.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* IMPROVEMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    Recommended Improvements
                  </h3>

                  <div className="space-y-4">
                    {analysis.improvements.map((improvement, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${
                          improvement.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                          improvement.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                improvement.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                improvement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {improvement.priority.toUpperCase()}
                              </span>
                              <span className="font-semibold">{improvement.title}</span>
                            </div>
                            <p className="text-sm text-gray-400">{improvement.description}</p>
                          </div>
                          {improvement.impact && (
                            <span className="text-xs text-green-400 font-semibold ml-2">
                              {improvement.impact}
                            </span>
                          )}
                        </div>

                        {improvement.tips && (
                          <ul className="mt-3 space-y-1">
                            {improvement.tips.map((tip, j) => (
                              <li key={j} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">→</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* WHAT TO AVOID */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
                    <XCircle className="w-6 h-6" />
                    What to Avoid
                  </h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    {analysis.avoid.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-black/40 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* AI FEEDBACK */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🤖 AI Career Coach Feedback
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {analysis.aiFeedback}
                    </p>
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

export default ATSChecker;
