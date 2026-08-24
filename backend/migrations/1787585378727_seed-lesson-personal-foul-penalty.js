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
      'What Happens After a Personal Foul?',
      'what-happens-after-a-personal-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What Happens After a Personal Foul?

A personal foul is charged to the player who committed the illegal contact. What happens next depends mainly on whether the player who was fouled was shooting.

## Foul on a Player Who Was Not Shooting

If the fouled player was not in the act of shooting, the non-offending team normally gets the ball from a throw-in at the place nearest to where the foul occurred.

There is one important exception: if the offending team has reached the **team foul penalty situation**, free throws may be awarded instead.

## Foul on a Shooter

When a player is fouled while shooting, the penalty depends on whether the shot goes in and what type of shot it was.

- **Made 2-point or 3-point shot** — the basket counts and the shooter receives 1 additional free throw.
- **Missed 2-point shot** — the shooter receives 2 free throws.
- **Missed 3-point shot** — the shooter receives 3 free throws.

## Foul During a Throw-In

If a player is fouled while their team is taking a throw-in, the fouled player receives **1 free throw**.

After the free throw, the non-offending team resumes play with a throw-in from the place nearest to the foul.

## Why It Matters

Knowing the penalty for a personal foul helps players understand why the referee awards either a throw-in or free throws.

The most important question is simple: **Was the player shooting when the foul happened?**
      $content$,
      3,
      'Rule 34.2'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-happens-after-a-personal-foul';`);
};
