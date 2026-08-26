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
      'Timing Violations: 5, 8, 14, and 24 Seconds',
      'timing-violations-5-8-14-24-seconds',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# Timing Violations: 5, 8, 14, and 24 Seconds

Beyond the three-second rule, basketball has several other timing violations that keep the game moving and prevent teams from stalling. Enforcement of some of these varies by competition level — leagues for younger or recreational players often relax or skip some of them.

## 5 Seconds — Closely Guarded

If an offensive player holding or dribbling the ball is being closely guarded by a defender, they have **5 seconds** to pass, shoot, or dribble past that defender. This prevents a player from simply standing still and running out the clock while under pressure.

## 8 Seconds — Backcourt to Frontcourt

Once an offensive team gains possession in their own backcourt, they have **8 seconds** to advance the ball across the center line into the frontcourt. Failing to do so in time is a violation, and possession goes to the other team.

## 24 Seconds — The Shot Clock

When a team gains possession of the ball, they have **24 seconds** to attempt a shot. This is basketball's core pace-of-play rule — without it, a team could simply hold the ball indefinitely rather than trying to score.

## 14 Seconds — After an Offensive Rebound

If the offensive team grabs their own missed shot (an offensive rebound), the shot clock doesn't fully reset to 24 — instead, they get a shorter **14 seconds** to attempt another shot. This keeps offensive rebounds from being used to simply restart a full 24-second clock over and over.

## Why These Rules Exist

Every one of these violations serves the same underlying purpose: keeping the game moving. Without timing rules, a team with a lead could simply hold onto the ball and run out the game clock, making for a much less competitive and less watchable sport. Together with the three-second rule, these timing violations are what give basketball its constant pace and pressure.
      $content$,
      3,
      'Rule 27-29'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'timing-violations-5-8-14-24-seconds';`);
};
