const {db} = require('./src/db');
const rows = db.prepare(
  "SELECT m.title, m.content, mq.question_text, mq.choice_a, mq.choice_b, mq.choice_c, mq.correct_choice, mq.explanation FROM module_quiz_questions mq JOIN modules m ON m.id = mq.module_id ORDER BY m.section_id, m.order_index, mq.id"
).all();
require('fs').writeFileSync('/home/Nitehawk/Desktop/content_vs_questions.json', JSON.stringify(rows, null, 2));
console.log('Written', rows.length, 'rows');
