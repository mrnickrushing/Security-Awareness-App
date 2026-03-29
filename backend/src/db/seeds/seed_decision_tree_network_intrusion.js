const { upsertSimulation } = require("../schema");

function seedNetworkIntrusionSim(db) {
  const sim = {
    title: "Network Intrusion Response",
    prompt: "DESKTOP_SIM_NETWORK:You are the on-call network admin. The NOC dashboard just lit up. An active intrusion is in progress across your company network. You have to identify and stop it before critical data is exfiltrated.",
    explanation: "Network intrusions move fast. Recognizing reconnaissance, stopping lateral movement, and containing exfiltration attempts are three distinct skills. Missing any one of them gives the attacker time to cause serious damage.",
    sender_name: "Interactive Training",
    sender_email: "training@local",
    subject: "Network Intrusion Response",
    sent_at: "",
    body_text: "",
    link_label: "",
    link_url: "",
    attachment_name: "",
    is_phishing: 0,
    landing_page_type: "none",
    difficulty: "medium",
    scenario_type: "decision_tree",
    channel: "email",
  };

  const simId = upsertSimulation(db, sim);
  console.log(`Seeded network intrusion sim: ${sim.title} (simulation id ${simId})`);
}

module.exports = { seedNetworkIntrusionSim };
