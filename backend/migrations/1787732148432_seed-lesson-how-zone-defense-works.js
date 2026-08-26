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
      'How Zone Defense Works',
      'how-zone-defense-works',
      (SELECT id FROM categories WHERE slug = 'defense'),
      $content$
# How Zone Defense Works

Zone defense asks each player to guard a specific area of the court rather than a specific opponent. Here's how teams typically organize and play it.

## Common Zone Alignments

Two of the simplest and most widely used zone setups are the **2-1-2** and the **2-3**. Both use four defenders spread across the outside of the defense, which is also the same basic structure used in man-to-man defense and many offensive systems — making these zones a natural starting point for players first learning defensive concepts.

## Core Movement Principles

- **Move as the ball moves.** Defenders shift position the moment the ball leaves the passer's hands, aiming to arrive in their new spot right as the ball is caught by the next player.
- **See the ball and your player.** Defenders try to keep both the ball and their nearest offensive responsibility in view at the same time, rather than watching only one or the other.
- **Keep hands active.** Arms up and moving helps disrupt passing lanes between offensive players.
- **Closest defender takes the ball.** As a general rule, whichever defender is nearest to the ball becomes responsible for guarding it.

## Helping and Rotating

Zone defense relies heavily on defenders helping each other. If an offensive player gets past their defender, a nearby teammate "helps" by stepping in to stop them — which then requires other defenders to rotate and cover whichever area that helping defender just left open. Communication is essential here: even if a rotation isn't executed perfectly, players talking to each other keeps the defense functioning as a coordinated unit rather than five individuals guessing.

## Boxing Out

Since zone defenders don't have a fixed individual opponent, boxing out for rebounds works differently than in man-to-man. When a shot goes up, each defender finds the nearest offensive player to box out, rather than automatically boxing out "their" assigned player.

## Why It Matters

Zone defense done well is a highly coordinated, team-based system — its effectiveness depends less on individual defensive talent and more on communication, discipline, and understanding your role within the structure.
      $content$,
      4,
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'how-zone-defense-works';`);
};
