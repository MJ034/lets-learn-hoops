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
      'What Does a Point Guard Do?',
      'what-does-a-point-guard-do',
      (SELECT id FROM categories WHERE slug = 'positions'),
      $content$
# What Does a Point Guard Do?

The point guard is typically the team's primary ball-handler and floor general — the player most responsible for organizing the offense and deciding how a possession unfolds.

## Core Responsibilities

- **Bringing the ball up the court** and initiating offensive plays
- **Distributing the ball** — point guards are usually a team's leading passer, looking to set up teammates for good shots
- **Reading the defense** — recognizing whether to run a set play, push in transition, or attack one-on-one
- **Managing tempo** — controlling how fast or slow a possession moves

## Common Traits

Point guards tend to have strong ball-handling skills, court vision, and decision-making under pressure. Height matters less at this position than at almost any other — some of the best point guards in basketball history have been among the shorter players on the floor, since quickness and vision matter more than size here.

## Not Just a Passer

While distributing is central to the role, point guards are also frequently among a team's best scorers, especially in more modern basketball where lead guards are often expected to score efficiently themselves, not just set up others.

## Why the Position Matters

A team's point guard often sets the tone for how the whole offense functions. A slow, deliberate point guard produces a different style of team than a fast, aggressive one — understanding this position is a good starting point for understanding basketball strategy more broadly.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-does-a-point-guard-do';`);
};
