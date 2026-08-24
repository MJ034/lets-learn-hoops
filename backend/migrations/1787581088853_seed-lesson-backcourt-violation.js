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
      'What is a Backcourt Violation?',
      'what-is-a-backcourt-violation',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# What is a Backcourt Violation?

A backcourt violation happens when a team illegally sends the ball back into its own backcourt after it's already advanced to the frontcourt.

## The Rule

Once your team establishes control of the ball in the frontcourt (the half of the court with the opponent's basket), you can't be the last team to touch the ball before it crosses back over the center line into your own backcourt. If you do, the violation is called and the ball goes to the opposing team.

## A Common Example

A player dribbles the ball into the frontcourt, then gets pressured and dribbles it back over the center line to escape a defender. That's a backcourt violation — once you're in, you can't go back.

## What Doesn't Count as a Violation

If a *defender* is the one who deflects or knocks the ball into the backcourt, the offensive team is generally allowed to recover it without penalty — the rule is about the offensive team voluntarily sending the ball backward, not about any ball crossing the line at all.

## Why It Matters

This rule prevents a team from simply retreating with the ball whenever they're under defensive pressure, which keeps the game moving forward rather than allowing stalling near mid-court.
      $content$,
      3,
      'Rule 30'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-a-backcourt-violation';`);
};
