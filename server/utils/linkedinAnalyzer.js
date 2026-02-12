// LinkedIn Profile Analyzer - Manual Input Version
// No scraping - user provides data via form

export function analyzeLinkedInProfile(profileData) {
  // Calculate all metrics
  const completeness = calculateCompleteness(profileData);
  const strength = calculateStrength(profileData);
  const missingSections = findMissingSections(profileData);
  const headlineScore = analyzeHeadline(profileData.headline);
  const networkHealth = analyzeNetwork(profileData.connections);
  const jobReadiness = calculateJobReadiness(profileData);
  const recommendations = generateRecommendations(profileData);
  const grade = getGrade(completeness);
  
  return {
    completeness,
    strength,
    missingSections,
    headlineScore,
    networkHealth,
    jobReadiness,
    recommendations,
    grade
  };
}

// Calculate profile completeness (0-100)
function calculateCompleteness(data) {
  let score = 0;
  
  // Profile Photo (10 points)
  if (data.hasPhoto) score += 10;
  
  // Headline (10 points)
  if (data.headline && data.headline.length >= 20) score += 10;
  
  // Summary (15 points)
  if (data.summaryLength >= 100) score += 15;
  
  // Experience (20 points)
  if (data.experienceCount > 0) {
    score += Math.min(data.experienceCount * 10, 20);
  }
  
  // Education (15 points)
  if (data.educationCount > 0) {
    score += Math.min(data.educationCount * 8, 15);
  }
  
  // Skills (10 points)
  if (data.skillsCount >= 3) {
    score += Math.min(data.skillsCount * 2, 10);
  }
  
  // Recommendations (10 points)
  if (data.hasRecommendations) score += 10;
  
  // Certifications (5 points)
  if (data.hasCertifications) score += 5;
  
  // Projects (5 points)
  if (data.hasProjects) score += 5;
  
  return Math.min(score, 100);
}

// Calculate strength breakdown
function calculateStrength(data) {
  return {
    profilePhoto: data.hasPhoto ? 100 : 0,
    headline: analyzeHeadlineStrength(data.headline),
    summary: data.summaryLength >= 100 ? 
      Math.min((data.summaryLength / 1000) * 100, 100) : 
      (data.summaryLength / 100) * 100,
    experience: Math.min(data.experienceCount * 33, 100),
    education: Math.min(data.educationCount * 50, 100),
    skills: Math.min(data.skillsCount * 10, 100)
  };
}

// Analyze headline quality
function analyzeHeadline(headline) {
  let score = 0;
  let feedback = [];
  
  if (!headline || headline.trim() === '') {
    return { 
      score: 0, 
      feedback: ['Missing headline - add one immediately!'],
      example: 'Software Engineer | React.js, Node.js | Building scalable web apps'
    };
  }
  
  // Length check (20-120 characters)
  if (headline.length >= 20 && headline.length <= 120) {
    score += 30;
  } else if (headline.length < 20) {
    feedback.push('Headline too short (aim for 20-120 characters)');
  } else {
    feedback.push('Headline too long (aim for 20-120 characters)');
  }
  
  // Contains role keywords
  const roleKeywords = [
    'developer', 'engineer', 'designer', 'manager', 'analyst',
    'specialist', 'consultant', 'architect', 'lead', 'senior'
  ];
  const hasRole = roleKeywords.some(kw => 
    headline.toLowerCase().includes(kw)
  );
  if (hasRole) {
    score += 25;
  } else {
    feedback.push('Add your role/title (e.g., Software Engineer, Data Analyst)');
  }
  
  // Contains value/action words
  const valueWords = [
    'passionate', 'experienced', 'expert', 'skilled', 'certified',
    'helping', 'building', 'creating', 'leading', 'developing'
  ];
  const hasValue = valueWords.some(word => 
    headline.toLowerCase().includes(word)
  );
  if (hasValue) {
    score += 25;
  } else {
    feedback.push('Add value words (e.g., "Passionate about...", "Building...")');
  }
  
  // Uses separators (| or •)
  if (headline.includes('|') || headline.includes('•')) {
    score += 10;
  } else {
    feedback.push('Use separators (|) to structure your headline');
  }
  
  // Not too generic
  const genericTerms = ['student', 'fresher', 'graduate', 'looking for'];
  const isGeneric = genericTerms.some(term => 
    headline.toLowerCase().includes(term)
  );
  if (!isGeneric) {
    score += 10;
  } else {
    feedback.push('Avoid generic terms - be specific about your expertise');
  }
  
  // Generate example
  let example = generateHeadlineExample(headline);
  
  if (feedback.length === 0) {
    feedback.push('Excellent headline! ✨');
  }
  
  return {
    score: Math.min(score, 100),
    feedback,
    example
  };
}

function analyzeHeadlineStrength(headline) {
  if (!headline) return 0;
  if (headline.length < 20) return 30;
  if (headline.length > 120) return 50;
  
  let score = 70;
  
  // Bonus for role keywords
  const keywords = ['developer', 'engineer', 'designer', 'manager'];
  if (keywords.some(kw => headline.toLowerCase().includes(kw))) {
    score += 15;
  }
  
  // Bonus for structure (separators)
  if (headline.includes('|') || headline.includes('•')) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

// Find missing sections
function findMissingSections(data) {
  const missing = [];
  
  if (!data.hasPhoto) missing.push('Profile Photo');
  if (!data.headline || data.headline.trim() === '') missing.push('Headline');
  if (data.summaryLength < 100) missing.push('Complete Summary (at least 100 characters)');
  if (data.experienceCount === 0) missing.push('Work Experience');
  if (data.educationCount === 0) missing.push('Education');
  if (data.skillsCount < 3) missing.push('Skills (add at least 3)');
  if (!data.hasRecommendations) missing.push('Recommendations');
  if (!data.hasCertifications) missing.push('Certifications');
  if (!data.hasProjects) missing.push('Projects');
  
  return missing;
}

// Analyze network health
function analyzeNetwork(connections) {
  let score = 0;
  let status = '';
  let advice = '';
  
  if (connections >= 500) {
    score = 100;
    status = 'Excellent Network (500+)';
    advice = 'Great! Keep engaging with your connections regularly.';
  } else if (connections >= 300) {
    score = 80;
    status = 'Strong Network (300-500)';
    advice = 'Almost at 500+! Connect with alumni and industry professionals.';
  } else if (connections >= 150) {
    score = 60;
    status = 'Growing Network (150-300)';
    advice = 'Good progress! Aim for 300+ by connecting with colleagues and peers.';
  } else if (connections >= 50) {
    score = 40;
    status = 'Building Network (50-150)';
    advice = 'Keep building! Connect with classmates, professors, and professionals.';
  } else {
    score = 20;
    status = 'Small Network (<50)';
    advice = 'Start growing your network! Aim for 50+ connections this month.';
  }
  
  return { score, connections, status, advice };
}

// Calculate job readiness
function calculateJobReadiness(data) {
  let score = 0;
  
  // Profile completeness (40%)
  const completeness = calculateCompleteness(data);
  score += (completeness * 0.4);
  
  // Experience (30%)
  if (data.experienceCount >= 3) {
    score += 30;
  } else if (data.experienceCount >= 2) {
    score += 20;
  } else if (data.experienceCount === 1) {
    score += 10;
  }
  
  // Skills (15%)
  if (data.skillsCount >= 10) {
    score += 15;
  } else if (data.skillsCount >= 5) {
    score += 10;
  } else if (data.skillsCount >= 3) {
    score += 5;
  }
  
  // Recommendations (10%)
  if (data.hasRecommendations) score += 10;
  
  // Network (5%)
  if (data.connections >= 150) {
    score += 5;
  } else if (data.connections >= 50) {
    score += 3;
  }
  
  let readiness = 'Not Ready';
  if (score >= 80) readiness = 'Highly Ready';
  else if (score >= 60) readiness = 'Ready';
  else if (score >= 40) readiness = 'Nearly Ready';
  else if (score >= 20) readiness = 'Building';
  
  return {
    score: Math.round(score),
    status: readiness,
    canApply: score >= 60
  };
}

// Generate personalized recommendations
function generateRecommendations(data) {
  const tips = [];
  
  // Photo - Critical
  if (!data.hasPhoto) {
    tips.push({
      priority: 'Critical',
      action: 'Add Professional Photo',
      reason: 'Profiles with photos get 21x more profile views',
      impact: '+10 points',
      tips: [
        'Use a professional headshot',
        'Smile and make eye contact',
        'Plain background works best',
        'Dress professionally'
      ]
    });
  }
  
  // Headline - High priority
  const headlineAnalysis = analyzeHeadline(data.headline);
  if (headlineAnalysis.score < 70) {
    tips.push({
      priority: 'High',
      action: 'Improve Headline',
      reason: 'First impression for recruiters and most important for search',
      impact: '+10 points',
      example: headlineAnalysis.example,
      tips: headlineAnalysis.feedback
    });
  }
  
  // Summary - High priority
  if (data.summaryLength < 100) {
    tips.push({
      priority: 'High',
      action: 'Write Compelling Summary',
      reason: 'Tells your story and value proposition',
      impact: '+15 points',
      tips: [
        'Start with who you are professionally',
        'Mention 3-5 key skills and technologies',
        'Include notable achievements or projects',
        'Add what you\'re looking for or passionate about',
        'Aim for 200-500 characters'
      ]
    });
  }
  
  // Experience - High priority
  if (data.experienceCount < 2) {
    tips.push({
      priority: 'High',
      action: 'Add More Experience',
      reason: 'Shows career progression and practical skills',
      impact: '+20 points',
      tips: [
        'Include all internships (even short ones)',
        'Add freelance or contract work',
        'List significant college projects as experience',
        'Include volunteer technical work',
        'Use bullet points with achievements, not just duties'
      ]
    });
  }
  
  // Skills - Medium priority
  if (data.skillsCount < 5) {
    tips.push({
      priority: 'Medium',
      action: 'Add More Skills',
      reason: 'Improves searchability by recruiters',
      impact: '+10 points',
      tips: [
        'Add 10-15 technical skills',
        'Include programming languages',
        'List frameworks and tools',
        'Add soft skills (Leadership, Communication)',
        'Get endorsements from connections'
      ]
    });
  }
  
  // Recommendations - Medium priority
  if (!data.hasRecommendations) {
    tips.push({
      priority: 'Medium',
      action: 'Request Recommendations',
      reason: 'Builds credibility and trust',
      impact: '+10 points',
      tips: [
        'Ask professors who know your work',
        'Request from internship managers',
        'Ask project teammates or mentors',
        'Be specific: "Could you write about my React skills?"',
        'Offer to write one in return'
      ]
    });
  }
  
  // Projects - Medium priority
  if (!data.hasProjects) {
    tips.push({
      priority: 'Medium',
      action: 'Showcase Projects',
      reason: 'Demonstrates practical skills to employers',
      impact: '+5 points',
      tips: [
        'Add final year project with details',
        'Include GitHub repository links',
        'Mention technologies used',
        'Add live demo links if available',
        'Explain your role and impact'
      ]
    });
  }
  
  // Certifications - Low priority
  if (!data.hasCertifications) {
    tips.push({
      priority: 'Low',
      action: 'Add Certifications',
      reason: 'Shows continuous learning and expertise',
      impact: '+5 points',
      tips: [
        'AWS or Azure cloud certifications',
        'Google Developer certifications',
        'Coursera or Udemy certificates',
        'Industry-specific certifications',
        'Only add completed ones with credentials'
      ]
    });
  }
  
  // Network - Low priority
  if (data.connections < 100) {
    tips.push({
      priority: 'Low',
      action: 'Grow Your Network',
      reason: 'Increases profile visibility',
      impact: 'Indirect (better reach)',
      tips: [
        'Connect with all classmates and batchmates',
        'Add professors and teaching assistants',
        'Connect with college alumni',
        'Join industry groups and engage',
        'Personalize connection requests'
      ]
    });
  }
  
  return tips.sort((a, b) => {
    const priority = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    return priority[a.priority] - priority[b.priority];
  });
}

// Get grade based on score
function getGrade(score) {
  if (score >= 90) return { grade: 'A+', color: 'green', label: 'Outstanding Profile' };
  if (score >= 80) return { grade: 'A', color: 'green', label: 'Excellent Profile' };
  if (score >= 70) return { grade: 'B', color: 'blue', label: 'Good Profile' };
  if (score >= 60) return { grade: 'C', color: 'yellow', label: 'Fair Profile' };
  if (score >= 50) return { grade: 'D', color: 'orange', label: 'Needs Improvement' };
  return { grade: 'F', color: 'red', label: 'Incomplete Profile' };
}

// Generate headline example
function generateHeadlineExample(current) {
  if (!current || current.trim() === '') {
    return 'Software Engineer | React.js, Node.js, MongoDB | Building scalable web applications';
  }
  
  // If already has good structure, return it
  if (current.length >= 50 && current.includes('|')) {
    return current;
  }
  
  // Extract role if present
  const roles = {
    'developer': 'Software Developer',
    'engineer': 'Software Engineer',
    'designer': 'UI/UX Designer',
    'analyst': 'Data Analyst',
    'manager': 'Product Manager'
  };
  
  for (const [keyword, title] of Object.entries(roles)) {
    if (current.toLowerCase().includes(keyword)) {
      return `${title} | React.js, Node.js, Python | Passionate about building innovative solutions`;
    }
  }
  
  // Default example
  return 'Software Engineer | React.js, Node.js, MongoDB | Building scalable web applications';
}