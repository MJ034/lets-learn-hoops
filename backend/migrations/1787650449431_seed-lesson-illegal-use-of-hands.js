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
      'Illegal Use of Hands',
      'illegal-use-of-hands',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# Illegal Use of Hands

Touching an opponent isn't automatically a foul in basketball — contact happens constantly in a normal game. What matters is whether that contact actually restricts the other player's freedom of movement.

## The Core Test

Referees ask one question: did the contact give the fouling player an advantage by limiting their opponent's ability to move, play the ball, or get to a position they were trying to reach? If yes, it's a foul. Incidental, non-restricting contact usually isn't called.

## Common Illegal Hand Fouls

- **Repeated touching or "jabbing"** an opponent, even lightly, since it can lead to rougher play
- **Placing a hand or arm on an opponent and keeping it there** while guarding, to slow their progress
- **"Hooking"** — wrapping an arm around a defender to gain position or leverage
- **"Pushing off"** — using a hand or arm to create separation from a defender, whether or not you have the ball

## It Goes Both Ways

This isn't just a defensive issue — offensive players can foul with their hands too. Pushing off to get open for a pass, extending an arm while dribbling to keep a defender away from the ball, or shoving a defender to create driving space are all fouls on the offense, even though people tend to associate "illegal contact" with defense first.

## Why It Matters

This rule protects the flow of the game — without it, physical hand-fighting would dominate over actual skill and positioning. Understanding it also explains why some contact that looks aggressive on TV doesn't get called: it's about restriction, not just touching.
      $content$,
      3,
      'Rule 33, Art. 33.11'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'illegal-use-of-hands';`);
};
