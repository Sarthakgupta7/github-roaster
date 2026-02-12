import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Linkedin, Sparkles, Copy, Check, Hash, TrendingUp,
  FileText, Github, Zap, Eye
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import AnimatedBackground from "../components/AnimatedBackground";

function LinkedInPostGenerator() {
  // Mode selection
  const [mode, setMode] = useState("manual"); // "manual" or "github"

  // Manual mode state
  const [formData, setFormData] = useState({
    achievement: "",
    audience: "recruiters",
    tone: "professional",
    postType: "announcement"
  });

  // GitHub mode state
  const [githubUrl, setGithubUrl] = useState("");

  // Results state
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  // Generate posts
  const generatePosts = async () => {
    if (mode === "manual" && !formData.achievement.trim()) {
      alert("Please enter your achievement");
      return;
    }

    if (mode === "github" && !githubUrl.trim()) {
      alert("Please enter a GitHub repository URL");
      return;
    }

    setLoading(true);
    setPosts(null);

    try {
      const endpoint = mode === "manual" 
        ? "http://localhost:5002/generate-linkedin-post"
        : "http://localhost:5002/generate-linkedin-post-github";

      const body = mode === "manual" 
        ? formData 
        : { githubUrl };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to generate posts");
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <PageWrapper>
      <AnimatedBackground variant="profile" />

      <div className="relative flex justify-center px-4 py-12">
        <div className="w-full max-w-6xl space-y-6">

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
              LinkedIn Post Generator
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Generate engaging LinkedIn posts from your achievements or GitHub projects
            </p>
          </motion.div>

          {/* MODE SELECTOR */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMode("manual")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                mode === "manual"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Manual Input
            </button>
            <button
              onClick={() => setMode("github")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                mode === "github"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <Github className="w-5 h-5 inline mr-2" />
              From GitHub Repo
            </button>
          </div>

          {/* INPUT SECTION */}
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            
            {/* MANUAL MODE */}
            {mode === "manual" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Tell Us About Your Achievement</h3>

                {/* Achievement */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Achievement <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-500 min-h-[120px]"
                    placeholder="e.g., Built an AI-powered resume checker that analyzes ATS compatibility and provides personalized feedback..."
                    value={formData.achievement}
                    onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.achievement.length} characters
                  </p>
                </div>

                {/* Grid of selectors */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Audience */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <select
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    >
                      <option value="recruiters">Recruiters</option>
                      <option value="developers">Developers</option>
                      <option value="entrepreneurs">Entrepreneurs</option>
                      <option value="general">General Network</option>
                      <option value="students">Students</option>
                    </select>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="storytelling">Storytelling</option>
                      <option value="inspirational">Inspirational</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>

                  {/* Post Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Type</label>
                    <select
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.postType}
                      onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                    >
                      <option value="announcement">Project Announcement</option>
                      <option value="tutorial">Tutorial/How-To</option>
                      <option value="milestone">Milestone/Achievement</option>
                      <option value="jobSearch">Job Search</option>
                      <option value="insight">Industry Insight</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* GITHUB MODE */}
            {mode === "github" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Enter GitHub Repository URL</h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GitHub Repository URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    className="w-full p-4 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white placeholder-gray-500"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 We'll analyze your repo and generate LinkedIn posts about your project
                  </p>
                </div>

                {/* Optional preferences */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <select
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    >
                      <option value="recruiters">Recruiters</option>
                      <option value="developers">Developers</option>
                      <option value="general">General Network</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="storytelling">Storytelling</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generatePosts}
              disabled={loading}
              className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Posts...
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Generate LinkedIn Posts
                </>
              )}
            </button>
          </div>

          {/* RESULTS */}
          <AnimatePresence>
            {posts && (
              <>
                {/* POST VARIATIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Generated Posts ({posts.variations.length})
                  </h2>

                  {posts.variations.map((post, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                              post.style === 'storytelling' ? 'bg-purple-500/20 text-purple-400' :
                              post.style === 'professional' ? 'bg-blue-500/20 text-blue-400' :
                              post.style === 'engagement' ? 'bg-green-500/20 text-green-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {post.style}
                            </span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-semibold">
                                {post.engagementScore}% predicted engagement
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{post.description}</p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="bg-black/40 p-4 rounded-xl mb-4 relative">
                        <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed">
                          {post.content}
                        </pre>
                        <div className="absolute top-3 right-3 text-xs text-gray-500">
                          {post.content.length}/3000
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => copyToClipboard(post.content, index)}
                          className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Post
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                          className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {previewIndex === index ? "Hide" : "Preview"}
                        </button>
                      </div>

                      {/* Preview Mode */}
                      <AnimatePresence>
                        {previewIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 border-t border-white/10 pt-4"
                          >
                            <p className="text-sm text-gray-400 mb-3">LinkedIn Preview:</p>
                            <div className="bg-white rounded-lg p-4">
                              {/* LinkedIn-style header */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div>
                                  <p className="font-semibold text-gray-900">Your Name</p>
                                  <p className="text-xs text-gray-600">Your Headline • 1m</p>
                                </div>
                              </div>
                              {/* Post content */}
                              <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                                {post.content}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>

                {/* HASHTAGS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Hash className="w-6 h-6 text-blue-400" />
                    Recommended Hashtags
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {posts.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => copyToClipboard(tag, `hashtag-${i}`)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm cursor-pointer hover:bg-blue-500/30 transition"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => copyToClipboard(posts.hashtags.join(' '), 'all-hashtags')}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    {copiedIndex === 'all-hashtags' ? '✓ Copied all hashtags!' : 'Copy all hashtags'}
                  </button>
                </motion.div>

                {/* TIPS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Pro Tips for Maximum Engagement
                  </h3>

                  <ul className="space-y-2">
                    {posts.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-yellow-400 mt-0.5">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageWrapper>
  );
}

export default LinkedInPostGenerator;