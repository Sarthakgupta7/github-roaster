/**
 * Premium Share Card Generator
 * Creates viral-worthy images for social media
 */

export const generatePremiumRoastCard = (data) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630; // Optimal for social media
  const ctx = canvas.getContext("2d");

  // Background Gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#0a0a0a");
  gradient.addColorStop(0.5, "#1a1a1a");
  gradient.addColorStop(1, "#0f0f0f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Add Noise Texture
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
    ctx.fillRect(
      Math.random() * 1200,
      Math.random() * 630,
      1,
      1
    );
  }

  // Accent Glow (Top Right)
  const glowGradient = ctx.createRadialGradient(1000, 100, 0, 1000, 100, 400);
  glowGradient.addColorStop(0, "rgba(239, 68, 68, 0.3)");
  glowGradient.addColorStop(1, "rgba(239, 68, 68, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Header Section
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("🔥 RoastMyRepo", 60, 90);

  // Repo Name
  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const repoName = data.stats?.name || "Unknown Repo";
  ctx.fillText(repoName.length > 40 ? repoName.slice(0, 40) + "..." : repoName, 60, 140);

  // Divider Line
  const lineGradient = ctx.createLinearGradient(60, 170, 1140, 170);
  lineGradient.addColorStop(0, "rgba(239, 68, 68, 0)");
  lineGradient.addColorStop(0.5, "rgba(239, 68, 68, 0.5)");
  lineGradient.addColorStop(1, "rgba(239, 68, 68, 0)");
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 170);
  ctx.lineTo(1140, 170);
  ctx.stroke();

  // Code IQ Score - Big Circle
  const centerX = 950;
  const centerY = 380;
  const radius = 120;

  // Outer Ring Gradient
  const ringGradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius,
    centerX + radius,
    centerY + radius
  );
  ringGradient.addColorStop(0, "#ef4444");
  ringGradient.addColorStop(1, "#fb923c");
  
  ctx.strokeStyle = ringGradient;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // Inner Circle
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
  ctx.fill();

  // Score Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.codeIQ?.final || "??", centerX, centerY + 20);

  ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("CODE IQ", centerX, centerY + 55);

  // Grade Badge
  const grade = getGrade(data.codeIQ?.final || 0);
  const gradeColor = {
    A: "#10b981",
    B: "#3b82f6",
    C: "#f59e0b",
    D: "#f97316",
    F: "#ef4444"
  }[grade];

  ctx.fillStyle = gradeColor;
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(`Grade ${grade}`, centerX, centerY - 75);

  // Roast Text (Left Side)
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText('"', 60, 230);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "400 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  
  const roastLines = wrapText(ctx, data.roast || "Your code speaks volumes... mostly error messages.", 650, 22);
  roastLines.slice(0, 6).forEach((line, i) => {
    ctx.fillText(line, 60, 270 + i * 35);
  });

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText('"', 60, 270 + roastLines.slice(0, 6).length * 35 + 10);

  // Stats Bar (Bottom)
  const statsY = 540;
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillRect(60, statsY, 1080, 70);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";

  const stats = [
    { icon: "⭐", value: data.stats?.stars || 0, label: "Stars" },
    { icon: "🍴", value: data.stats?.forks || 0, label: "Forks" },
    { icon: "🐞", value: data.stats?.issues || 0, label: "Issues" },
    { icon: "🚓", value: data.commitCrimes?.count || 0, label: "Crimes" }
  ];

  stats.forEach((stat, i) => {
    const x = 150 + i * 250;
    ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(stat.icon, x - 50, statsY + 35);
    
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(stat.value.toString(), x + 20, statsY + 35);
    
    ctx.font = "400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(stat.label, x + 20, statsY + 55);
  });

  // Footer
  ctx.textAlign = "right";
  ctx.fillStyle = "#4b5563";
  ctx.font = "500 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("roastmyrepo.dev", 1140, 600);

  return canvas.toDataURL("image/png");
};

export const generatePremiumExplainCard = (data) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");

  // Background - Blue theme for "Explain"
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#0c1a2e");
  gradient.addColorStop(0.5, "#1e3a5f");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Accent Glow
  const glowGradient = ctx.createRadialGradient(200, 100, 0, 200, 100, 500);
  glowGradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
  glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("📘 ExplainMyRepo", 60, 90);

  // Persona Badge
  const personaMap = {
    junior: "👶 Junior Dev",
    pm: "📊 Product Manager",
    hr: "🧑‍💼 HR Recruiter"
  };
  
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(60, 120, 250, 40);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(personaMap[data.persona] || "Explained", 75, 145);

  // Divider
  ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 190);
  ctx.lineTo(1140, 190);
  ctx.stroke();

  // Explanation Text
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  
  const explanationLines = wrapText(
    ctx,
    data.explanation || "This repository contains code...",
    1080,
    24
  );
  
  explanationLines.slice(0, 10).forEach((line, i) => {
    ctx.fillText(line, 60, 240 + i * 38);
  });

  // Footer
  ctx.fillStyle = "#475569";
  ctx.font = "500 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("roastmyrepo.dev", 1140, 600);

  return canvas.toDataURL("image/png");
};

// Helper Functions
const wrapText = (ctx, text, maxWidth, fontSize) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + word + " ";
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== "") {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  
  return lines;
};

const getGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
};