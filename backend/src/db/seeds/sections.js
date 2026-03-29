const { upsertSection } = require("../schema");

function seedSections(db) {
  upsertSection(db, "Security Awareness",              "Phishing, social engineering, credential theft and threat recognition",              "🛡",  "#22d3ee", 1);
  upsertSection(db, "Computer Troubleshooting",        "Diagnose and fix common PC problems, crashes, and performance issues",               "🖥",  "#a78bfa", 2);
  upsertSection(db, "Anti-Hacking Defense",            "Harden your devices, accounts, and network against real attacks",                    "🔒",  "#34d399", 3);
  upsertSection(db, "Network Fundamentals",            "Understand how networks work and how to keep them secure",                           "🌐",  "#60a5fa", 4);
  upsertSection(db, "Safe Internet Habits",            "Browse safely, protect your privacy, and avoid online threats",                      "🌍",  "#fb923c", 5);
  upsertSection(db, "Device Security",                 "Secure your Windows, mobile, and other devices end to end",                         "📱",  "#f472b6", 6);
  upsertSection(db, "Privacy Protection",              "Control your data, reduce tracking, and protect your digital identity",              "👁",  "#fbbf24", 7);
  upsertSection(db, "Cloud Security",                  "Understand cloud risks, secure your cloud resources, and apply the shared responsibility model", "☁️",  "#38bdf8", 8);
  upsertSection(db, "Incident Response",               "Detect, contain, and recover from security incidents using a structured approach",   "🚨",  "#f87171", 9);
  upsertSection(db, "AI and Deepfake Threats",         "Recognize AI-powered attacks, deepfakes, and disinformation to stay protected",     "🤖",  "#c084fc", 10);
  upsertSection(db, "Password and Identity Management","Build a strong personal identity security system using passwords, MFA, and good habits", "🔑",  "#4ade80", 11);
}

module.exports = { seedSections };
