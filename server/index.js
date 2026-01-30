// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import Groq from "groq-sdk";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// /* ==================== INIT GROQ ==================== */
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// /* ==================== UTILS ==================== */
// const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

// const gradeFromCrimes = (count) => {
//   if (count <= 2) return "A";
//   if (count <= 4) return "B";
//   if (count <= 7) return "C";
//   if (count <= 10) return "D";
//   return "F";
// };

// const getTechDebtGrade = (score) => {
//   if (score <= 20) return "A";
//   if (score <= 40) return "B";
//   if (score <= 60) return "C";
//   if (score <= 80) return "D";
//   return "F";
// };

// /* ==================== TECH DEBT ANALYZER ==================== */
// const analyzeTechDebt = async (owner, repo) => {
//   try {
//     const contentsRes = await fetch(
//       `https://api.github.com/repos/${owner}/${repo}/contents`,
//       { headers: { "User-Agent": "RoastMyRepo" } }
//     );

//     if (!contentsRes.ok) return null;

//     const contents = await contentsRes.json();

//     const metrics = {
//       todoCount: 0,
//       commentLines: 0,
//       codeLines: 0,
//       longFiles: 0,
//       totalFiles: 0,
//       avgFileLength: 0,
//     };

//     // Sample up to 10 code files
//     const codeFiles = contents
//       .filter((f) => f.type === "file" && isCodeFile(f.name))
//       .slice(0, 10);

//     for (const file of codeFiles) {
//       metrics.totalFiles++;

//       try {
//         const fileRes = await fetch(file.download_url);
//         const content = await fileRes.text();
//         const lines = content.split("\n");

//         metrics.avgFileLength += lines.length;

//         if (lines.length > 500) metrics.longFiles++;

//         // Count TODOs
//         const todoMatches = content.match(/TODO|FIXME|HACK|XXX/gi);
//         if (todoMatches) metrics.todoCount += todoMatches.length;

//         // Simple comment detection
//         const commentMatches = content.match(/\/\/|\/\*|\*\/|#/g);
//         if (commentMatches) metrics.commentLines += commentMatches.length;

//         metrics.codeLines += lines.filter((l) => l.trim().length > 0).length;
//       } catch {
//         continue;
//       }
//     }

//     metrics.avgFileLength = Math.round(
//       metrics.avgFileLength / (metrics.totalFiles || 1)
//     );

//     // Calculate score
//     let score = 0;

//     const todoDensity = metrics.todoCount / (metrics.totalFiles || 1);
//     if (todoDensity > 5) score += 30;
//     else if (todoDensity > 3) score += 20;
//     else if (todoDensity > 1) score += 10;

//     const commentRatio = metrics.commentLines / (metrics.codeLines || 1);
//     if (commentRatio < 0.05) score += 25;
//     else if (commentRatio > 0.4) score += 15;

//     const longFileRatio = metrics.longFiles / (metrics.totalFiles || 1);
//     if (longFileRatio > 0.5) score += 25;
//     else if (longFileRatio > 0.3) score += 15;
//     else if (longFileRatio > 0.1) score += 5;

//     if (metrics.avgFileLength > 600) score += 10;
//     else if (metrics.avgFileLength > 400) score += 5;

//     score = Math.min(100, score);

//     return {
//       score,
//       metrics,
//       grade: getTechDebtGrade(score),
//     };
//   } catch {
//     return null;
//   }
// };

// const isCodeFile = (filename) => {
//   const codeExtensions = [
//     ".js",
//     ".jsx",
//     ".ts",
//     ".tsx",
//     ".py",
//     ".java",
//     ".c",
//     ".cpp",
//     ".go",
//     ".rs",
//     ".rb",
//     ".php",
//   ];
//   return codeExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
// };

// /* ==================== TEST ==================== */
// app.get("/", (_, res) => {
//   res.send("🔥 RoastMyRepo backend running");
// });

// /* ==================== GITHUB OAUTH ==================== */
// app.get("/auth/github", (req, res) => {
//   const redirectUri = "http://localhost:5002/auth/github/callback";
//   res.redirect(
//     `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user`
//   );
// });

// app.get("/auth/github/callback", async (req, res) => {
//   const { code } = req.query;

//   try {
//     const tokenRes = await fetch(
//       "https://github.com/login/oauth/access_token",
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           client_id: process.env.GITHUB_CLIENT_ID,
//           client_secret: process.env.GITHUB_CLIENT_SECRET,
//           code,
//         }),
//       }
//     );

//     const { access_token } = await tokenRes.json();

//     const userRes = await fetch("https://api.github.com/user", {
//       headers: { Authorization: `Bearer ${access_token}` },
//     });

//     const user = await userRes.json();

//     res.redirect(
//       `http://localhost:5173?user=${encodeURIComponent(
//         JSON.stringify({
//           login: user.login,
//           avatar: user.avatar_url,
//         })
//       )}`
//     );
//   } catch {
//     res.status(500).send("GitHub auth failed");
//   }
// });

// /* ==================== ROAST + CODE IQ + TECH DEBT ==================== */
// app.post("/roast", async (req, res) => {
//   const { repoUrl } = req.body;
//   if (!repoUrl) return res.status(400).json({ error: "Repo URL required" });

//   try {
//     const clean = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
//     const [owner, repo] = clean.split("/");

//     /* ---------- Repo ---------- */
//     const repoRes = await fetch(
//       `https://api.github.com/repos/${owner}/${repo}`,
//       { headers: { "User-Agent": "RoastMyRepo" } }
//     );

//     if (!repoRes.ok) {
//       return res.status(404).json({ error: "Repo not found" });
//     }

//     const repoData = await repoRes.json();

//     /* ---------- Commits ---------- */
//     const commitsRes = await fetch(
//       `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
//       { headers: { "User-Agent": "RoastMyRepo" } }
//     );

//     const commits = await commitsRes.json();
//     const messages = commits.map((c) => c.commit.message.toLowerCase());

//     const crimePatterns = [
//       "final",
//       "final_final",
//       "fix",
//       "fixed",
//       "ok",
//       "update",
//       "temp",
//       "test",
//     ];

//     const crimeSet = new Set();
//     let crimeCount = 0;

//     messages.forEach((msg) => {
//       crimePatterns.forEach((p) => {
//         if (msg.includes(p)) {
//           crimeCount++;
//           crimeSet.add(p);
//         }
//       });
//     });

//     const commitGrade = gradeFromCrimes(crimeCount);

//     /* ---------- File Structure ---------- */
//     const contentsRes = await fetch(
//       `https://api.github.com/repos/${owner}/${repo}/contents`,
//       { headers: { "User-Agent": "RoastMyRepo" } }
//     );

//     const contents = contentsRes.ok ? await contentsRes.json() : [];

//     const hasReadme = contents.some((f) =>
//       f.name.toLowerCase().includes("readme")
//     );

//     const hasTests = contents.some((f) =>
//       f.name.toLowerCase().includes("test")
//     );

//     const hasCI = contents.some((f) =>
//       ["github", ".circleci"].some((k) => f.name.toLowerCase().includes(k))
//     );

//     /* ==================== CODE IQ ==================== */
//     let readability = 50 + (repoData.description ? 20 : 0) + (hasReadme ? 30 : 0);
//     let structure = 60 + (repoData.language ? 10 : 0) - (repoData.size > 50000 ? 15 : 0);
//     let commitsScore = clamp(100 - crimeCount * 6);
//     let documentation = (hasReadme ? 70 : 20) + (repoData.has_wiki ? 20 : 0);
//     let testReadiness = (hasTests ? 50 : 0) + (hasCI ? 30 : 0);

//     readability = clamp(readability);
//     structure = clamp(structure);
//     documentation = clamp(documentation);
//     testReadiness = clamp(testReadiness);

//     const finalIQ = Math.round(
//       readability * 0.2 +
//         structure * 0.2 +
//         commitsScore * 0.25 +
//         documentation * 0.2 +
//         testReadiness * 0.15
//     );

//     /* ==================== TECH DEBT ==================== */
//     const techDebt = await analyzeTechDebt(owner, repo);

//     /* ---------- AI Improvements ---------- */
//     const improvementRes = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a senior code reviewer. Give 3 concise improvement suggestions.",
//         },
//         {
//           role: "user",
//           content: `
// Readability: ${readability}
// Structure: ${structure}
// Commits: ${commitsScore}
// Documentation: ${documentation}
// Test Readiness: ${testReadiness}
// Tech Debt Score: ${techDebt?.score || "N/A"}
// `,
//         },
//       ],
//     });

//     /* ---------- Personality ---------- */
//     const personalityRes = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "user",
//           content: `
// Stars: ${repoData.stargazers_count}
// Issues: ${repoData.open_issues_count}
// Commit crimes: ${crimeCount}
// Language: ${repoData.language}

// Describe this repo's personality in ONE short phrase.
// `,
//         },
//       ],
//     });

//     /* ---------- Roast ---------- */
//     const roastRes = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a sarcastic senior software engineer. Roast the repo. Funny but not abusive.",
//         },
//         {
//           role: "user",
//           content: `
// Repo: ${repoData.full_name}
// Stars: ${repoData.stargazers_count}
// Issues: ${repoData.open_issues_count}
// Language: ${repoData.language}
// Commit crimes: ${crimeCount}
// Tech Debt: ${techDebt?.score || "Unknown"}/100

// Under 120 words. End with a witty verdict.
// `,
//         },
//       ],
//     });

//     /* ==================== RESPONSE ==================== */
//     res.json({
//       roast: roastRes.choices[0].message.content,
//       stats: {
//         name: repoData.full_name,
//         stars: repoData.stargazers_count,
//         forks: repoData.forks_count,
//         issues: repoData.open_issues_count,
//         language: repoData.language,
//       },
//       personality: personalityRes.choices[0].message.content,
//       commitCrimes: {
//         count: crimeCount,
//         grade: commitGrade,
//         crimes: Array.from(crimeSet),
//       },
//       codeIQ: {
//         readability,
//         structure,
//         commits: commitsScore,
//         documentation,
//         testReadiness,
//         final: finalIQ,
//       },
//       techDebt,
//       improvements: improvementRes.choices[0].message.content,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Roast failed" });
//   }
// });

// /* ==================== EXPLAIN ==================== */
// app.post("/explain", async (req, res) => {
//   const { repoUrl, role } = req.body;

//   const styles = {
//     hr: "Explain this repo to a non-technical HR recruiter.",
//     pm: "Explain this repo to a product manager focusing on value.",
//     junior: "Explain this repo simply to a junior developer.",
//   };

//   try {
//     const clean = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
//     const [owner, repo] = clean.split("/");

//     const repoRes = await fetch(
//       `https://api.github.com/repos/${owner}/${repo}`,
//       { headers: { "User-Agent": "RoastMyRepo" } }
//     );

//     const repoData = await repoRes.json();

//     const explainRes = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         { role: "system", content: styles[role] },
//         {
//           role: "user",
//           content: `
// Repo: ${repoData.full_name}
// Description: ${repoData.description}
// Language: ${repoData.language}
// Stars: ${repoData.stargazers_count}
// `,
//         },
//       ],
//     });

//     res.json({ explanation: explainRes.choices[0].message.content });
//   } catch {
//     res.status(500).json({ error: "Explain failed" });
//   }
// });

// /* ==================== SERVER ==================== */
// app.listen(5002, () =>
//   console.log("✅ Server running on http://localhost:5002")
// );

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
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
  const redirectUri = "http://localhost:5002/auth/github/callback";
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
      `http://localhost:5173?user=${encodeURIComponent(
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

/* ==================== SERVER ==================== */
app.listen(5002, () =>
  console.log("✅ Server running on http://localhost:5002")
);