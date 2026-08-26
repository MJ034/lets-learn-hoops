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
      'What Does a Power Forward Do?',
      'what-does-a-power-forward-do',
      (SELECT id FROM categories WHERE slug = 'positions'),
      $content$
# What Does a Power Forward Do?

The power forward, or "the four," typically plays closer to the basket than a small forward but with more offensive range than a traditional center — often described as a bridge between the two positions.

## Core Responsibilities

- **Scoring near the basket** — power forwards are frequently a team's most reliable scorer in the post (close to the hoop), while also capable of hitting mid-range jump shots
- **Rebounding** — a major part of the role, on both ends of the court
- **Interior defense** — using footwork and positioning to contest shots and prevent easy scores near the rim

## Common Traits

Power forwards are generally strong and physical, with good footwork in tight spaces. Some power forwards extend their shooting range out to the three-point line — this style is often called a "stretch four," since it stretches the defense by forcing a defender to guard them further from the basket than a traditional power forward would demand.

## Power Forward vs. Center

The two positions overlap a lot. A taller power forward might play some minutes at center depending on matchups, and the two roles are often grouped together as a team's "big men" or "front court."

## Why the Position Matters

A good power forward gives a team scoring and rebounding close to the basket while still offering more mobility and shooting range than a traditional center — making them a flexible piece in both half-court offense and defense.
      $content$,
      3,
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-does-a-power-forward-do';`);
};
