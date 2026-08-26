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
      'Man-to-Man vs. Zone Defense',
      'man-to-man-vs-zone-defense',
      (SELECT id FROM categories WHERE slug = 'defense'),
      $content$
# Man-to-Man vs. Zone Defense

Every defense in basketball is built around one of two basic philosophies: guarding a specific opponent, or guarding an area of the court.

## Man-to-Man Defense

In man-to-man defense, each defender is assigned one specific opponent to guard, and stays responsible for that player wherever they go on the court. This is usually the first defensive system beginners learn, since it's the most straightforward: your job is to stop your assigned player.

## Zone Defense

In zone defense, each defender is instead responsible for guarding an **area** of the court, not a specific player. As opposing players move through that area, whichever defender's zone they're in takes responsibility for guarding them. Two of the most common zone setups are called **2-1-2** and **2-3**, named after how the defenders are arranged (for example, 2-3 means two defenders up top, three defenders across the back).

## A Common Misconception

Zone defense is sometimes seen as a "lazier" or lower-effort defense compared to man-to-man. That's not true when it's taught and played correctly — zone defense still requires constant movement, communication, and full effort. It's a different structure, not a lower-effort one.

## Key Defensive Questions, Regardless of System

Whether a team plays man-to-man or zone, every defense has to answer the same core questions:
- Who guards the player with the ball, and how does that responsibility shift as the ball is passed?
- Who's responsible for stopping a dribbler from driving to the basket?
- When do defenders "help" a teammate who's been beaten, and when do they rotate back to their own assignment?
- Who boxes out for a rebound when a shot goes up?

## Why It Matters

Understanding the difference between these two systems is one of the most useful things a beginner can learn for actually *watching* basketball — a lot of what looks like confusing defensive movement on TV makes much more sense once you know whether a team is playing man-to-man or zone.
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
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'man-to-man-vs-zone-defense';`);
};
