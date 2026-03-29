const { upsertSimulation } = require("../schema");

function seedTaskManagerSim(db) {
  const sim = {
    title: "Investigating Suspicious Processes",
    prompt: "DESKTOP_SIM_TASKMAN:Your PC has been running slow all morning. A coworker mentions they saw a weird process name last week before their machine got infected. Open Task Manager and investigate.",
    explanation: "Identifying and ending suspicious processes is only half the job. Malware that survives a reboot has almost always added itself to the startup list. Checking the Startup tab and disabling unknown entries is just as important as ending the active process.",
    sender_name: "Interactive Training",
    sender_email: "training@local",
    subject: "Investigating Suspicious Processes",
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
  console.log(`Seeded taskman desktop sim: ${sim.title} (simulation id ${simId})`);
}

module.exports = { seedTaskManagerSim };
