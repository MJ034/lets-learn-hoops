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
      'What is Basketball?',
      'what-is-basketball',
      (SELECT id FROM categories WHERE slug = 'basketball-basics'),
      $content$
# What is Basketball?

Basketball is a team sport played between two squads of five players each on the court at a time. The core idea is simple: score more points than your opponent by shooting the ball through their basket, while stopping them from doing the same to yours.

## The Objective

Each team attacks one basket and defends the other. Points are scored by shooting the ball through the opponent's hoop, and possession switches back and forth as teams score, turn the ball over, or force a violation.

## Who Runs the Game

A basketball game isn't just the ten players on the court. Officiating includes:

- **Referees** — the officials on the court who call fouls and violations
- **Table officials** — responsible for the scoreboard, game clock, and shot clock
- **A commissioner** — present at higher levels of play, overseeing the officiating team itself

## Why This Matters as a Starting Point

Every other rule in basketball, from traveling to shot clocks to foul limits, exists to support this simple core structure: two teams, one ball, two baskets, and a group of officials keeping the game fair. Once this basic shape is clear, the more detailed rules make a lot more sense.
      $content$,
      2,
      'Rule 1, Art. 1.1'
    );
  `);
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-basketball';`);
};
