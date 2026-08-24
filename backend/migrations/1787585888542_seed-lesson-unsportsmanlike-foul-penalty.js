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
      'What Happens After an Unsportsmanlike Foul?',
      'what-happens-after-an-unsportsmanlike-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What Happens After an Unsportsmanlike Foul?

An unsportsmanlike foul is a serious type of foul that involves contact or behaviour that does not meet the standards of fair play.

Unlike a normal personal foul, an unsportsmanlike foul normally results in **free throws followed by possession** for the team that was fouled.

## The Penalty

The player who was fouled receives free throws, followed by a throw-in for their team from the designated throw-in line in the frontcourt.

The number of free throws depends on what the fouled player was doing.

### Player Was Not Shooting

If the foul occurred on a player who was not shooting, the player receives **2 free throws**.

### Player Was Shooting

If the player was shooting:

- **Made shot** — the basket counts and the player receives 1 additional free throw.
- **Missed 2-point shot** — 2 free throws.
- **Missed 3-point shot** — 3 free throws.

After the free throws, the fouled player's team receives the ball for a throw-in.

## Multiple Unsportsmanlike Fouls

A player is disqualified from the remainder of the game after being charged with:

- 2 unsportsmanlike fouls
- 2 technical fouls
- 1 technical foul and 1 unsportsmanlike foul

## Why It Matters

An unsportsmanlike foul carries a much heavier penalty than a normal personal foul.

The team receives both **free throws and possession**, making these fouls especially costly.
      $content$,
      3,
      'Rule 37.2'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-happens-after-an-unsportsmanlike-foul';`);
};
