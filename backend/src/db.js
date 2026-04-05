const Database = require("better-sqlite3");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite");
const db = new Database(dbPath);

const { runSchema }       = require("./db/schema");
const { seedAdmin }       = require("./db/seeds/admin");
const { seedSections }    = require("./db/seeds/sections");
const { seedS1 }          = require("./db/seeds/s1_security_awareness");
const { seedS2 }          = require("./db/seeds/s2_computer_troubleshooting");
const { seedS3 }          = require("./db/seeds/s3_anti_hacking");
const { seedS4 }          = require("./db/seeds/s4_network_fundamentals");
const { seedS5 }          = require("./db/seeds/s5_safe_internet");
const { seedS6 }          = require("./db/seeds/s6_device_security");
const { seedS7 }          = require("./db/seeds/s7_privacy_protection");
const { seedS8 }          = require("./db/seeds/s8_cloud_security");
const { seedS9 }          = require("./db/seeds/s9_incident_response");
const { seedS10 }         = require("./db/seeds/s10_ai_deepfake_threats");
const { seedS11 }         = require("./db/seeds/s11_password_identity");
const { seedSimulations } = require("./db/seeds/simulations");
const { seedFaq }         = require("./db/seeds/faq");
const { seedNetworkIntrusionSim } = require("./db/seeds/seed_decision_tree_network_intrusion");
const { seedTaskManagerSim } = require("./db/seeds/seed_decision_tree_taskman");
const { seedMalwareDesktopSim } = require("./db/seeds/seed_decision_tree_malware_desktop");
const { seedDecisionTreePCTroubleshooting } = require("./db/seeds/seed_decision_tree_pc_troubleshooting");
const {
  seedS2Sim, seedS3Sim, seedS4Sim, seedS5Sim, seedS6Sim,
  seedS7Sim, seedS8Sim, seedS9Sim, seedS10Sim, seedS11Sim,
} = require("./db/seeds/seed_all_new_sims");
const {
  seedS1SimA, seedS1SimB,
  seedS2SimB,
  seedS3SimB,
  seedS4SimB,
  seedS5SimB,
  seedS6SimB,
  seedS7SimB,
} = require("./db/seeds/seed_s1_s7_extra_sims");

function initDb() {
  db.pragma("journal_mode = WAL");
  runSchema(db);
  seedAdmin(db);
  seedSections(db);
  seedS1(db);
  seedS2(db);
  seedS3(db);
  seedS4(db);
  seedS5(db);
  seedS6(db);
  seedS7(db);
  seedS8(db);
  seedS9(db);
  seedS10(db);
  seedS11(db);
  seedSimulations(db);
  seedFaq(db);
  seedNetworkIntrusionSim(db);
  seedTaskManagerSim(db);
  seedMalwareDesktopSim(db);
  seedDecisionTreePCTroubleshooting(db);
  seedS2Sim(db);
  seedS3Sim(db);
  seedS4Sim(db);
  seedS5Sim(db);
  seedS6Sim(db);
  seedS7Sim(db);
  seedS8Sim(db);
  seedS9Sim(db);
  seedS10Sim(db);
  seedS11Sim(db);
  seedS1SimA(db);
  seedS1SimB(db);
  seedS2SimB(db);
  seedS3SimB(db);
  seedS4SimB(db);
  seedS5SimB(db);
  seedS6SimB(db);
  seedS7SimB(db);
}

module.exports = { db, initDb };
