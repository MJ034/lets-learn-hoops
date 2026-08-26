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
      'What Does a Center Do?',
      'what-does-a-center-do',
      (SELECT id FROM categories WHERE slug = 'positions'),
      $content$
# What Does a Center Do?

The center, or "the five," is typically a team's tallest player, playing closest to the basket on both ends of the court.

## Core Responsibilities

- **Scoring in the post** — centers often score close to the basket, in what's called "the paint" or "the low post"
- **Rebounding** — usually a team's leading rebounder, on both offense and defense
- **Rim protection** — contesting and blocking shots near the basket is a core defensive responsibility
- **Setting screens** — using their size to help teammates get open

## Common Traits

Centers are typically the tallest and often the strongest players on the floor, with good footwork for operating in tight spaces near the basket. Being skilled at jump balls (the opening toss-up that starts a game) is another traditional part of the role, given a center's height advantage.

## How the Position Has Changed

Traditionally, centers stayed close to the basket and relied mostly on size and strength. In more modern basketball, many centers have expanded their game — shooting from further out, handling the ball more, and playing a faster, more mobile style than centers of the past.

## Why the Position Matters

A strong center anchors a team's interior — controlling rebounds, protecting the rim, and creating easy scoring chances close to the basket. When a center draws extra defenders (a "double team"), it can also open up better shots for teammates elsewhere on the court.
      $content$,
      3,
      NULL
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-does-a-center-do';`);
};
