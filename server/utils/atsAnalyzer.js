// ATS Resume Analyzer
// Analyzes resume content for ATS compatibility

export function analyzeATSScore(resumeText, jobDescription = '') {
  // Calculate all metrics
  const keywords = extractKeywords(resumeText, jobDescription);
  const formatting = checkFormatting(resumeText);
  const sections = checkSections(resumeText);
  const experience = analyzeExperience(resumeText);
  const skills = analyzeSkills(resumeText);
  
  // Calculate breakdown scores
  const breakdown = {
    keywords: keywords.score,
    formatting: formatting.score,
    sections: sections.score,
    experience: experience.score,
    skills: skills.score
  };
  
  // Overall ATS score (weighted average)
  const atsScore = Math.round(
    (keywords.score * 0.30) +      // 30% - Most important
    (formatting.score * 0.20) +     // 20%
    (sections.score * 0.20) +       // 20%
    (experience.score * 0.15) +     // 15%
    (skills.score * 0.15)           // 15%
  );
  
  // Issues and improvements
  const issues = [
    ...keywords.issues,
    ...formatting.issues,
    ...sections.issues,
    ...experience.issues,
    ...skills.issues
  ];
  
  const improvements = generateImprovements(breakdown, keywords, formatting, sections, experience, skills);
  const avoid = getCommonMistakes();
  const grade = getGrade(atsScore);
  
  return {
    atsScore,
    breakdown,
    keywords: {
      found: keywords.found,
      missing: keywords.missing
    },
    issues,
    improvements,
    avoid,
    grade
  };
}

// Extract and match keywords
function extractKeywords(resumeText, jobDescription) {
  const text = resumeText.toLowerCase();
  
  // Common ATS keywords by category
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'rest api',
    'mongodb', 'typescript', 'express', 'html', 'css', 'tailwind'
  ];
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'analytical', 'organized', 'detail-oriented', 'collaborative'
  ];
  
  const actionVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented',
    'managed', 'led', 'improved', 'optimized', 'achieved'
  ];
  
  let found = [];
  let missing = [];
  let jdKeywords = [];
  
  // If JD provided, extract keywords from it
  if (jobDescription) {
    const jdText = jobDescription.toLowerCase();
    jdKeywords = extractJDKeywords(jdText);
    
    // Check which JD keywords are in resume
    jdKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });
  } else {
    // General keyword check
    [...technicalSkills, ...softSkills, ...actionVerbs].forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    });
    
    // Missing: suggest important ones they don't have
    if (!text.includes('github') && !text.includes('git')) {
      missing.push('Git/GitHub');
    }
    if (!text.includes('agile') && !text.includes('scrum')) {
      missing.push('Agile methodologies');
    }
  }
  
  // Calculate score
  let score = 0;
  if (jobDescription) {
    // JD-based scoring
    const matchRate = found.length / Math.max(jdKeywords.length, 1);
    score = Math.round(matchRate * 100);
  } else {
    // General scoring
    score = Math.min(found.length * 5, 100);
  }
  
  const issues = [];
  if (score < 60) {
    issues.push({
      severity: 'critical',
      title: 'Low Keyword Match',
      description: 'Your resume lacks important keywords that ATS systems look for'
    });
  }
  
  return { score, found, missing, issues };
}

// Extract keywords from job description
function extractJDKeywords(jdText) {
  const keywords = [];
  
  // Common technical terms
  const techPattern = /\b(javascript|python|java|react|node\.?js|sql|aws|docker|kubernetes|git|agile|typescript|mongodb|express|api|html|css|tailwind|vue|angular|c\+\+|c#|ruby|php|swift|kotlin|flutter|react native)\b/gi;
  const techMatches = jdText.match(techPattern) || [];
  keywords.push(...new Set(techMatches.map(k => k.toLowerCase())));
  
  // Common skills
  const skillsPattern = /\b(leadership|communication|teamwork|problem[ -]solving|analytical|organized|detail[ -]oriented|collaborative|creative|innovative)\b/gi;
  const skillsMatches = jdText.match(skillsPattern) || [];
  keywords.push(...new Set(skillsMatches.map(k => k.toLowerCase())));
  
  // Requirements
  const reqPattern = /\b(bachelor|master|degree|years? of experience|certified|certification)\b/gi;
  const reqMatches = jdText.match(reqPattern) || [];
  keywords.push(...new Set(reqMatches.map(k => k.toLowerCase())));
  
  return [...new Set(keywords)]; // Remove duplicates
}

// Check formatting
function checkFormatting(text) {
  let score = 100;
  const issues = [];
  
  // Check for special characters that confuse ATS
  const specialChars = /[★☆●○■□▪▫•◦‣⁃]/g;
  if (specialChars.test(text)) {
    score -= 15;
    issues.push({
      severity: 'warning',
      title: 'Special Characters Detected',
      description: 'Unusual bullets or symbols may not be parsed correctly by ATS'
    });
  }
  
  // Check for tables (hard for ATS)
  if (text.includes('|') || text.match(/\t.*\t/)) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: 'Table Formatting Detected',
      description: 'Tables may not be read correctly by all ATS systems'
    });
  }
  
  // Check for images/graphics
  if (text.includes('[image]') || text.includes('[graphic]')) {
    score -= 20;
    issues.push({
      severity: 'critical',
      title: 'Images Detected',
      description: 'ATS cannot read text in images - use plain text instead'
    });
  }
  
  // Check for headers/footers issues
  if (text.split('\n')[0].length < 10) {
    score -= 5;
  }
  
  return { score: Math.max(score, 0), issues };
}

// Check for essential sections
function checkSections(text) {
  let score = 0;
  const issues = [];
  const lowerText = text.toLowerCase();
  
  // Essential sections
  const sections = {
    contact: /\b(email|phone|linkedin|github)\b/i,
    experience: /\b(experience|work history|employment)\b/i,
    education: /\b(education|degree|university|college)\b/i,
    skills: /\b(skills|technical skills|technologies)\b/i,
  };
  
  // Optional but recommended
  const optionalSections = {
    summary: /\b(summary|profile|objective)\b/i,
    projects: /\b(projects|portfolio)\b/i,
    certifications: /\b(certifications|certificates)\b/i,
  };
  
  // Check essential sections
  Object.entries(sections).forEach(([name, pattern]) => {
    if (pattern.test(lowerText)) {
      score += 20; // 20 points each for 4 sections = 80
    } else {
      issues.push({
        severity: 'critical',
        title: `Missing ${name.charAt(0).toUpperCase() + name.slice(1)} Section`,
        description: `Add a dedicated ${name} section to your resume`
      });
    }
  });
  
  // Check optional sections
  Object.entries(optionalSections).forEach(([name, pattern]) => {
    if (pattern.test(lowerText)) {
      score += 7; // Bonus points
    }
  });
  
  return { score: Math.min(score, 100), issues };
}

// Analyze experience section
function analyzeExperience(text) {
  let score = 50; // Base score
  const issues = [];
  const lowerText = text.toLowerCase();
  
  // Check for action verbs
  const actionVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented',
    'managed', 'led', 'improved', 'optimized', 'achieved',
    'increased', 'reduced', 'established', 'launched'
  ];
  
  let actionVerbCount = 0;
  actionVerbs.forEach(verb => {
    const matches = lowerText.match(new RegExp(`\\b${verb}\\b`, 'gi'));
    if (matches) actionVerbCount += matches.length;
  });
  
  if (actionVerbCount >= 5) {
    score += 30;
  } else if (actionVerbCount >= 3) {
    score += 20;
  } else {
    score += 10;
    issues.push({
      severity: 'warning',
      title: 'Few Action Verbs',
      description: 'Use more action verbs (developed, built, led, etc.) to describe achievements'
    });
  }
  
  // Check for metrics/numbers
  const numbers = text.match(/\d+%|\d+\+|\$\d+|\d+ (users|customers|clients|projects)/gi);
  if (numbers && numbers.length >= 3) {
    score += 20;
  } else if (numbers && numbers.length >= 1) {
    score += 10;
  } else {
    issues.push({
      severity: 'warning',
      title: 'No Quantifiable Achievements',
      description: 'Add numbers and metrics (e.g., "Improved performance by 40%")'
    });
  }
  
  return { score: Math.min(score, 100), issues };
}

// Analyze skills section
function analyzeSkills(text) {
  let score = 50;
  const issues = [];
  const lowerText = text.toLowerCase();
  
  // Count technical skills
  const techSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql',
    'git', 'docker', 'aws', 'mongodb', 'typescript', 'html', 'css'
  ];
  
  let skillCount = 0;
  techSkills.forEach(skill => {
    if (lowerText.includes(skill)) skillCount++;
  });
  
  if (skillCount >= 8) {
    score += 50;
  } else if (skillCount >= 5) {
    score += 30;
  } else if (skillCount >= 3) {
    score += 20;
  } else {
    score += 10;
    issues.push({
      severity: 'critical',
      title: 'Too Few Technical Skills',
      description: 'List at least 5-10 relevant technical skills'
    });
  }
  
  return { score: Math.min(score, 100), issues };
}

// Generate improvement recommendations
function generateImprovements(breakdown, keywords, formatting, sections, experience, skills) {
  const improvements = [];
  
  // Keywords
  if (breakdown.keywords < 70) {
    improvements.push({
      priority: 'high',
      title: 'Add More Relevant Keywords',
      description: 'Incorporate industry-specific keywords and skills from the job description',
      impact: '+30 points',
      tips: [
        'Mirror language from the job description',
        'Include technical skills prominently',
        'Add industry buzzwords naturally',
        'Don\'t keyword stuff - keep it natural'
      ]
    });
  }
  
  // Missing keywords from JD
  if (keywords.missing.length > 0) {
    improvements.push({
      priority: 'high',
      title: `Add Missing Keywords (${keywords.missing.length} found)`,
      description: 'Your resume is missing important keywords from the job description',
      impact: `+${keywords.missing.length * 5} points`,
      tips: keywords.missing.slice(0, 5).map(k => `Add "${k}" if you have this skill`)
    });
  }
  
  // Formatting
  if (breakdown.formatting < 80) {
    improvements.push({
      priority: 'medium',
      title: 'Improve ATS-Friendly Formatting',
      description: 'Use simple, clean formatting that ATS can parse easily',
      impact: '+20 points',
      tips: [
        'Use standard section headers (Experience, Education, Skills)',
        'Avoid tables, text boxes, and columns',
        'Remove special characters and unusual fonts',
        'Use simple bullet points (• or -)',
        'Save as .docx or PDF (text-based)'
      ]
    });
  }
  
  // Sections
  if (breakdown.sections < 80) {
    improvements.push({
      priority: 'high',
      title: 'Add Missing Sections',
      description: 'Essential sections are missing from your resume',
      impact: '+20 points',
      tips: sections.issues.map(i => i.description)
    });
  }
  
  // Experience
  if (breakdown.experience < 70) {
    improvements.push({
      priority: 'medium',
      title: 'Strengthen Experience Descriptions',
      description: 'Make your experience more impactful with action verbs and metrics',
      impact: '+15 points',
      tips: [
        'Start each bullet with an action verb (Built, Developed, Led)',
        'Add quantifiable achievements (Increased X by 40%)',
        'Show impact, not just responsibilities',
        'Keep bullets concise (1-2 lines max)'
      ]
    });
  }
  
  // Skills
  if (breakdown.skills < 70) {
    improvements.push({
      priority: 'medium',
      title: 'Expand Technical Skills',
      description: 'List more relevant technical skills and technologies',
      impact: '+15 points',
      tips: [
        'Add programming languages you know',
        'Include frameworks and libraries',
        'List tools and platforms (Git, Docker, AWS)',
        'Organize by category (Languages, Frameworks, Tools)',
        'Aim for 8-12 technical skills minimum'
      ]
    });
  }
  
  // General improvements
  if (breakdown.keywords >= 70 && breakdown.formatting >= 80) {
    improvements.push({
      priority: 'low',
      title: 'Fine-Tune for Specific Roles',
      description: 'Your resume is already strong - customize for each application',
      impact: '+5-10 points',
      tips: [
        'Tailor keywords for each job application',
        'Highlight relevant experience first',
        'Adjust skill priorities based on JD',
        'Add role-specific achievements'
      ]
    });
  }
  
  return improvements.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}

// Common mistakes to avoid
function getCommonMistakes() {
  return [
    'Using images, charts, or graphics',
    'Complex tables or columns',
    'Unusual fonts or special characters',
    'Spelling or grammar errors',
    'Missing contact information',
    'Using headers/footers for important info',
    'Over-designed templates',
    'Inconsistent formatting',
    'Keyword stuffing',
    'Generic objective statements',
    'Missing LinkedIn/GitHub links',
    'Unprofessional email addresses'
  ];
}

// Get grade based on score
function getGrade(score) {
  if (score >= 90) return { grade: 'A+', color: 'green', label: 'Excellent - ATS Ready' };
  if (score >= 80) return { grade: 'A', color: 'green', label: 'Very Good - Highly Compatible' };
  if (score >= 70) return { grade: 'B', color: 'blue', label: 'Good - Should Pass Most ATS' };
  if (score >= 60) return { grade: 'C', color: 'yellow', label: 'Fair - Needs Improvement' };
  if (score >= 50) return { grade: 'D', color: 'orange', label: 'Poor - Major Issues' };
  return { grade: 'F', color: 'red', label: 'Failing - Won\'t Pass ATS' };
}