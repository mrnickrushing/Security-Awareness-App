// fixAnswerLengthBalance.js
// Makes wrong answers longer by appending plausible-but-incorrect elaboration
// so the correct answer is no longer identifiable by being the longest
// Run from backend root: node fixAnswerLengthBalance.js

const { db, initDb } = require('./src/db');
initDb();

const questions = db.prepare(`
  SELECT id, choice_a, choice_b, choice_c, correct_choice
  FROM module_quiz_questions
  ORDER BY id ASC
`).all();

const update = db.prepare(`
  UPDATE module_quiz_questions
  SET choice_a = ?, choice_b = ?, choice_c = ?
  WHERE id = ?
`);

// Pool of neutral wrong-answer padding phrases that sound plausible
// but don't give away the answer or sound too obviously padded
const wrongPadding = [
  ", though this approach works only in specific enterprise environments and requires additional configuration",
  ", although this method is typically reserved for advanced users with elevated system privileges",
  ", but only after confirming the issue persists across multiple attempts and devices",
  ", which requires administrator approval before implementation in most organizational settings",
  ", though the effectiveness varies depending on the operating system version and installed updates",
  ", provided that all other standard troubleshooting steps have already been completed without success",
  ", but this is generally considered a secondary option when primary methods have been exhausted",
  ", which applies primarily to managed devices enrolled in enterprise security programs",
  ", though results may vary based on network configuration and regional security policies",
  ", as long as the device has been recently updated and security software is current",
  ", but this only applies when the affected system is connected to a domain controller",
  ", provided the user account has the necessary permissions and the feature is enabled in settings",
  ", though this step alone is rarely sufficient without addressing the underlying root cause",
  ", which is most effective when combined with a full system restart and cache clearance",
  ", but this should be verified against your organization's specific security policy first",
  ", assuming the relevant service is running and properly configured on the target system",
  ", though this varies by device manufacturer and the version of software currently installed",
  ", but additional verification steps may be required depending on the sensitivity of the data",
  ", which typically requires access to system logs or administrative tools to confirm",
  ", provided the network connection is stable and no firewall rules are blocking the process",
];

function getPad(index) {
  return wrongPadding[index % wrongPadding.length];
}

const updateMany = db.transaction((qs) => {
  let padded = 0;

  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    const correct = q.correct_choice;

    let a = q.choice_a;
    let b = q.choice_b;
    let c = q.choice_c;

    const correctLen = correct === 'A' ? a.length : correct === 'B' ? b.length : c.length;

    let changed = false;

    // Pad each wrong answer until it is at least as long as the correct answer
    // Use a deterministic padding index based on question id and choice position
    if (correct !== 'A' && a.length < correctLen + 20) {
      a = a + getPad((i * 3 + 0) % wrongPadding.length);
      changed = true;
    }
    if (correct !== 'B' && b.length < correctLen + 20) {
      b = b + getPad((i * 3 + 1) % wrongPadding.length);
      changed = true;
    }
    if (correct !== 'C' && c.length < correctLen + 20) {
      c = c + getPad((i * 3 + 2) % wrongPadding.length);
      changed = true;
    }

    if (changed) {
      update.run(a, b, c, q.id);
      padded++;
    }
  }

  return padded;
});

const padded = updateMany(questions);
console.log(`Padded wrong answers on ${padded} questions`);

// Verify longest-is-correct rate
const all = db.prepare(`
  SELECT choice_a, choice_b, choice_c, correct_choice
  FROM module_quiz_questions
`).all();

let longestCorrect = 0;
let tiedLongest = 0;

for (const q of all) {
  const lengths = { A: q.choice_a.length, B: q.choice_b.length, C: q.choice_c.length };
  const maxLen = Math.max(lengths.A, lengths.B, lengths.C);
  const longestKeys = Object.keys(lengths).filter(k => lengths[k] === maxLen);

  if (longestKeys.length > 1) {
    tiedLongest++;
  } else if (longestKeys[0] === q.correct_choice) {
    longestCorrect++;
  }
}

console.log(`\nAfter padding:`);
console.log(`  Longest is correct (unambiguous): ${longestCorrect}/${all.length} (${Math.round(longestCorrect/all.length*100)}%)`);
console.log(`  Tied for longest: ${tiedLongest}/${all.length} (${Math.round(tiedLongest/all.length*100)}%)`);
console.log(`  Wrong answer is clearly longest: ${all.length - longestCorrect - tiedLongest}/${all.length} (${Math.round((all.length - longestCorrect - tiedLongest)/all.length*100)}%)`);

// Check distribution still balanced
const dist = db.prepare(`
  SELECT correct_choice, COUNT(*) as count
  FROM module_quiz_questions
  GROUP BY correct_choice
  ORDER BY correct_choice
`).all();

console.log('\nAnswer distribution:');
dist.forEach(r => console.log(`  ${r.correct_choice}: ${r.count}`));
