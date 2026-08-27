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
        (SELECT id FROM learning_modules WHERE slug = 'what-is-a-travel'),
        'Traveling Quiz'
      )
      RETURNING id
    )
    INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
    VALUES
      (
        (SELECT id FROM new_quiz),
        'What is a pivot foot?',
        '["A foot a player must keep in contact with the floor after stopping", "The foot a player jumps off to shoot", "A foot used only during dribbling", "The back foot when running"]',
        'A foot a player must keep in contact with the floor after stopping'
      ),
      (
        (SELECT id FROM new_quiz),
        'How many steps are you allowed after gathering the ball, before you must pass, shoot, or stop?',
        '["One step", "Two steps", "Three steps", "There is no step limit"]',
        'Two steps'
      ),
      (
        (SELECT id FROM new_quiz),
        'What happens when a traveling violation is called?',
        '["The player is fouled out", "The ball is given to the other team", "The player shoots free throws", "Play continues with no penalty"]',
        'The ball is given to the other team'
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
      SELECT id FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'what-is-a-travel')
    );
    DELETE FROM quizzes WHERE module_id = (SELECT id FROM learning_modules WHERE slug = 'what-is-a-travel');
  `);
};
