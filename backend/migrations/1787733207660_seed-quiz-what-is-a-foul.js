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
        (SELECT id FROM learning_modules WHERE slug = 'what-is-a-foul'),
        'Fouls Basics Quiz'
      )
      RETURNING id
    )
    INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
    VALUES
      (
        (SELECT id FROM new_quiz),
        'What is a foul in basketball?',
        '["Any contact between two players", "Illegal personal contact with an opponent or unsportsmanlike behavior", "Only contact that causes a player to fall", "A violation of the shot clock"]',
        'Illegal personal contact with an opponent or unsportsmanlike behavior'
      ),
      (
        (SELECT id FROM new_quiz),
        'If a player is fouled while missing a 2-point shot attempt, how many free throws do they get?',
        '["1", "2", "3", "0"]',
        '2'
      ),
      (
        (SELECT id FROM new_quiz),
        'If a foul happens while a player is NOT shooting, what happens?',
        '["The fouled player shoots free throws", "The non-offending team gets a throw-in", "The game restarts with a jump ball", "Nothing, play continues"]',
        'The non-offending team gets a throw-in'
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
      SELECT id FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'what-is-a-foul')
    );
    DELETE FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'what-is-a-foul');
  `);
};
