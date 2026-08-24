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
      'The Three-Second Rule',
      'the-three-second-rule',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# The Three-Second Rule

The three-second rule limits how long an offensive player can stand inside the opponent's restricted area — commonly called "the paint" or "the key."

## The Basic Rule

A player can't stay in the opponent's restricted area for more than **three consecutive seconds** while their team is on offense, has control of a live ball in the frontcourt, and the game clock is running.

## Exceptions — When It's Not a Violation

A few situations are allowed even if a player is technically in the area for a moment longer:

- **Actively trying to leave** the restricted area before the count expires
- **In the act of shooting** — if the player (or a teammate) is releasing a shot, or the ball has just left their hands for a shot attempt, that moment doesn't count against them
- **Dribbling in to shoot** — if a player enters the area with less than three seconds already elapsed and drives in to attempt a shot, that's legal

## What Counts as "Leaving" the Area

This is a detail worth knowing: a player isn't considered outside the restricted area until **both feet** are planted on the court outside it. One foot out and one foot still inside still counts as being in the area.

## Why It Exists

Without this rule, a tall offensive player could simply camp near the basket, making scoring and offensive rebounding far too easy. The three-second rule forces movement and spacing — part of why you see offensive players constantly cutting in and out of the paint rather than parking near the rim.

## Related Note

There's a separate *defensive* three-second rule too — a defender can't stay in the paint for more than three seconds without actively guarding an opponent. That's a different violation with its own logic, worth its own lesson.
      $content$,
      3,
      'Rule 26'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'the-three-second-rule';`);
};
