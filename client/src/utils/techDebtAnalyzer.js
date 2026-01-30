/**
 * Tech Debt Analyzer
 * Analyzes code quality metrics to calculate tech debt
 */

export const analyzeTechDebt = async (owner, repo) => {
  try {
    // Fetch repository contents
    const contentsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    if (!contentsRes.ok) {
      return null;
    }

    const contents = await contentsRes.json();

    // Recursively fetch all files (limited depth for performance)
    const files = await fetchFilesRecursively(owner, repo, "", 2);

    // Calculate metrics
    const metrics = {
      todoCount: 0,
      commentLines: 0,
      codeLines: 0,
      longFiles: 0,
      totalFiles: 0,
      avgFileLength: 0,
      duplicateNames: 0,
    };

    const fileNames = new Set();
    const fileNamesCount = {};

    for (const file of files) {
      if (file.type !== "file") continue;
      if (!isCodeFile(file.name)) continue;

      metrics.totalFiles++;

      // Track duplicate names
      const baseName = file.name.toLowerCase();
      fileNamesCount[baseName] = (fileNamesCount[baseName] || 0) + 1;

      // Fetch file content
      try {
        const fileRes = await fetch(file.download_url);
        const content = await fileRes.text();

        const lines = content.split("\n");
        metrics.avgFileLength += lines.length;

        if (lines.length > 500) {
          metrics.longFiles++;
        }

        // Count TODOs
        metrics.todoCount += countTODOs(content);

        // Count comments vs code
        const { comments, code } = analyzeCommentRatio(content, file.name);
        metrics.commentLines += comments;
        metrics.codeLines += code;
      } catch (err) {
        // Skip files that can't be fetched
        continue;
      }
    }

    // Count duplicate file names
    metrics.duplicateNames = Object.values(fileNamesCount).filter(
      (count) => count > 1
    ).length;

    metrics.avgFileLength = Math.round(
      metrics.avgFileLength / (metrics.totalFiles || 1)
    );

    // Calculate tech debt score (0-100, higher is worse)
    const techDebtScore = calculateTechDebtScore(metrics);

    return {
      score: techDebtScore,
      metrics,
      grade: getTechDebtGrade(techDebtScore),
    };
  } catch (err) {
    console.error("Tech debt analysis failed:", err);
    return null;
  }
};

// Helper: Fetch files recursively
const fetchFilesRecursively = async (owner, repo, path, maxDepth, currentDepth = 0) => {
  if (currentDepth >= maxDepth) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    if (!res.ok) return [];

    const items = await res.json();
    let allFiles = [];

    for (const item of items) {
      if (item.type === "file") {
        allFiles.push(item);
      } else if (item.type === "dir" && !shouldSkipDir(item.name)) {
        const subFiles = await fetchFilesRecursively(
          owner,
          repo,
          item.path,
          maxDepth,
          currentDepth + 1
        );
        allFiles = allFiles.concat(subFiles);
      }
    }

    return allFiles;
  } catch {
    return [];
  }
};

// Helper: Check if directory should be skipped
const shouldSkipDir = (name) => {
  const skipDirs = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "vendor",
    "__pycache__",
  ];
  return skipDirs.includes(name.toLowerCase());
};

// Helper: Check if file is a code file
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
    ".cs",
    ".swift",
  ];

  return codeExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

// Helper: Count TODOs in content
const countTODOs = (content) => {
  const patterns = [/TODO/gi, /FIXME/gi, /HACK/gi, /XXX/gi];
  let count = 0;

  patterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) count += matches.length;
  });

  return count;
};

// Helper: Analyze comment to code ratio
const analyzeCommentRatio = (content, filename) => {
  const lines = content.split("\n");
  let comments = 0;
  let code = 0;

  const ext = filename.split(".").pop().toLowerCase();
  const isCStyle = ["js", "jsx", "ts", "tsx", "java", "c", "cpp", "go", "cs"].includes(ext);
  const isPython = ext === "py";

  let inBlockComment = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === "") return;

    // C-style comments
    if (isCStyle) {
      if (trimmed.startsWith("/*")) inBlockComment = true;
      if (inBlockComment) {
        comments++;
        if (trimmed.endsWith("*/")) inBlockComment = false;
        return;
      }
      if (trimmed.startsWith("//")) {
        comments++;
        return;
      }
    }

    // Python comments
    if (isPython) {
      if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        comments++;
        return;
      }
      if (trimmed.startsWith("#")) {
        comments++;
        return;
      }
    }

    code++;
  });

  return { comments, code };
};

// Helper: Calculate tech debt score
const calculateTechDebtScore = (metrics) => {
  let score = 0;

  // TODO density (0-30 points)
  const todoDensity = metrics.todoCount / (metrics.totalFiles || 1);
  if (todoDensity > 5) score += 30;
  else if (todoDensity > 3) score += 20;
  else if (todoDensity > 1) score += 10;

  // Comment ratio (0-25 points)
  const commentRatio = metrics.commentLines / (metrics.codeLines || 1);
  if (commentRatio < 0.05) score += 25; // Too few comments
  else if (commentRatio > 0.4) score += 15; // Too many comments
  else if (commentRatio >= 0.1 && commentRatio <= 0.3) score += 0; // Good balance

  // Long files (0-25 points)
  const longFileRatio = metrics.longFiles / (metrics.totalFiles || 1);
  if (longFileRatio > 0.5) score += 25;
  else if (longFileRatio > 0.3) score += 15;
  else if (longFileRatio > 0.1) score += 5;

  // Average file length (0-10 points)
  if (metrics.avgFileLength > 600) score += 10;
  else if (metrics.avgFileLength > 400) score += 5;

  // Duplicate names (0-10 points)
  if (metrics.duplicateNames > 5) score += 10;
  else if (metrics.duplicateNames > 2) score += 5;

  return Math.min(100, score);
};

// Helper: Get tech debt grade
const getTechDebtGrade = (score) => {
  if (score <= 20) return "A";
  if (score <= 40) return "B";
  if (score <= 60) return "C";
  if (score <= 80) return "D";
  return "F";
};

export { getTechDebtGrade };