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
      'What is a Double Dribble?',
      'what-is-a-double-dribble',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# What is a Double Dribble?

A double dribble happens when a player illegally handles the ball during dribbling — one of the most common violations for beginners to accidentally commit.

## The Two Ways It Happens

**1. Dribbling with both hands at once.** You can only advance the ball by bouncing it with one hand at a time. Simultaneously pushing the ball down with both hands counts as a double dribble.

**2. Stopping your dribble, then starting again.** Once you catch the ball with one or both hands and let it come to rest, your dribble has ended. Picking it back up and dribbling again — without a shot attempt, an opponent's touch, or a pass in between — is a double dribble.

## A Detail Worth Knowing

While the ball is in the air (mid-bounce, not in your hands), there's no limit on how many steps you can take. The restriction is about handling the ball with your hand, not about movement itself.

## What Doesn't Count as a Double Dribble

- A shot attempt at the basket, even if it misses — this resets things
- An opponent touching or deflecting the ball
- A pass, or a fumble that another player touches before you regain it

An accidental fumble that *you* recover yourself — without anyone else touching it — does **not** reset your dribble the way those other situations do.

## Why It Matters

Double dribble rules exist to keep the game moving and prevent a player from holding or restarting possession indefinitely. It rewards continuous, skillful ball-handling over stopping and restarting at will.
      $content$,
      3,
      'Rule 24, Art. 24.1-24.2'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-a-double-dribble';`);
};
