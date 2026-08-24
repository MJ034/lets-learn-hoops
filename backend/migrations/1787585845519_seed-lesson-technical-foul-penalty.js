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
      'What Happens After a Technical Foul?',
      'what-happens-after-a-technical-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What Happens After a Technical Foul?

A technical foul is a non-contact foul that is usually related to unsportsmanlike or improper behaviour.

The penalty is different depending on who committed the technical foul.

## Technical Foul by a Player

If a player commits a technical foul, it is charged to that player and also counts as one of their team's team fouls.

The opposing team receives **1 free throw**.

## Technical Foul by the Bench

If a technical foul is committed by someone permitted to sit on the team bench, such as a coach, substitute or other bench personnel, the technical foul is charged against the **head coach**.

It does not count as one of the team's team fouls.

## How Play Resumes

The free throw is administered immediately.

After the free throw, play normally resumes with the team that had control of the ball, or was entitled to it, receiving the ball from the place where play was interrupted or the appropriate throw-in location.

The exact restart can also depend on what happened immediately before the technical foul.

## What if There Was No Team in Control?

If neither team had control of the ball or was entitled to it when the technical foul occurred, the game resumes with a jump ball situation.

## Why It Matters

Technical fouls are different from personal fouls because they don't require illegal physical contact.

They can result from behaviour such as disrespecting the game, delaying play, or other actions that violate the rules of conduct.
      $content$,
      3,
      'Rule 36.3'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-happens-after-a-technical-foul';`);
};
