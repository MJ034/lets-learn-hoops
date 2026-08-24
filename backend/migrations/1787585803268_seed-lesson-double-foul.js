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
    INSERT INTO learning_modules (title, slug, category_id, content, reading_time, fiba_rule_reference)
    VALUES (
      'What is a Double Foul?',
      'what-is-a-double-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What is a Double Foul?

A double foul happens when players from both teams commit fouls against each other at approximately the same time.

Both players are charged with a foul, but the penalties are generally cancelled out rather than giving both teams separate free throws.

## What Happens Next?

The restart depends on what was happening when the double foul occurred.

### A Goal or Last Free Throw Was Scored

If a valid basket or last free throw was scored at approximately the same time, the team that did not score receives the ball for a throw-in from behind its endline.

### A Team Had Control of the Ball

If one team had control of the ball, or was entitled to it, that team keeps possession.

Play resumes with a throw-in from the place nearest to where the double foul occurred.

### Neither Team Had Control

If neither team had control of the ball or was entitled to it, a **jump ball situation** occurs.

## Why It Matters

A double foul is different from simply having two fouls called during the same sequence.

The important part is that the opposing players commit fouls against each other at approximately the same time. The penalties are then handled together rather than treating them as two separate plays.
      $content$,
      3,
      'Rule 35.2'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-a-double-foul';`);
};
