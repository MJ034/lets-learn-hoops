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
      'What Does a Shooting Guard Do?',
      'what-does-a-shooting-guard-do',
      (SELECT id FROM categories WHERE slug = 'positions'),
      $content$
# What Does a Shooting Guard Do?

The shooting guard, often just called "the two," is typically a team's primary perimeter scoring threat — known for shooting accurately from mid-range and three-point distance.

## Core Responsibilities

- **Scoring from the perimeter** — shooting guards are usually a team's best or second-best three-point shooter
- **Moving without the ball** — since they're not always the one bringing the ball up, a lot of a shooting guard's value comes from finding open space and getting into position for a pass
- **Finishing plays** — converting the scoring chances a point guard or other teammates create

## Common Traits

Shooting guards tend to have quick, reliable shooting mechanics and good court awareness — knowing exactly where they are relative to the three-point line and how to get open. Communication with teammates matters a lot here too, since a shooting guard being open only helps if a teammate knows to pass to them.

## Different Shooting Guard Styles

Not every shooting guard plays the same way. Some are "catch-and-shoot" specialists, relying on screens to get open for a quick jump shot without much dribbling. Others are "slashers," who prefer driving into the lane and scoring near the basket rather than shooting from outside. Many blend the two.

## Why the Position Matters

A strong shooting guard forces the defense to stay spread out — if defenders sag off a good shooter to help elsewhere, they get punished from outside. This is a big part of why floor spacing and outside shooting have become so central to modern basketball strategy.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-does-a-shooting-guard-do';`);
};
