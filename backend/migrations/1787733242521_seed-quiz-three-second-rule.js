/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    WITH new_quiz AS (
      INSERT INTO quizzes (module_id, title)
      VALUES (
        (SELECT id FROM learning_modules WHERE slug = 'the-three-second-rule'),
        'Three-Second Rule Quiz'
      )
      RETURNING id
    )
    INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
    VALUES
      (
        (SELECT id FROM new_quiz),
        'How long can an offensive player stay in the restricted area?',
        '["2 seconds", "3 seconds", "5 seconds", "There is no limit"]',
        '3 seconds'
      ),
      (
        (SELECT id FROM new_quiz),
        'What counts as a player being "outside" the restricted area?',
        '["One foot outside is enough", "Both feet must be outside", "Just their upper body needs to lean out", "It depends on the referee''s judgment only"]',
        'Both feet must be outside'
      ),
      (
        (SELECT id FROM new_quiz),
        'Which of these is an allowed exception to the three-second count?',
        '["Standing still to block a passing lane", "Being in the act of shooting as the ball leaves your hands", "Resting after a fast break", "Waiting for a teammate to pass"]',
        'Being in the act of shooting as the ball leaves your hands'
      );
  `);
};



/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM quiz_questions WHERE quiz_id = (
      SELECT id FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'the-three-second-rule')
    );
    DELETE FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'the-three-second-rule');
  `);
};
