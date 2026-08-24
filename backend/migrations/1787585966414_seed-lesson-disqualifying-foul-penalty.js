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
      'What Happens After a Disqualifying Foul?',
      'what-happens-after-a-disqualifying-foul',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# What Happens After a Disqualifying Foul?

A disqualifying foul is a serious violation that results in the offender being removed from the game.

The offender must go to their team's dressing room for the remainder of the game or leave the building.

## Free Throws

The number of free throws depends on the type of disqualifying foul and who committed it.

### Non-Contact Disqualifying Foul

For a non-contact disqualifying foul, the opposing team receives **2 free throws**.

The head coach chooses which opponent takes the free throws.

### Foul on a Player Who Was Not Shooting

If the disqualifying foul involves contact with a player who was not shooting, that player receives **2 free throws**.

### Foul on a Shooter

If the foul occurs while a player is shooting:

- **Made shot** — the basket counts and the shooter receives 1 additional free throw.
- **Missed 2-point shot** — 2 free throws.
- **Missed 3-point shot** — 3 free throws.

The free throws are followed by a throw-in from the designated frontcourt throw-in line.

## Disqualification of Bench Personnel

If certain bench personnel, such as a first assistant coach, substitute, excluded player or accompanying delegation member, are disqualified, the foul can be charged against the head coach as a technical foul.

The applicable penalty includes **2 free throws**.

## What Happens After the Free Throws?

After the free throws, the team that was fouled receives the ball for a throw-in from the designated throw-in line in its frontcourt.

## Why It Matters

A disqualifying foul is more serious than a normal personal, technical or unsportsmanlike foul because the offender is removed from the game.

It is both a disciplinary penalty and a game penalty for the offending team.
      $content$,
      3,
      'Rule 38.3'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-happens-after-a-disqualifying-foul';`);
};
