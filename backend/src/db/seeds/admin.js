const bcrypt = require("bcrypt");

function seedAdmin(db) {
  const adminEmail = "admin@example.com";
  const existing = db.prepare("SELECT id FROM users WHERE email=?").get(adminEmail);
  if (!existing) {
    const hash = bcrypt.hashSync("Admin123!", 10);
    db.prepare(`INSERT INTO users (email,password_hash,role) VALUES (?,?,'admin')`).run(adminEmail, hash);
  }
}

module.exports = { seedAdmin };
