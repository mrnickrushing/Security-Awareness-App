const { upsertSimulation } = require("../schema");

// Section 2: Computer Troubleshooting — Terminal Sim
function seedS2Sim(db) {
  upsertSimulation(db, {
    title: "Disk Full: Terminal Troubleshooting",
    prompt: "DESKTOP_SIM_TERMINAL:A coworker reports their Windows PC is freezing and throwing low disk space warnings. You remote in and open a terminal to diagnose and free up space without deleting anything important.",
    explanation: "Disk space issues are one of the most common PC problems. Knowing which directories eat space, how to safely clear temp files, and what NOT to delete prevents data loss and keeps systems running.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Disk Full: Terminal Troubleshooting", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 3: Anti-Hacking Defense — Desktop GUI Sim
function seedS3Sim(db) {
  upsertSimulation(db, {
    title: "Account Hardening Workstation",
    prompt: "DESKTOP_SIM_HARDENING:Your IT team has flagged your workstation as failing three security checks. Work through the desktop to harden your account settings before the deadline.",
    explanation: "Account hardening involves enabling MFA, setting strong passwords, reviewing app permissions, and disabling unused services. Missing any one of these leaves an open door for attackers.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Account Hardening Workstation", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 4: Network Fundamentals — Browser Sim
function seedS4Sim(db) {
  upsertSimulation(db, {
    title: "Suspicious Network Traffic Investigation",
    prompt: "DESKTOP_SIM_BROWSER:You are reviewing browser-based network logs after an employee reported strange behavior on their machine. Identify which connections are malicious and take the right action.",
    explanation: "Reading network traffic in a browser-based tool is a fundamental analyst skill. Spotting beaconing patterns, unusual ports, and unknown external IPs separates routine traffic from active threats.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Suspicious Network Traffic Investigation", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 5: Safe Internet Habits — Browser Sim
function seedS5Sim(db) {
  upsertSimulation(db, {
    title: "Dangerous Browsing: Spot the Threat",
    prompt: "DESKTOP_SIM_BROWSER:Navigate through a simulated browser session full of real-world traps — fake download buttons, malicious popups, lookalike URLs, and deceptive cookie banners. Make the right call at each step.",
    explanation: "Safe browsing requires recognizing fake download buttons, suspicious redirects, lookalike domains, and manipulative cookie prompts. Each one is a common vector for malware and credential theft.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Dangerous Browsing: Spot the Threat", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 6: Device Security — Phone/SMS Sim
function seedS6Sim(db) {
  upsertSimulation(db, {
    title: "Device Security: SMS Threat Triage",
    prompt: "DESKTOP_SIM_PHONE:Your phone is blowing up with texts. Some are legitimate alerts from services you use. Others are smishing attacks trying to steal your credentials or install malware. Triage each one correctly.",
    explanation: "Smishing attacks mimic delivery notifications, bank alerts, and IT helpdesk messages. The indicators — urgency, suspicious links, requests for credentials — are the same as email phishing but people are less cautious on mobile.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Device Security: SMS Threat Triage", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 7: Privacy Protection — Phone/SMS Sim
function seedS7Sim(db) {
  upsertSimulation(db, {
    title: "Privacy Under Attack: Voice and SMS Scams",
    prompt: "DESKTOP_SIM_PHONE:You receive a series of calls and texts claiming to be from your bank, a government agency, and a family member in trouble. Each one is trying to extract personal information. Handle each correctly.",
    explanation: "Voice and SMS scams use urgency, authority, and emotion to bypass critical thinking. Recognizing these triggers and defaulting to independent verification rather than responding in the moment defeats every one of these attacks.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Privacy Under Attack: Voice and SMS Scams", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "medium",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 8: Cloud Security — Terminal Sim
function seedS8Sim(db) {
  upsertSimulation(db, {
    title: "Cloud Misconfiguration Response",
    prompt: "DESKTOP_SIM_TERMINAL:A security scanner just flagged three critical misconfigurations in your company's AWS environment. You have a terminal open with the AWS CLI. Fix each issue before the audit window closes.",
    explanation: "Cloud misconfigurations are the leading cause of data breaches in cloud environments. Public S3 buckets, overpermissive IAM roles, and disabled logging are the top three. Knowing how to identify and fix them is essential.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Cloud Misconfiguration Response", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 9: Incident Response — Terminal Sim
function seedS9Sim(db) {
  upsertSimulation(db, {
    title: "Live Incident: Terminal Response",
    prompt: "DESKTOP_SIM_TERMINAL:An alert just fired. A server is showing signs of active compromise. You have SSH access and a terminal. Work through the triage, containment, and evidence preservation steps before the attacker covers their tracks.",
    explanation: "Incident response in a terminal requires knowing what to look at first, what commands preserve evidence versus destroy it, and how to isolate a system without losing the forensic artifacts needed for investigation.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Live Incident: Terminal Response", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 10: AI and Deepfake Threats — Phone/SMS Sim
function seedS10Sim(db) {
  upsertSimulation(db, {
    title: "AI Voice and Deepfake Attack Triage",
    prompt: "DESKTOP_SIM_PHONE:You receive calls and messages from what sounds like your CEO, a family member, and your bank — but something feels off. Each interaction is an AI-powered attack. Identify the threat and respond correctly.",
    explanation: "AI voice cloning and deepfake video calls are being used for financial fraud, emergency scams, and executive impersonation. The defense is always the same: hang up, verify through an independent channel you already trust.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "AI Voice and Deepfake Attack Triage", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "hard",
    scenario_type: "decision_tree", channel: "email",
  });
}

// Section 11: Password and Identity Management — Password Manager Sim
function seedS11Sim(db) {
  upsertSimulation(db, {
    title: "Password Manager Setup and Audit",
    prompt: "DESKTOP_SIM_PASSWORD:Your security audit revealed five accounts with weak or reused passwords and two accounts with no MFA. Work through the password manager interface to fix each issue before your score drops further.",
    explanation: "Using a password manager correctly means generating unique passwords for every account, enabling MFA everywhere it is available, and auditing for reuse. Most people know they should do this but have never practiced the workflow.",
    sender_name: "Interactive Training", sender_email: "training@local",
    subject: "Password Manager Setup and Audit", sent_at: "", body_text: "",
    link_label: "", link_url: "", attachment_name: "",
    is_phishing: 0, landing_page_type: "none", difficulty: "easy",
    scenario_type: "decision_tree", channel: "email",
  });
}

module.exports = {
  seedS2Sim, seedS3Sim, seedS4Sim, seedS5Sim, seedS6Sim,
  seedS7Sim, seedS8Sim, seedS9Sim, seedS10Sim, seedS11Sim,
};
