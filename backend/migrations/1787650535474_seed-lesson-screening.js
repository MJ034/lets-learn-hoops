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
      'Screening',
      'screening',
      (SELECT id FROM categories WHERE slug = 'fouls'),
      $content$
# Screening

A screen is when an offensive player positions their body to block a defender's path, helping a teammate get open. It's one of the most fundamental team offense tools in basketball — but it has to be set legally.

## What Makes a Screen Legal

A screener is setting a legal screen when they:
- Are **stationary** (not moving) at the moment contact occurs
- Have **both feet on the floor**

If both of those are true, the responsibility for any resulting contact shifts to the defender who ran into the screen — not the screener.

## What Makes a Screen Illegal

A screen becomes a foul on the screener when they:
- Are **still moving** when the contact happens
- Don't give a defender **enough time or space** to react before setting the screen — especially if the defender couldn't see it coming

## The "Field of Vision" Rule

If a defender is facing the screener and can see it happening, the screener can set up quite close to them, as long as there's no contact. But if the screen is set from behind or outside the defender's line of sight, the screener has to leave enough room for the defender to take at least one normal step before making contact — springing a screen on someone who can't see it isn't allowed.

## Why It Matters

Screens are how offenses create open shots and driving lanes without needing a one-on-one advantage. Understanding legal vs. illegal screening also explains a lot of what looks like "just standing there" on offense — a well-timed, legal screen is often the difference between a wide-open shot and a contested one.
      $content$,
      3,
      'Rule 33, Art. 33.7'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'screening';`);
};
