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
      'What is Motion Offense?',
      'what-is-motion-offense',
      (SELECT id FROM categories WHERE slug = 'offense'),
      $content$
# What is Motion Offense?

Motion offense is a style of offense built around continuous player movement, passing, and reading the defense — rather than running a single fixed, pre-set play.

## The Core Idea

Instead of memorizing exact spots to stand and specific plays to run every time, players in a motion offense move according to a set of principles: cutting toward the basket, setting screens for teammates, passing and relocating, and constantly re-spacing the floor. Players read what the defense is doing and react, rather than following a scripted sequence.

## Why Teams Use It

- **Unpredictability** — since the exact sequence of movement isn't fixed, it's harder for a defense to anticipate and prepare for
- **Involves every player** — motion offense tends to keep the ball moving and gives multiple players scoring opportunities, rather than relying on one primary scorer
- **Teaches fundamentals** — because it's built on reading the defense rather than memorizing set plays, motion offense reinforces skills like passing, cutting, and screening that transfer to other systems

## Common Motion Offense Actions

A few building blocks show up repeatedly in motion offenses:
- **Cutting** — moving without the ball toward open space or the basket
- **Screening** — using your body to help a teammate get open, as covered in the Fouls category's screening lesson
- **Passing and relocating** — passing the ball and then moving to a new spot rather than standing still after you pass

## Why It Matters

Motion offense is often one of the first structured offensive systems younger or newer players learn, since it emphasizes fundamentals and decision-making over memorizing complex set plays. Understanding it also helps when watching more advanced levels of basketball, where many "modern" offenses are really more sophisticated versions of the same motion principles.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'what-is-motion-offense';`);
};
