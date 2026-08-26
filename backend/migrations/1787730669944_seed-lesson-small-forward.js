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
      'What Does a Small Forward Do?',
      'what-does-a-small-forward-do',
      (SELECT id FROM categories WHERE slug = 'positions'),
      $content$
# What Does a Small Forward Do?

The small forward, or "the three," is often considered the most versatile position on the floor — expected to contribute across scoring, rebounding, ball-handling, and defense.

## Core Responsibilities

- **Scoring in multiple ways** — small forwards often combine outside shooting with the ability to drive and finish near the basket
- **Rebounding** — while not usually a team's primary rebounder, small forwards are expected to contribute on the boards more than guards typically do
- **Defensive versatility** — often tasked with guarding a range of opponents, from quicker guards to bigger forwards

## Common Traits

Because the role demands a bit of everything, small forwards tend to be well-rounded athletes — a mix of the shooting touch you'd expect from a guard and the size and strength closer to a forward's build. This versatility is part of why the position is sometimes described as needing to do "a little bit of everything."

## Where It Overlaps With Other Positions

Small forward often blends with shooting guard on the perimeter (both are sometimes grouped as "wings"), and a taller, stronger small forward might shift into power forward duties depending on the matchup or team need.

## Why the Position Matters

A strong small forward gives a team flexibility — someone who can create their own shot, guard multiple positions, and adapt to whatever the game demands, rather than being locked into one narrow role.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-does-a-small-forward-do';`);
};
