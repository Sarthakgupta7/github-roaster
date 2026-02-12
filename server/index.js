import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { analyzeLinkedInProfile } from './utils/linkedinAnalyzer.js';
import multer from 'multer';
import mammoth from 'mammoth';
import { analyzeATSScore } from './utils/atsAnalyzer.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-debugging-disabled");




dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://github-roaster-ivory.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

/* ==================== INIT GROQ ==================== */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ==================== UTILS ==================== */
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const gradeFromCrimes = (count) => {
  if (count <= 2) return "A";
  if (count <= 4) return "B";
  if (count <= 7) return "C";
  if (count <= 10) return "D";
  return "F";
};

const getTechDebtGrade = (score) => {
  if (score <= 20) return "A";
  if (score <= 40) return "B";
  if (score <= 60) return "C";
  if (score <= 80) return "D";
  return "F";
};

/* ==================== TECH DEBT ANALYZER ==================== */
const analyzeTechDebt = async (owner, repo) => {
  try {
    const contentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    if (!contentsRes.ok) return null;

    const contents = await contentsRes.json();

    const metrics = {
      todoCount: 0,
      commentLines: 0,
      codeLines: 0,
      longFiles: 0,
      totalFiles: 0,
      avgFileLength: 0,
    };

    // Sample up to 10 code files
    const codeFiles = contents
      .filter((f) => f.type === "file" && isCodeFile(f.name))
      .slice(0, 10);

    for (const file of codeFiles) {
      metrics.totalFiles++;

      try {
        const fileRes = await fetch(file.download_url);
        const content = await fileRes.text();
        const lines = content.split("\n");

        metrics.avgFileLength += lines.length;

        if (lines.length > 500) metrics.longFiles++;

        // Count TODOs
        const todoMatches = content.match(/TODO|FIXME|HACK|XXX/gi);
        if (todoMatches) metrics.todoCount += todoMatches.length;

        // Simple comment detection
        const commentMatches = content.match(/\/\/|\/\*|\*\/|#/g);
        if (commentMatches) metrics.commentLines += commentMatches.length;

        metrics.codeLines += lines.filter((l) => l.trim().length > 0).length;
      } catch {
        continue;
      }
    }

    metrics.avgFileLength = Math.round(
      metrics.avgFileLength / (metrics.totalFiles || 1)
    );

    // Calculate score
    let score = 0;

    const todoDensity = metrics.todoCount / (metrics.totalFiles || 1);
    if (todoDensity > 5) score += 30;
    else if (todoDensity > 3) score += 20;
    else if (todoDensity > 1) score += 10;

    const commentRatio = metrics.commentLines / (metrics.codeLines || 1);
    if (commentRatio < 0.05) score += 25;
    else if (commentRatio > 0.4) score += 15;

    const longFileRatio = metrics.longFiles / (metrics.totalFiles || 1);
    if (longFileRatio > 0.5) score += 25;
    else if (longFileRatio > 0.3) score += 15;
    else if (longFileRatio > 0.1) score += 5;

    if (metrics.avgFileLength > 600) score += 10;
    else if (metrics.avgFileLength > 400) score += 5;

    score = Math.min(100, score);

    return {
      score,
      metrics,
      grade: getTechDebtGrade(score),
    };
  } catch {
    return null;
  }
};

const isCodeFile = (filename) => {
  const codeExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".go",
    ".rs",
    ".rb",
    ".php",
  ];
  return codeExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

/* ==================== TEST ==================== */
app.get("/", (_, res) => {
  res.send("🔥 RoastMyRepo backend running");
});

/* ==================== GITHUB OAUTH ==================== */
app.get("/auth/github", (req, res) => {
  const redirectUri ="https://github-roaster-mvtz.vercel.app/auth/github/callback";

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user`
  );
});

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const { access_token } = await tokenRes.json();

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = await userRes.json();

    res.redirect(
  `https://github-roaster-ivory.vercel.app/?user=${encodeURIComponent(
    JSON.stringify({
      login: user.login,
      avatar: user.avatar_url,
    })
  )}`
);

  } catch {
    res.status(500).send("GitHub auth failed");
  }
});

/* ==================== ROAST + CODE IQ + TECH DEBT ==================== */
app.post("/roast", async (req, res) => {
  const { repoUrl } = req.body;
  if (!repoUrl) return res.status(400).json({ error: "Repo URL required" });

  try {
    const clean = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = clean.split("/");

    /* ---------- Repo ---------- */
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    if (!repoRes.ok) {
      return res.status(404).json({ error: "Repo not found" });
    }

    const repoData = await repoRes.json();

    /* ---------- Commits ---------- */
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    const commits = await commitsRes.json();
    const messages = commits.map((c) => c.commit.message.toLowerCase());

    const crimePatterns = [
      "final",
      "final_final",
      "fix",
      "fixed",
      "ok",
      "update",
      "temp",
      "test",
    ];

    const crimeSet = new Set();
    let crimeCount = 0;

    messages.forEach((msg) => {
      crimePatterns.forEach((p) => {
        if (msg.includes(p)) {
          crimeCount++;
          crimeSet.add(p);
        }
      });
    });

    const commitGrade = gradeFromCrimes(crimeCount);

    /* ---------- File Structure ---------- */
    const contentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    const contents = contentsRes.ok ? await contentsRes.json() : [];

    const hasReadme = contents.some((f) =>
      f.name.toLowerCase().includes("readme")
    );

    const hasTests = contents.some((f) =>
      f.name.toLowerCase().includes("test")
    );

    const hasCI = contents.some((f) =>
      ["github", ".circleci"].some((k) => f.name.toLowerCase().includes(k))
    );

    /* ==================== CODE IQ ==================== */
    let readability = 50 + (repoData.description ? 20 : 0) + (hasReadme ? 30 : 0);
    let structure = 60 + (repoData.language ? 10 : 0) - (repoData.size > 50000 ? 15 : 0);
    let commitsScore = clamp(100 - crimeCount * 6);
    let documentation = (hasReadme ? 70 : 20) + (repoData.has_wiki ? 20 : 0);
    let testReadiness = (hasTests ? 50 : 0) + (hasCI ? 30 : 0);

    readability = clamp(readability);
    structure = clamp(structure);
    documentation = clamp(documentation);
    testReadiness = clamp(testReadiness);

    const finalIQ = Math.round(
      readability * 0.2 +
        structure * 0.2 +
        commitsScore * 0.25 +
        documentation * 0.2 +
        testReadiness * 0.15
    );

    /* ==================== TECH DEBT ==================== */
    const techDebt = await analyzeTechDebt(owner, repo);

    /* ---------- AI Improvements ---------- */
    const improvementRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a senior code reviewer. Give 3 concise improvement suggestions.",
        },
        {
          role: "user",
          content: `
Readability: ${readability}
Structure: ${structure}
Commits: ${commitsScore}
Documentation: ${documentation}
Test Readiness: ${testReadiness}
Tech Debt Score: ${techDebt?.score || "N/A"}
`,
        },
      ],
    });

    /* ---------- Personality ---------- */
    const personalityRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Stars: ${repoData.stargazers_count}
Issues: ${repoData.open_issues_count}
Commit crimes: ${crimeCount}
Language: ${repoData.language}

Describe this repo's personality in ONE short phrase.
`,
        },
      ],
    });

    /* ---------- Roast ---------- */
    const roastRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a sarcastic senior software engineer. Roast the repo. Funny but not abusive.",
        },
        {
          role: "user",
          content: `
Repo: ${repoData.full_name}
Stars: ${repoData.stargazers_count}
Issues: ${repoData.open_issues_count}
Language: ${repoData.language}
Commit crimes: ${crimeCount}
Tech Debt: ${techDebt?.score || "Unknown"}/100

Under 120 words. End with a witty verdict.
`,
        },
      ],
    });

    /* ==================== RESPONSE ==================== */
    res.json({
      roast: roastRes.choices[0].message.content,
      stats: {
        name: repoData.full_name,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        language: repoData.language,
      },
      personality: personalityRes.choices[0].message.content,
      commitCrimes: {
        count: crimeCount,
        grade: commitGrade,
        crimes: Array.from(crimeSet),
      },
      codeIQ: {
        readability,
        structure,
        commits: commitsScore,
        documentation,
        testReadiness,
        final: finalIQ,
      },
      techDebt,
      improvements: improvementRes.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Roast failed" });
  }
});

/* ==================== EXPLAIN (ENHANCED) ==================== */
app.post("/explain", async (req, res) => {
  const { repoUrl, role } = req.body;

  const styles = {
    hr: "Explain this repo to a non-technical HR recruiter focusing on team skills and project impact.",
    pm: "Explain this repo to a product manager focusing on business value, features, and user benefits.",
    junior: `You are explaining code to a junior developer. Be specific about:
1. What programming language is used and why
2. What the code actually does (main purpose)
3. Key features the project has
4. File structure and organization
5. How they could learn from this project
Format with clear sections and examples.`,
  };

  try {
    const clean = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = clean.split("/");

    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    const repoData = await repoRes.json();

    // For junior dev mode, fetch file structure
    let codeAnalysis = null;
    let keyFeatures = null;

    if (role === "junior") {
      const contentsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        { headers: { "User-Agent": "RoastMyRepo" } }
      );
      
      const contents = contentsRes.ok ? await contentsRes.json() : [];
      const fileStructure = contents
        .slice(0, 8)
        .map(f => f.name);

      codeAnalysis = {
        language: repoData.language || "Unknown",
        fileStructure,
        purpose: repoData.description || "No description available",
      };

      // Extract key features using AI
      const featuresRes = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `List 3-5 key features of this ${repoData.language} project called "${repoData.name}". Description: ${repoData.description}. Return only the features as a JSON array of strings.`,
          },
        ],
      });

      try {
        const featuresText = featuresRes.choices[0].message.content;
        const jsonMatch = featuresText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          keyFeatures = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        keyFeatures = [];
      }
    }

    const explainRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: styles[role] },
        {
          role: "user",
          content: `
Repo: ${repoData.full_name}
Description: ${repoData.description}
Language: ${repoData.language}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
${role === "junior" ? `Files: ${codeAnalysis?.fileStructure.join(", ")}` : ""}
`,
        },
      ],
    });

    res.json({
      explanation: explainRes.choices[0].message.content,
      codeAnalysis,
      keyFeatures,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Explain failed" });
  }
});

/* ==================== COMPARE REPOSITORIES ==================== */
app.post("/compare", async (req, res) => {
  const { repoUrls } = req.body;

  if (!repoUrls || repoUrls.length < 2) {
    return res.status(400).json({ error: "At least 2 repos required" });
  }

  try {
    const comparisons = [];

    for (const repoUrl of repoUrls) {
      const clean = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
      const [owner, repo] = clean.split("/");

      // Fetch repo data
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers: { "User-Agent": "RoastMyRepo" } }
      );

      if (!repoRes.ok) continue;

      const repoData = await repoRes.json();

      // Fetch commits
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
        { headers: { "User-Agent": "RoastMyRepo" } }
      );

      const commits = await commitsRes.json();
      const messages = commits.map((c) => c.commit.message.toLowerCase());

      const crimePatterns = ["final", "fix", "fixed", "ok", "update", "temp"];
      let crimeCount = 0;
      messages.forEach((msg) => {
        crimePatterns.forEach((p) => {
          if (msg.includes(p)) crimeCount++;
        });
      });

      // Fetch contents
      const contentsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        { headers: { "User-Agent": "RoastMyRepo" } }
      );

      const contents = contentsRes.ok ? await contentsRes.json() : [];

      const hasReadme = contents.some((f) =>
        f.name.toLowerCase().includes("readme")
      );
      const hasTests = contents.some((f) =>
        f.name.toLowerCase().includes("test")
      );

      // Calculate metrics
      let readability = 50 + (repoData.description ? 20 : 0) + (hasReadme ? 30 : 0);
      let documentation = (hasReadme ? 70 : 20) + (repoData.has_wiki ? 20 : 0);
      let testReadiness = hasTests ? 60 : 10;
      let commitsScore = clamp(100 - crimeCount * 6);

      readability = clamp(readability);
      documentation = clamp(documentation);
      testReadiness = clamp(testReadiness);

      const codeIQ = Math.round(
        (readability + documentation + testReadiness + commitsScore) / 4
      );

      // Tech debt (simplified)
      const techDebt = Math.min(100, crimeCount * 8 + (hasTests ? 0 : 20));

      comparisons.push({
        name: repoData.full_name,
        language: repoData.language || "Unknown",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
        codeIQ,
        readability,
        documentation,
        testReadiness,
        techDebt,
      });
    }

    // Determine winner
    const winner = comparisons.reduce((best, current) =>
      current.codeIQ > best.codeIQ ? current : best
    );

    winner.reason = `Highest Code IQ (${winner.codeIQ}/100) with strong ${
      winner.readability > 70 ? "readability" : winner.documentation > 70 ? "documentation" : "test coverage"
    }`;

    res.json({
      repos: comparisons,
      winner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison failed" });
  }
});

// Add this to your server.js file

// Import at the top

// Add this endpoint (paste after your other endpoints)

/* ==================== LINKEDIN ANALYZER ==================== */
app.post("/analyze-linkedin", async (req, res) => {
  const { profileData } = req.body;
  
  try {
    // Validate input
    if (!profileData) {
      return res.status(400).json({ error: 'Profile data is required' });
    }
    
    // Analyze profile
    const analysis = analyzeLinkedInProfile(profileData);
    
    // Generate AI roast
    const roastRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a LinkedIn expert and career coach. Provide constructive feedback on LinkedIn profiles with humor but be helpful. Focus on:
- Profile completeness and optimization
- Headline effectiveness
- Summary quality
- Experience presentation
- Skills and endorsements
- Networking strategy

Be witty but actionable. Keep it under 150 words. End with specific improvement tips.`
        },
        {
          role: "user",
          content: `
Analyze this LinkedIn Profile:

Basic Info:
- Headline: ${profileData.headline || 'Missing'}
- Summary Length: ${profileData.summaryLength} characters
- Has Photo: ${profileData.hasPhoto ? 'Yes' : 'No'}

Content:
- Experience: ${profileData.experienceCount} positions
- Education: ${profileData.educationCount} degrees
- Skills: ${profileData.skillsCount} listed
- Connections: ${profileData.connections}

Sections:
- Recommendations: ${profileData.hasRecommendations ? 'Yes' : 'No'}
- Certifications: ${profileData.hasCertifications ? 'Yes' : 'No'}
- Projects: ${profileData.hasProjects ? 'Yes' : 'No'}

Completeness Score: ${analysis.completeness}/100
Missing: ${analysis.missingSections.join(', ') || 'Nothing!'}

Provide a witty roast with actionable advice.
          `
        }
      ]
    });
    
    const roast = roastRes.choices[0].message.content;
    
    // Send response
    res.json({
      analysis,
      roast,
      profileData
    });
    
  } catch (error) {
    console.error('LinkedIn analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze LinkedIn profile',
      details: error.message 
    });
  }
});
// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

/* ==================== ATS RESUME CHECKER ==================== */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}


// ===== UPDATED ATS ENDPOINT (Replace your /analyze-ats endpoint) =====
app.post("/analyze-ats", upload.single('resume'), async (req, res) => {
  console.log('📥 ATS Analysis Request Received');
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'Resume file is required' });
    }
    
    console.log('✅ File received:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

    const { jobDescription } = req.body;
    let resumeText = '';

    // Extract text based on file type
    try {
      if (req.file.mimetype === 'application/pdf') {
        console.log('📕 Parsing PDF with pdfjs-dist...');
        resumeText = await extractTextFromPDF(req.file.buffer);
        console.log('✅ PDF parsed, text length:', resumeText.length);
      } else if (req.file.mimetype.includes('word')) {
        console.log('📘 Parsing Word document...');
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = result.value;
        console.log('✅ Word document parsed, text length:', resumeText.length);
      } else {
        return res.status(400).json({ 
          error: 'Unsupported file type. Please upload PDF or Word document.' 
        });
      }
    } catch (parseError) {
      console.error('❌ File parsing error:', parseError);
      return res.status(400).json({ 
        error: 'Failed to parse file',
        details: parseError.message
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      console.log('❌ Insufficient text extracted:', resumeText.length, 'chars');
      return res.status(400).json({ 
        error: 'Could not extract enough text from resume. Please ensure the file contains readable text (not scanned images).' 
      });
    }
    
    console.log('✅ Text extracted successfully');

    // Analyze ATS score
    console.log('🔍 Starting ATS analysis...');
    const analysis = analyzeATSScore(resumeText, jobDescription || '');
    console.log('✅ Analysis complete:', {
      score: analysis.atsScore,
      grade: analysis.grade.grade
    });

    // Generate AI feedback
    console.log('🤖 Generating AI feedback...');
    let aiFeedback = '';
    try {
      aiFeedback = await generateAIFeedback(analysis, resumeText, jobDescription, groq);
      console.log('✅ AI feedback generated');
    } catch (aiError) {
      console.error('⚠️ AI feedback error:', aiError);
      aiFeedback = 'AI feedback temporarily unavailable.';
    }

    // Send response
    const response = {
      ...analysis,
      aiFeedback,
      resumeLength: resumeText.length,
      wordCount: resumeText.split(/\s+/).length
    };
    
    console.log('✅ Sending successful response');
    res.json(response);

  } catch (error) {
    console.error('❌ ATS analysis error:', error);
    res.status(500).json({ 
      error: 'Server error occurred',
      details: error.message
    });
  }
});

// Generate AI feedback function (keep this the same)
async function generateAIFeedback(analysis, resumeText, jobDescription, groqClient) {
  try {
    const hasJD = jobDescription && jobDescription.trim().length > 50;

    const prompt = `You are an expert resume reviewer and ATS specialist. Provide constructive feedback on this resume.

ATS Analysis Results:
- Overall Score: ${analysis.atsScore}/100 (Grade ${analysis.grade.grade})
- Keywords Score: ${analysis.breakdown.keywords}/100
- Formatting Score: ${analysis.breakdown.formatting}/100
- Sections Score: ${analysis.breakdown.sections}/100
- Experience Score: ${analysis.breakdown.experience}/100
- Skills Score: ${analysis.breakdown.skills}/100

${hasJD ? `Job Description Match:
- Keywords Found: ${analysis.keywords.found.length}
- Keywords Missing: ${analysis.keywords.missing.length}
- Missing: ${analysis.keywords.missing.slice(0, 5).join(', ')}` : ''}

Issues Found: ${analysis.issues.length}
${analysis.issues.slice(0, 3).map(i => `- ${i.title}`).join('\n')}

Provide:
1. Brief overall assessment (2-3 sentences)
2. Top 3 strengths
3. Top 3 areas for immediate improvement
4. One specific actionable tip

Keep it under 200 words. Be encouraging but honest.`;

    const response = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a professional resume coach and ATS expert. Provide constructive, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('AI feedback error:', error);
    return 'AI feedback unavailable. Your resume has been analyzed successfully.';
  }
}

// Add these endpoints to your server/index.js

/* ==================== LINKEDIN POST GENERATOR - MANUAL MODE ==================== */
app.post("/generate-linkedin-post", async (req, res) => {
  const { achievement, audience, tone, postType } = req.body;

  try {
    console.log('📝 Generating LinkedIn posts (manual mode)...');

    if (!achievement || achievement.trim().length < 10) {
      return res.status(400).json({ error: 'Achievement must be at least 10 characters' });
    }

    // Generate 4 different post variations
    const variations = await Promise.all([
      generatePost(achievement, audience, tone, postType, 'storytelling'),
      generatePost(achievement, audience, tone, postType, 'professional'),
      generatePost(achievement, audience, tone, postType, 'engagement'),
      generatePost(achievement, audience, tone, postType, 'educational')
    ]);

    // Generate hashtags
    const hashtags = await generateHashtags(achievement, audience, postType);

    // Generate engagement tips
    const tips = getEngagementTips(audience, postType);

    res.json({
      variations,
      hashtags,
      tips
    });

  } catch (error) {
    console.error('LinkedIn post generation error:', error);
    res.status(500).json({ error: 'Failed to generate posts' });
  }
});

/* ==================== LINKEDIN POST GENERATOR - GITHUB MODE ==================== */
app.post("/generate-linkedin-post-github", async (req, res) => {
  const { githubUrl, audience = 'developers', tone = 'professional' } = req.body;

  try {
    console.log('📝 Generating LinkedIn posts from GitHub repo...');

    if (!githubUrl) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    // Extract owner and repo
    const clean = githubUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = clean.split("/");

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }

    // Fetch repo data
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    if (!repoRes.ok) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    const repoData = await repoRes.json();

    // Fetch README for more context
    let readmeContent = '';
    try {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        { headers: { "User-Agent": "RoastMyRepo", "Accept": "application/vnd.github.v3.raw" } }
      );
      if (readmeRes.ok) {
        readmeContent = await readmeRes.text();
        // Limit to first 500 chars
        readmeContent = readmeContent.substring(0, 500);
      }
    } catch (err) {
      console.log('No README found');
    }

    // Build project summary
    const projectSummary = `
Project: ${repoData.name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Topics: ${repoData.topics?.join(', ') || 'None'}
${readmeContent ? `\nREADME excerpt: ${readmeContent}` : ''}
`.trim();

    // Generate 4 variations using the repo data
    const variations = await Promise.all([
      generateGitHubPost(projectSummary, repoData, audience, tone, 'storytelling'),
      generateGitHubPost(projectSummary, repoData, audience, tone, 'professional'),
      generateGitHubPost(projectSummary, repoData, audience, tone, 'engagement'),
      generateGitHubPost(projectSummary, repoData, audience, tone, 'technical')
    ]);

    // Generate hashtags based on repo
    const hashtags = await generateGitHubHashtags(repoData);

    // Get tips
    const tips = getEngagementTips(audience, 'announcement');

    res.json({
      variations,
      hashtags,
      tips,
      repoData: {
        name: repoData.name,
        stars: repoData.stargazers_count,
        language: repoData.language
      }
    });

  } catch (error) {
    console.error('GitHub post generation error:', error);
    res.status(500).json({ error: 'Failed to generate posts from GitHub repo' });
  }
});

/* ==================== HELPER FUNCTIONS ==================== */

// Generate single post variation
async function generatePost(achievement, audience, tone, postType, style) {
  const styleGuides = {
    storytelling: `Start with a hook or question. Tell a brief story with a beginning, middle, and end. Use emojis sparingly. End with a call-to-action.`,
    professional: `Be formal and concise. Use bullet points. Focus on facts and achievements. Include metrics if possible. Professional tone throughout.`,
    engagement: `Start with a surprising statistic or question. Make it conversational. Encourage comments. Use relevant emojis. Ask for opinions.`,
    educational: `Share valuable insights. Teach something useful. Use clear structure. Include actionable tips. Be helpful and informative.`
  };

  const audienceContext = {
    recruiters: 'Emphasize skills, impact, and professional growth',
    developers: 'Focus on technical details, stack, and implementation',
    entrepreneurs: 'Highlight business value, innovation, and scalability',
    general: 'Balance technical and non-technical language',
    students: 'Inspire and educate, show learning journey'
  };

  const prompt = `You are a LinkedIn content strategist. Create a LinkedIn post about this achievement:

"${achievement}"

Requirements:
- Target audience: ${audience} (${audienceContext[audience]})
- Tone: ${tone}
- Post type: ${postType}
- Style: ${style} - ${styleGuides[style]}
- Length: 150-300 words (under 3000 characters)
- Include relevant emojis (2-5 total)
- NO hashtags in the post (they'll be added separately)
- Use line breaks for readability
- End with a clear call-to-action or question

Make it engaging and authentic. Don't be overly promotional.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert LinkedIn content creator who writes viral posts."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 800
  });

  const content = response.choices[0].message.content;

  // Calculate engagement score
  const engagementScore = calculateEngagementScore(content, style);

  // Get style description
  const descriptions = {
    storytelling: 'Narrative-driven with emotional connection',
    professional: 'Direct and achievement-focused',
    engagement: 'Question-based to drive comments',
    educational: 'Value-packed with actionable insights'
  };

  return {
    style,
    content: content.trim(),
    engagementScore,
    description: descriptions[style]
  };
}

// Generate post from GitHub repo
async function generateGitHubPost(projectSummary, repoData, audience, tone, style) {
  const styleGuides = {
    storytelling: `Tell the story of building this project. Why you built it, challenges faced, what you learned.`,
    professional: `Announce the project professionally. Focus on features, tech stack, and business value.`,
    engagement: `Make it conversational. Ask for feedback. Encourage people to try it or contribute.`,
    technical: `Deep dive into the technical aspects. Explain architecture, design decisions, and interesting challenges solved.`
  };

  const prompt = `Create a LinkedIn post announcing this GitHub project:

${projectSummary}

Repository URL: ${repoData.html_url}

Requirements:
- Style: ${style} - ${styleGuides[style]}
- Target audience: ${audience}
- Tone: ${tone}
- Length: 150-300 words
- Include 2-5 relevant emojis
- Mention tech stack prominently
- Include the GitHub URL at the end
- Add a call-to-action (try it, contribute, feedback, etc.)
- NO hashtags (added separately)

Make it authentic and exciting without being overly promotional.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert at writing engaging LinkedIn posts about tech projects."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 800
  });

  const content = response.choices[0].message.content;
  const engagementScore = calculateEngagementScore(content, style);

  const descriptions = {
    storytelling: 'Story-driven project announcement',
    professional: 'Professional project showcase',
    engagement: 'Interactive and conversational',
    technical: 'Technical deep-dive'
  };

  return {
    style,
    content: content.trim(),
    engagementScore,
    description: descriptions[style]
  };
}

// Generate hashtags
async function generateHashtags(achievement, audience, postType) {
  const prompt = `Generate 8-10 relevant LinkedIn hashtags for this post:

Achievement: "${achievement}"
Audience: ${audience}
Type: ${postType}

Return ONLY a JSON array of hashtag strings (without # symbol).
Mix of popular (10k-100k followers) and niche (1k-10k followers) hashtags.

Example format: ["WebDevelopment", "JavaScript", "TechCareers", "100DaysOfCode"]`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  });

  try {
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const tags = JSON.parse(jsonMatch[0]);
      return tags.map(tag => `#${tag.replace('#', '')}`);
    }
  } catch (err) {
    console.error('Hashtag parsing error:', err);
  }

  // Fallback hashtags
  return ['#WebDevelopment', '#Coding', '#TechCareers', '#SoftwareEngineering', '#100DaysOfCode'];
}

// Generate hashtags from GitHub repo
async function generateGitHubHashtags(repoData) {
  const topics = repoData.topics || [];
  const language = repoData.language || '';

  // Base hashtags
  const hashtags = ['#OpenSource', '#GitHub', '#Coding'];

  // Add language
  if (language) {
    hashtags.push(`#${language}`);
  }

  // Add topics
  topics.slice(0, 5).forEach(topic => {
    const tag = topic.replace(/-/g, '').replace(/ /g, '');
    hashtags.push(`#${tag}`);
  });

  // Add common tech hashtags
  const commonTags = ['#WebDevelopment', '#SoftwareEngineering', '#DevCommunity', '#BuildInPublic'];
  hashtags.push(...commonTags.slice(0, 10 - hashtags.length));

  return hashtags.slice(0, 10);
}

// Calculate engagement score
function calculateEngagementScore(content, style) {
  let score = 50; // Base score

  // Length check (150-300 words is optimal)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 300) score += 15;
  else if (wordCount < 100) score -= 10;

  // Has question (drives comments)
  if (content.includes('?')) score += 10;

  // Has emojis (but not too many)
  const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount >= 2 && emojiCount <= 5) score += 10;
  else if (emojiCount > 8) score -= 5;

  // Has line breaks (readability)
  const lineBreaks = (content.match(/\n/g) || []).length;
  if (lineBreaks >= 3) score += 5;

  // Has numbers/metrics
  if (/\d+%|\d+\+|\d+ (users|developers|people|projects)/.test(content)) score += 10;

  // Style bonuses
  if (style === 'engagement') score += 5;
  if (style === 'storytelling') score += 3;

  return Math.min(95, Math.max(40, score));
}

// Get engagement tips
function getEngagementTips(audience, postType) {
  const tips = [
    'Post between 7-9 AM or 12-1 PM on Tuesday-Thursday for maximum visibility',
    'Respond to all comments within the first 2 hours to boost engagement',
    'Tag relevant people or companies (but don\'t overdo it)',
    'Add a compelling image or document to increase engagement by 2x',
    'Use line breaks to make your post easy to scan',
    'Ask a specific question at the end to encourage comments',
    'Share your post in LinkedIn Stories for additional reach',
    'Engage with others\' posts before posting your own'
  ];

  // Shuffle and return 5 random tips
  return tips.sort(() => 0.5 - Math.random()).slice(0, 5);
}


/* ==================== SERVER ==================== */
app.listen(5002, () =>
  console.log("✅ Server running on http://localhost:5002")
);
export default app;
