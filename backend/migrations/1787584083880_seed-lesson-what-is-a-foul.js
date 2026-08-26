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
      'What is a Foul?',
      'what-is-a-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What is a Foul?

A foul is illegal personal contact with an opponent, or unsportsmanlike behavior. Fouls are one of the most frequent calls in any basketball game, and every foul gets charged to the player who committed it, tracked on the scoresheet.

## Personal Fouls

The most common type is a **personal foul** — contact like holding, pushing, charging, tripping, or blocking an opponent's path.

This applies whether the ball is live or dead, and covers using a hand, arm, elbow, shoulder, hip, leg, knee, or foot to illegally impede another player.

## What Happens After a Foul is Called

The penalty depends on what the fouled player was doing:

- **Not shooting** — the non-offending team gets the ball back via a throw-in from the spot nearest the foul.
- **In the act of shooting** — the shooter gets free throws: 1 free throw if the shot still goes in, 2 free throws if a missed shot was a 2-point attempt, or 3 free throws if a missed shot was a 3-point attempt.

## Why It Matters

Fouls exist to keep contact within a fair, physical-but-controlled level. Basketball allows real physical play, but the foul rules draw the line at contact that actually interferes with an opponent's ability to play normally.
      $content$,
      3,
      'Rule 34'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-a-foul';`);
};
