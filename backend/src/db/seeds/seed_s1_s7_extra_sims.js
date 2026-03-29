const { upsertSimulation } = require("../schema");

// ── Section 1: Security Awareness ────────────────────────────────────────────

// S1 Sim A — Phone sim: AI voice clone emergency scam
function seedS1SimA(db) {
  upsertSimulation(db, {
    title: "Voice Clone Emergency Scam",
    prompt: "DESKTOP_SIM_PHONE:You receive a series of calls and texts that sound exactly like people you know and trust. Each one is an AI voice cloning or social engineering attack targeting your personal information or money. Identify the threat and respond correctly.",
    explanation: "AI voice cloning scams work because the voice sounds real. The defense is always the same — hang up and call back on a number you already have. Urgency and secrecy requests are the clearest attack indicators regardless of how convincing the voice sounds.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Voice Clone Emergency Scam", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// S1 Sim B — Terminal sim: phishing header investigation
function seedS1SimB(db) {
  upsertSimulation(db, {
    title: "Phishing Email Header Analysis",
    prompt: "DESKTOP_SIM_TERMINAL:A suspicious email was flagged by a user. You have access to the raw email headers and a terminal to analyze them. Determine whether the email is legitimate or a spoofed phishing attempt and take the correct action.",
    explanation: "Email headers reveal the true origin of a message even when the From field is spoofed. Checking SPF, DKIM, and DMARC results plus the actual sending IP tells you more about an email's legitimacy than anything visible to the end user.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Phishing Email Header Analysis", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 2: Computer Troubleshooting ──────────────────────────────────────

// S2 Sim B — Browser sim: driver download trap
function seedS2SimB(db) {
  upsertSimulation(db, {
    title: "Driver Download Trap",
    prompt: "DESKTOP_SIM_BROWSER:Your coworker is trying to update their graphics driver and has ended up on a series of suspicious websites. Walk through the browser session and identify which download sources are safe and which are traps designed to install malware disguised as drivers.",
    explanation: "Driver download sites are one of the most common malware delivery vectors. Legitimate drivers come from the hardware manufacturer's official site or Windows Update. Third-party driver sites almost always bundle malware or adware regardless of how professional they look.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Driver Download Trap", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 3: Anti-Hacking Defense ──────────────────────────────────────────

// S3 Sim B — Terminal sim: firewall and service audit
function seedS3SimB(db) {
  upsertSimulation(db, {
    title: "System Hardening: Service and Firewall Audit",
    prompt: "DESKTOP_SIM_TERMINAL:A security audit flagged your Linux server as having unnecessary services running and firewall rules that are too permissive. Use the terminal to identify and disable the risky services and tighten the firewall rules before the next audit window.",
    explanation: "Attack surface reduction means disabling every service and closing every port that is not actively needed. Every running service is a potential entry point. Auditing what is exposed and eliminating what is unnecessary is one of the most effective hardening steps available.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "System Hardening: Service and Firewall Audit", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 4: Network Fundamentals ──────────────────────────────────────────

// S4 Sim B — Terminal sim: packet capture analysis
function seedS4SimB(db) {
  upsertSimulation(db, {
    title: "Packet Capture Analysis",
    prompt: "DESKTOP_SIM_TERMINAL:You have a packet capture file from a network segment that showed unusual traffic patterns overnight. Use terminal tools to analyze the capture, identify the suspicious traffic, and determine what the attacker was doing.",
    explanation: "Packet captures are one of the most powerful tools in network security. Being able to read tcpdump or Wireshark output and identify beaconing, data exfiltration, and lateral movement traffic is a foundational network security skill.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Packet Capture Analysis", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 5: Safe Internet Habits ──────────────────────────────────────────

// S5 Sim B — Phone sim: social media scam
function seedS5SimB(db) {
  upsertSimulation(db, {
    title: "Social Media Account Scams",
    prompt: "DESKTOP_SIM_PHONE:Your phone is receiving DMs and notifications from what appear to be friends, brands, and influencers on social media. Some are legitimate. Others are account takeover scams, fake giveaways, and impersonation attacks. Identify each one correctly.",
    explanation: "Social media scams use compromised friend accounts, fake verified badges, and impersonation to build false trust. A message from a known contact does not mean it is safe if their account has been compromised. Verify unusual requests through a separate channel.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Social Media Account Scams", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 6: Device Security ────────────────────────────────────────────────

// S6 Sim B — Browser sim: fake app store and sideloading
function seedS6SimB(db) {
  upsertSimulation(db, {
    title: "Fake App Store and Sideloading Traps",
    prompt: "DESKTOP_SIM_BROWSER:You are helping a coworker who wants to install a popular app that is not available in their region. They have found several websites claiming to offer the download. Walk through the browser session and determine which sources are safe and which will install malware.",
    explanation: "Sideloading apps from unofficial sources bypasses the security reviews that app stores perform. Malware authors specifically target popular apps that are hard to find legitimately. The official app store is almost always the right answer even when it is inconvenient.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Fake App Store and Sideloading Traps", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// ── Section 7: Privacy Protection ────────────────────────────────────────────

// S7 Sim B — Password sim: privacy-focused account audit
function seedS7SimB(db) {
  upsertSimulation(db, {
    title: "Privacy Audit: App Permissions and Data Exposure",
    prompt: "DESKTOP_SIM_PASSWORD:Your privacy audit has flagged five apps with excessive permissions, two accounts that have been found in data breaches, and three services sharing your data with advertisers. Work through the audit tool to revoke permissions, secure the breached accounts, and opt out of data sharing.",
    explanation: "Privacy protection requires active management of what data you share and with whom. Apps regularly request permissions they do not need, breached accounts need immediate attention, and many services share your data by default unless you explicitly opt out.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Privacy Audit: App Permissions and Data Exposure", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

module.exports = {
  seedS1SimA, seedS1SimB,
  seedS2SimB,
  seedS3SimB,
  seedS4SimB,
  seedS5SimB,
  seedS6SimB,
  seedS7SimB,
};
