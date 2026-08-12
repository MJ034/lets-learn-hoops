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
      'What is a Travel?',
      'what-is-a-travel',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# What is a Travel?

Traveling is one of the most common violations in basketball. It happens when a player holding the ball moves one or both feet illegally, without dribbling.

## The Pivot Foot

When you catch or pick up the ball while standing still, you establish a **pivot foot**. That foot must stay in contact with the floor. You can pivot around it, lifting and turning on it, but the moment you lift it and put it back down without releasing the ball to dribble, pass, or shoot, that's traveling.

## Common Traveling Situations

- Taking an extra step before starting your dribble
- Sliding or dragging your pivot foot across the floor
- Lifting your pivot foot and returning it to the floor while still holding the ball
- Taking more than the allowed steps while gathering the ball after you've stopped dribbling

## Gathering the Ball

Under FIBA rules, once you stop dribbling and gather the ball, you're allowed **two steps** before you must pass, shoot, or stop. A common beginner mistake is taking a third step, which results in a traveling call.

## Why It Matters

Traveling gives possession to the other team. Understanding your pivot foot and step count is one of the first fundamentals every player needs before moving on to more advanced footwork like Euro steps or pivots off a jump stop.
      $content$,
      3,
      'Rule 24'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-a-travel';`);
};
