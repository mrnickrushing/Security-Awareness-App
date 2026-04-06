function columnExists(db, table, column) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  return cols.some((c) => c.name === column);
}

function tableExists(db, table) {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
  return !!row;
}

function ensureSimulationColumns(db) {
  const additions = [
    ["sender_name",       "TEXT NOT NULL DEFAULT ''"],
    ["sender_email",      "TEXT NOT NULL DEFAULT ''"],
    ["subject",           "TEXT NOT NULL DEFAULT ''"],
    ["sent_at",           "TEXT NOT NULL DEFAULT ''"],
    ["body_text",         "TEXT NOT NULL DEFAULT ''"],
    ["link_label",        "TEXT NOT NULL DEFAULT ''"],
    ["link_url",          "TEXT NOT NULL DEFAULT ''"],
    ["attachment_name",   "TEXT NOT NULL DEFAULT ''"],
    ["is_phishing",       "INTEGER NOT NULL DEFAULT 1"],
    ["landing_page_type", "TEXT NOT NULL DEFAULT 'none'"],
    ["difficulty",        "TEXT NOT NULL DEFAULT 'easy'"],
    ["scenario_type",     "TEXT NOT NULL DEFAULT 'phishing'"],
    ["channel",           "TEXT NOT NULL DEFAULT 'email'"],
  ];
  for (const [name, def] of additions) {
    if (!columnExists(db, "simulations", name)) {
      db.prepare(`ALTER TABLE simulations ADD COLUMN ${name} ${def}`).run();
    }
  }
}

function ensureModuleColumns(db) {
  const additions = [
    ["category",         "TEXT NOT NULL DEFAULT 'General'"],
    ["difficulty",       "TEXT NOT NULL DEFAULT 'beginner'"],
    ["duration_minutes", "INTEGER NOT NULL DEFAULT 10"],
    ["order_index",      "INTEGER NOT NULL DEFAULT 0"],
  ];
  for (const [name, def] of additions) {
    if (!columnExists(db, "modules", name)) {
      db.prepare(`ALTER TABLE modules ADD COLUMN ${name} ${def}`).run();
    }
  }
}

function ensureUserColumns(db) {
  const additions = [
    ["xp",          "INTEGER NOT NULL DEFAULT 0"],
    ["level",       "INTEGER NOT NULL DEFAULT 1"],
    ["streak_days", "INTEGER NOT NULL DEFAULT 0"],
    ["last_active", "TEXT"],
  ];
  for (const [name, def] of additions) {
    if (!columnExists(db, "users", name)) {
      db.prepare(`ALTER TABLE users ADD COLUMN ${name} ${def}`).run();
    }
  }
}

function ensureCertificateColumns(db) {
  const additions = [
    ["simulations_completed", "INTEGER NOT NULL DEFAULT 0"],
    ["average_score",         "INTEGER NOT NULL DEFAULT 0"],
  ];
  for (const [name, def] of additions) {
    if (!columnExists(db, "certificates", name)) {
      db.prepare(`ALTER TABLE certificates ADD COLUMN ${name} ${def}`).run();
    }
  }
}

function ensureDecisionTreeTables(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS decision_nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulation_id INTEGER NOT NULL,
      node_key TEXT NOT NULL,
      is_root INTEGER NOT NULL DEFAULT 0,
      prompt TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      image_hint TEXT NOT NULL DEFAULT '',
      UNIQUE(simulation_id, node_key),
      FOREIGN KEY(simulation_id) REFERENCES simulations(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS decision_choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      node_id INTEGER NOT NULL,
      choice_text TEXT NOT NULL,
      outcome_text TEXT NOT NULL DEFAULT '',
      is_correct INTEGER NOT NULL DEFAULT 0,
      next_node_key TEXT NOT NULL DEFAULT '',
      FOREIGN KEY(node_id) REFERENCES decision_nodes(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS decision_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      simulation_id INTEGER NOT NULL,
      choices_made TEXT NOT NULL DEFAULT '[]',
      score INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(simulation_id) REFERENCES simulations(id)
    )
  `).run();
}

function ensureMigrationsTable(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS db_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();
}

function hasMigration(db, version) {
  ensureMigrationsTable(db);
  const row = db.prepare('SELECT id FROM db_migrations WHERE version = ?').get(version);
  return !!row;
}

function recordMigration(db, version) {
  db.prepare('INSERT OR IGNORE INTO db_migrations (version) VALUES (?)').run(version);
}

function runSchema(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();

  ensureUserColumns(db);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();

  ensureModuleColumns(db);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS module_quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      choice_a TEXT NOT NULL,
      choice_b TEXT NOT NULL,
      choice_c TEXT NOT NULL,
      correct_choice TEXT NOT NULL,
      explanation TEXT NOT NULL DEFAULT '',
      FOREIGN KEY(module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      explanation TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();

  ensureSimulationColumns(db);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulation_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      choice_a TEXT NOT NULL,
      choice_b TEXT NOT NULL,
      choice_c TEXT NOT NULL,
      correct_choice TEXT NOT NULL,
      red_flags TEXT NOT NULL,
      FOREIGN KEY(simulation_id) REFERENCES simulations(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      simulation_id INTEGER NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(simulation_id) REFERENCES simulations(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS attempt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      selected_choice TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      FOREIGN KEY(attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS simulation_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      simulation_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      event_value TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(simulation_id) REFERENCES simulations(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS user_module_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_id INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      quiz_score INTEGER,
      UNIQUE(user_id, module_id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      issued_at TEXT NOT NULL DEFAULT (datetime('now')),
      modules_completed INTEGER NOT NULL DEFAULT 0,
      avg_quiz_score INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();

  ensureCertificateColumns(db);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS section_certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      section_id INTEGER NOT NULL,
      issued_at TEXT NOT NULL DEFAULT (datetime('now')),
      modules_completed INTEGER NOT NULL DEFAULT 0,
      avg_quiz_score INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, section_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(section_id) REFERENCES sections(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '📚',
      color TEXT NOT NULL DEFAULT '#6366f1',
      order_index INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  if (!columnExists(db, "modules", "section_id")) {
    db.prepare(`ALTER TABLE modules ADD COLUMN section_id INTEGER REFERENCES sections(id)`).run();
  }

  db.prepare(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      order_index INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  ensureDecisionTreeTables(db);
  ensureMigrationsTable(db);

  db.prepare(`
    DELETE FROM modules WHERE id IN (10,11,12,13)
    AND title IN (
      'Module 5: Vishing and Phone Scams',
      'Module 6: MFA Fatigue',
      'Module 8: Safe Browsing and QR Risks',
      'Module 9: Password Hygiene'
    )
  `).run();
}

function upsertSection(db, name, description, icon, color, order_index) {
  const existing = db.prepare("SELECT id FROM sections WHERE name=?").get(name);
  if (existing) {
    db.prepare(`UPDATE sections SET description=?,icon=?,color=?,order_index=? WHERE id=?`)
      .run(description, icon, color, order_index, existing.id);
    return existing.id;
  }
  const result = db.prepare(
    `INSERT INTO sections (name,description,icon,color,order_index) VALUES (?,?,?,?,?)`
  ).run(name, description, icon, color, order_index);
  return result.lastInsertRowid;
}

function upsertModule(db, title, content, extras = {}) {
  const existing = db.prepare("SELECT id,content FROM modules WHERE title=?").get(title);
  if (existing) {
    const keepContent = (existing.content && existing.content.length > 500) ? existing.content : content;
    db.prepare(`
      UPDATE modules SET content=?,category=?,difficulty=?,
        duration_minutes=?,order_index=?,section_id=?,updated_at=datetime('now')
      WHERE id=?
    `).run(
      keepContent,
      extras.category || "General",
      extras.difficulty || "beginner",
      extras.duration_minutes || 10,
      extras.order_index || 0,
      extras.section_id || null,
      existing.id
    );
    return existing.id;
  }
  const result = db.prepare(`
    INSERT INTO modules (title,content,category,difficulty,duration_minutes,order_index,section_id)
    VALUES (?,?,?,?,?,?,?)
  `).run(
    title, content,
    extras.category || "General",
    extras.difficulty || "beginner",
    extras.duration_minutes || 10,
    extras.order_index || 0,
    extras.section_id || null
  );
  return result.lastInsertRowid;
}

function upsertModuleQuiz(db, moduleId, questions) {
  for (const q of questions) {
    const existing = db.prepare(
      `SELECT id FROM module_quiz_questions WHERE module_id=? AND question_text=?`
    ).get(moduleId, q.question_text);
    if (existing) {
      db.prepare(`
        UPDATE module_quiz_questions
        SET choice_a=?,choice_b=?,choice_c=?,correct_choice=?,explanation=?
        WHERE id=?
      `).run(q.choice_a, q.choice_b, q.choice_c, q.correct_choice, q.explanation || "", existing.id);
    } else {
      db.prepare(`
        INSERT INTO module_quiz_questions
          (module_id,question_text,choice_a,choice_b,choice_c,correct_choice,explanation)
        VALUES (?,?,?,?,?,?,?)
      `).run(moduleId, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.correct_choice, q.explanation || "");
    }
  }
}

function upsertSimulation(db, sim) {
  const existing = db.prepare("SELECT id FROM simulations WHERE title=?").get(sim.title);
  if (existing) {
    db.prepare(`
      UPDATE simulations SET
        prompt=?,explanation=?,sender_name=?,sender_email=?,
        subject=?,sent_at=?,body_text=?,link_label=?,link_url=?,
        attachment_name=?,is_phishing=?,landing_page_type=?,
        difficulty=?,scenario_type=?,channel=?,updated_at=datetime('now')
      WHERE id=?
    `).run(
      sim.prompt, sim.explanation, sim.sender_name, sim.sender_email,
      sim.subject, sim.sent_at, sim.body_text, sim.link_label, sim.link_url,
      sim.attachment_name, sim.is_phishing, sim.landing_page_type,
      sim.difficulty, sim.scenario_type, sim.channel, existing.id
    );
    return existing.id;
  }
  const result = db.prepare(`
    INSERT INTO simulations (
      title,prompt,explanation,sender_name,sender_email,subject,sent_at,
      body_text,link_label,link_url,attachment_name,is_phishing,
      landing_page_type,difficulty,scenario_type,channel
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    sim.title, sim.prompt, sim.explanation, sim.sender_name, sim.sender_email,
    sim.subject, sim.sent_at, sim.body_text, sim.link_label, sim.link_url,
    sim.attachment_name, sim.is_phishing, sim.landing_page_type,
    sim.difficulty, sim.scenario_type, sim.channel
  );
  return result.lastInsertRowid;
}

function upsertQuestion(db, simulationId, question) {
  const existing = db.prepare(
    `SELECT id FROM questions WHERE simulation_id=? AND question_text=?`
  ).get(simulationId, question.question_text);
  if (existing) {
    db.prepare(`
      UPDATE questions
      SET choice_a=?,choice_b=?,choice_c=?,correct_choice=?,red_flags=?
      WHERE id=?
    `).run(question.choice_a, question.choice_b, question.choice_c,
           question.correct_choice, question.red_flags, existing.id);
    return existing.id;
  }
  const result = db.prepare(`
    INSERT INTO questions
      (simulation_id,question_text,choice_a,choice_b,choice_c,correct_choice,red_flags)
    VALUES (?,?,?,?,?,?,?)
  `).run(simulationId, question.question_text, question.choice_a, question.choice_b,
         question.choice_c, question.correct_choice, question.red_flags);
  return result.lastInsertRowid;
}

function upsertDecisionTree(db, simulationId, nodes) {
  for (const node of nodes) {
    const existing = db.prepare(
      `SELECT id FROM decision_nodes WHERE simulation_id=? AND node_key=?`
    ).get(simulationId, node.node_key);

    let nodeId;
    if (existing) {
      db.prepare(`
        UPDATE decision_nodes
        SET is_root=?,prompt=?,context=?,image_hint=?
        WHERE id=?
      `).run(node.is_root ? 1 : 0, node.prompt, node.context || "", node.image_hint || "", existing.id);
      nodeId = existing.id;
      db.prepare(`DELETE FROM decision_choices WHERE node_id=?`).run(nodeId);
    } else {
      const result = db.prepare(`
        INSERT INTO decision_nodes (simulation_id,node_key,is_root,prompt,context,image_hint)
        VALUES (?,?,?,?,?,?)
      `).run(simulationId, node.node_key, node.is_root ? 1 : 0, node.prompt, node.context || "", node.image_hint || "");
      nodeId = result.lastInsertRowid;
    }

    for (const choice of node.choices || []) {
      db.prepare(`
        INSERT INTO decision_choices (node_id,choice_text,outcome_text,is_correct,next_node_key)
        VALUES (?,?,?,?,?)
      `).run(nodeId, choice.choice_text, choice.outcome_text || "", choice.is_correct ? 1 : 0, choice.next_node_key || "");
    }
  }
}

function upsertFaq(db, question, answer, category, order_index) {
  const existing = db.prepare("SELECT id FROM faq_items WHERE question=?").get(question);
  if (existing) {
    db.prepare(`UPDATE faq_items SET answer=?,category=?,order_index=? WHERE id=?`)
      .run(answer, category, order_index, existing.id);
    return existing.id;
  }
  const result = db.prepare(
    `INSERT INTO faq_items (question,answer,category,order_index) VALUES (?,?,?,?)`
  ).run(question, answer, category, order_index);
  return result.lastInsertRowid;
}

module.exports = {
  runSchema,
  upsertSection,
  upsertModule,
  upsertModuleQuiz,
  upsertSimulation,
  upsertQuestion,
  upsertDecisionTree,
  upsertFaq,
  hasMigration,
  recordMigration,
};
