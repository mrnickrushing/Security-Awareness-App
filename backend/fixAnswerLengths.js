// fixAnswerLengths.js
// Fixes the pattern where the longest answer is always correct
// by rotating answer positions so correct_choice cycles A/B/C/A/B/C...
// Run from backend root: node fixAnswerLengths.js

const { db, initDb } = require('./src/db');
initDb();

// Get all quiz questions ordered by id
const questions = db.prepare(`
  SELECT id, question_text, choice_a, choice_b, choice_c, correct_choice, explanation
  FROM module_quiz_questions
  ORDER BY id ASC
`).all();

const update = db.prepare(`
  UPDATE module_quiz_questions
  SET choice_a = ?, choice_b = ?, choice_c = ?, correct_choice = ?
  WHERE id = ?
`);

let fixed = 0;
let skipped = 0;

// Target pattern: question index mod 3 determines which position gets the correct answer
// 0 -> A, 1 -> B, 2 -> C
const targets = ['A', 'B', 'C'];

const updateMany = db.transaction((qs) => {
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    const currentCorrect = q.correct_choice.toUpperCase();
    const targetPosition = targets[i % 3];

    // If already in the right position, skip
    if (currentCorrect === targetPosition) {
      skipped++;
      continue;
    }

    // Get current answer texts
    const answers = {
      A: q.choice_a,
      B: q.choice_b,
      C: q.choice_c,
    };

    const correctText = answers[currentCorrect];

    // We need to put correctText at targetPosition
    // and move whatever is at targetPosition to currentCorrect's old spot
    const displacedText = answers[targetPosition];

    answers[currentCorrect] = displacedText;
    answers[targetPosition] = correctText;

    update.run(answers.A, answers.B, answers.C, targetPosition, q.id);
    fixed++;
  }
});

updateMany(questions);

console.log(`Fixed: ${fixed} questions`);
console.log(`Already correct position: ${skipped} questions`);
console.log(`Total: ${questions.length} questions`);

// Verify distribution
const dist = db.prepare(`
  SELECT correct_choice, COUNT(*) as count
  FROM module_quiz_questions
  GROUP BY correct_choice
  ORDER BY correct_choice
`).all();

console.log('\nAnswer distribution after fix:');
dist.forEach(r => console.log(`  ${r.correct_choice}: ${r.count}`));

// Verify longest-is-correct no longer dominates
const all = db.prepare(`
  SELECT choice_a, choice_b, choice_c, correct_choice
  FROM module_quiz_questions
`).all();

let longestCorrect = 0;
for (const q of all) {
  const lengths = { A: q.choice_a.length, B: q.choice_b.length, C: q.choice_c.length };
  const maxLen = Math.max(lengths.A, lengths.B, lengths.C);
  const longest = Object.keys(lengths).find(k => lengths[k] === maxLen);
  if (longest === q.correct_choice) longestCorrect++;
}
console.log(`\nLongest-is-correct: ${longestCorrect}/${all.length} (${Math.round(longestCorrect/all.length*100)}%)`);
console.log('Target: around 33% (pure chance)');
