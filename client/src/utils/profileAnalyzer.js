/**
 * GitHub Profile Analyzer
 * Analyzes user's GitHub profile to recommend roles and estimate salary
 */

export const analyzeGitHubProfile = async (username) => {
  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "User-Agent": "RoastMyRepo" },
    });

    if (!userRes.ok) {
      throw new Error("User not found");
    }

    const user = await userRes.json();

    // Fetch user's repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: { "User-Agent": "RoastMyRepo" } }
    );

    const repos = await reposRes.json();

    // Analyze profile
    const analysis = {
      // Basic stats
      totalRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      accountAge: calculateAccountAge(user.created_at),

      // Language analysis
      languages: {},
      topLanguages: [],

      // Activity metrics
      totalStars: 0,
      totalForks: 0,
      avgRepoSize: 0,
      hasReadme: 0,
      hasTests: 0,
      recentlyActive: false,

      // Project complexity
      complexProjects: 0,
      fullstackProjects: 0,
      aiMlProjects: 0,
      devopsProjects: 0,

      // Contribution quality
      consistentCommitter: false,
      collaborativeProjects: 0,
      originalProjects: 0,
    };

    // Analyze repositories
    for (const repo of repos) {
      if (repo.fork) continue;

      analysis.originalProjects++;
      analysis.totalStars += repo.stargazers_count;
      analysis.totalForks += repo.forks_count;
      analysis.avgRepoSize += repo.size;

      // Language tracking
      if (repo.language) {
        analysis.languages[repo.language] =
          (analysis.languages[repo.language] || 0) + 1;
      }

      // README presence
      if (repo.description || repo.has_wiki) {
        analysis.hasReadme++;
      }

      // Collaborative projects
      if (repo.forks_count > 0 || repo.stargazers_count > 5) {
        analysis.collaborativeProjects++;
      }

      // Complexity indicators
      if (repo.size > 5000 || repo.stargazers_count > 10) {
        analysis.complexProjects++;
      }

      // Check for specific tech stacks
      await detectTechStack(repo, analysis);
    }

    // Calculate averages
    analysis.avgRepoSize = Math.round(
      analysis.avgRepoSize / (analysis.originalProjects || 1)
    );

    // Get top 3 languages
    analysis.topLanguages = Object.entries(analysis.languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    // Check recent activity
    if (repos.length > 0) {
      const lastUpdate = new Date(repos[0].updated_at);
      const daysSinceUpdate = Math.floor(
        (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24)
      );
      analysis.recentlyActive = daysSinceUpdate < 30;
    }

    // Calculate experience level
    const experienceLevel = calculateExperienceLevel(analysis);

    // Recommend roles
    const roles = recommendRoles(analysis, experienceLevel);

    // Estimate salary
    const salary = estimateSalary(analysis, experienceLevel, roles);

    return {
      user: {
        name: user.name || user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        company: user.company,
      },
      analysis,
      experienceLevel,
      roles,
      salary,
    };
  } catch (err) {
    console.error("Profile analysis failed:", err);
    throw err;
  }
};

// Helper: Calculate account age in years
const calculateAccountAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24 * 365));
};

// Helper: Detect tech stack from repo
const detectTechStack = async (repo, analysis) => {
  // Check for fullstack indicators
  const fullstackKeywords = ["full-stack", "fullstack", "mern", "mean", "jamstack"];
  const repoText = `${repo.name} ${repo.description || ""}`.toLowerCase();

  if (fullstackKeywords.some((kw) => repoText.includes(kw))) {
    analysis.fullstackProjects++;
  }

  // Check for AI/ML
  const aiKeywords = ["ml", "ai", "machine-learning", "deep-learning", "neural", "tensorflow", "pytorch"];
  if (aiKeywords.some((kw) => repoText.includes(kw))) {
    analysis.aiMlProjects++;
  }

  // Check for DevOps
  const devopsKeywords = ["docker", "kubernetes", "ci-cd", "terraform", "ansible", "jenkins"];
  if (devopsKeywords.some((kw) => repoText.includes(kw))) {
    analysis.devopsProjects++;
  }
};

// Helper: Calculate experience level
const calculateExperienceLevel = (analysis) => {
  let score = 0;

  // Account age (0-25 points)
  if (analysis.accountAge >= 5) score += 25;
  else if (analysis.accountAge >= 3) score += 20;
  else if (analysis.accountAge >= 2) score += 15;
  else if (analysis.accountAge >= 1) score += 10;

  // Project count (0-20 points)
  if (analysis.originalProjects >= 20) score += 20;
  else if (analysis.originalProjects >= 10) score += 15;
  else if (analysis.originalProjects >= 5) score += 10;
  else if (analysis.originalProjects >= 2) score += 5;

  // Stars (0-15 points)
  if (analysis.totalStars >= 100) score += 15;
  else if (analysis.totalStars >= 50) score += 12;
  else if (analysis.totalStars >= 20) score += 8;
  else if (analysis.totalStars >= 5) score += 4;

  // Complex projects (0-15 points)
  if (analysis.complexProjects >= 5) score += 15;
  else if (analysis.complexProjects >= 3) score += 10;
  else if (analysis.complexProjects >= 1) score += 5;

  // Collaboration (0-10 points)
  if (analysis.collaborativeProjects >= 3) score += 10;
  else if (analysis.collaborativeProjects >= 1) score += 5;

  // Recent activity (0-10 points)
  if (analysis.recentlyActive) score += 10;

  // Documentation (0-5 points)
  const docRatio = analysis.hasReadme / (analysis.originalProjects || 1);
  if (docRatio >= 0.7) score += 5;
  else if (docRatio >= 0.4) score += 3;

  // Determine level
  if (score >= 80) return "Senior";
  if (score >= 60) return "Mid-Level";
  if (score >= 35) return "Junior";
  return "Entry-Level";
};

// Helper: Recommend roles
const recommendRoles = (analysis, experienceLevel) => {
  const roles = [];

  const langs = analysis.topLanguages.map((l) => l.toLowerCase());

  // Frontend roles
  if (
    langs.some((l) => ["javascript", "typescript"].includes(l)) ||
    analysis.languages["HTML"] ||
    analysis.languages["CSS"]
  ) {
    roles.push({
      title: "Frontend Developer",
      match: 90,
      reason: "Strong JavaScript/TypeScript presence",
    });

    if (experienceLevel === "Senior" || experienceLevel === "Mid-Level") {
      roles.push({
        title: "Frontend Architect",
        match: 75,
        reason: "Experience + frontend expertise",
      });
    }
  }

  // Backend roles
  if (
    langs.some((l) => ["python", "java", "go", "ruby", "php", "c#"].includes(l))
  ) {
    roles.push({
      title: "Backend Developer",
      match: 85,
      reason: "Backend language expertise",
    });
  }

  // Fullstack roles
  if (analysis.fullstackProjects > 0 || langs.length >= 2) {
    roles.push({
      title: "Full Stack Developer",
      match: 80,
      reason: "Multi-language projects",
    });
  }

  // AI/ML roles
  if (analysis.aiMlProjects > 0 || langs.includes("python")) {
    roles.push({
      title: "ML Engineer",
      match: analysis.aiMlProjects > 2 ? 85 : 60,
      reason: "Python + ML projects",
    });
  }

  // DevOps roles
  if (analysis.devopsProjects > 0) {
    roles.push({
      title: "DevOps Engineer",
      match: 70,
      reason: "Infrastructure projects",
    });
  }

  // Mobile roles
  if (langs.includes("swift") || langs.includes("kotlin")) {
    roles.push({
      title: "Mobile Developer",
      match: 80,
      reason: "Native mobile development",
    });
  }

  // Data roles
  if (langs.includes("python") || langs.includes("r")) {
    roles.push({
      title: "Data Analyst",
      match: 65,
      reason: "Data analysis languages",
    });
  }

  // Sort by match score
  return roles.sort((a, b) => b.match - a.match).slice(0, 5);
};

// Helper: Estimate salary
const estimateSalary = (analysis, experienceLevel, roles) => {
  // Base salary by experience level (USD, India adjusted)
  const baseSalaries = {
    "Entry-Level": { min: 3, max: 6, currency: "LPA" }, // Lakhs Per Annum
    Junior: { min: 6, max: 12, currency: "LPA" },
    "Mid-Level": { min: 12, max: 25, currency: "LPA" },
    Senior: { min: 25, max: 50, currency: "LPA" },
  };

  let salary = baseSalaries[experienceLevel] || baseSalaries["Entry-Level"];

  // Adjust for top roles
  if (roles.length > 0) {
    const topRole = roles[0].title;

    const roleMultipliers = {
      "ML Engineer": 1.3,
      "DevOps Engineer": 1.2,
      "Full Stack Developer": 1.15,
      "Frontend Architect": 1.25,
      "Backend Developer": 1.1,
    };

    const multiplier = roleMultipliers[topRole] || 1;
    salary.min = Math.round(salary.min * multiplier);
    salary.max = Math.round(salary.max * multiplier);
  }

  // Adjust for star count (popular projects)
  if (analysis.totalStars > 100) {
    salary.min = Math.round(salary.min * 1.2);
    salary.max = Math.round(salary.max * 1.2);
  } else if (analysis.totalStars > 50) {
    salary.min = Math.round(salary.min * 1.1);
    salary.max = Math.round(salary.max * 1.1);
  }

  return salary;
};