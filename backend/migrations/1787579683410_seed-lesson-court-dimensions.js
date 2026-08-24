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
      'Basketball Court Dimensions',
      'basketball-court-dimensions',
      (SELECT id FROM categories WHERE slug = 'basketball-basics'),
      $content$
# Basketball Court Dimensions

Every FIBA-sanctioned basketball court follows the same standard layout, so players and coaches know exactly what to expect no matter where a game is played.

## Court Size

The playing surface itself measures **28 meters long by 15 meters wide**, measured from the inside edge of the boundary lines. It needs to be flat, hard, and completely clear of obstructions.

## The Buffer Zone Around the Court

Beyond the court itself, there's a required clear area — at least **2 meters wide** — surrounding the playing surface. This means the total space needed for a regulation game (court plus buffer) is at least 32 meters long and 19 meters wide. Coaches, substitutes, and bench personnel all have to stay outside that 2-meter buffer while play is live.

## Backcourt vs. Frontcourt

Every team's half of the court has a name depending on which basket it's near:

- **Backcourt** — the half containing your *own* basket. This is the territory you're defending.
- **Frontcourt** — the half containing the *opponent's* basket. This is where you're trying to score.

The center line marks the boundary between the two, and it actually counts as part of the backcourt — worth knowing, since this matters for backcourt violations (more on that in a separate lesson).

## Key Markings on the Court

- **Boundary lines** — the outer edges (endlines and sidelines) that define the court. The ball is out of bounds once it crosses these.
- **Center circle** — the circle at mid-court, with a radius of 1.80 m, where jump balls start the game.
- **Free-throw semi-circles** — half-circles at each end, also with a 1.80 m radius, centered on the free-throw line.

## Why It Matters

Understanding court zones isn't just trivia — knowing your backcourt from your frontcourt is essential for understanding violations like the 8-second backcourt rule, and knowing where the boundary lines are is the difference between a live ball and an out-of-bounds turnover.
      $content$,
      3,
      'Rule 2, Art. 2.1-2.5'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`DELETE FROM learning_modules WHERE slug = 'basketball-court-dimensions';`);
};
