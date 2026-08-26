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
      'Offensive Spacing Basics',
      'offensive-spacing-basics',
      (SELECT id FROM categories WHERE slug = 'offense'),
      $content$
# Offensive Spacing Basics

Spacing is one of the most fundamental ideas in basketball offense — how players position themselves relative to each other and the basket to create room to operate.

## What Spacing Means

Good spacing means offensive players are spread out across the court rather than clustered together. When players stand too close to one another, a single defender can effectively guard two offensive players at once, and driving lanes to the basket disappear.

## Why Spread Out Helps

- **Driving lanes open up** — if defenders are spread thin covering the whole floor, there's more room for a ball-handler to drive to the basket
- **Passing gets easier** — well-spaced players give the ball-handler clearer passing lanes rather than crowded, easily-deflected ones
- **Defenses face harder choices** — a spread-out offense forces defenders to decide between guarding their assigned player tightly or leaving them open to help elsewhere on the court

## The Role of Shooting

Outside shooting and spacing go hand in hand. If a player standing away from the basket is a real shooting threat, their defender has to stay close to them — which keeps that defender from helping elsewhere and keeps the floor open. A player who isn't a shooting threat is easier for the defense to ignore, which can shrink the available space for everyone else.

## A Simple Way to Picture It

Imagine dividing the offensive half of the court into sections, with one offensive player generally responsible for occupying each section rather than everyone drifting into the same area. This basic idea — spread out, give each other room — underlies almost every more advanced offensive system in basketball.

## Why It Matters

Spacing isn't flashy, but it's foundational. Even the most talented individual scorer struggles in a poorly spaced offense, since there's simply nowhere to operate. Understanding spacing is a good first step toward understanding *why* an offense is working or breaking down.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'offensive-spacing-basics';`);
};
