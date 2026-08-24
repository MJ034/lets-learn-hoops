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
      'Charging vs. Blocking',
      'charging-vs-blocking',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# Charging vs. Blocking

Charging and blocking are two of the most commonly confused calls in basketball. Both involve a collision between an offensive and defensive player, but the rule decides who's at fault based on positioning, not who hit whom harder.

## Charging

Charging is illegal contact caused by an offensive player pushing or moving into a defender's torso. It's called on the **offensive** player.

## Blocking

Blocking is illegal contact that impedes an opponent's progress, called on the **defensive** player — typically because that defender didn't get into position legally before the contact happened.

## The Deciding Factor: Who Got There First

The key question referees ask is: did the defender establish a **legal guarding position** before the contact occurred?

A defender has done this by facing the offensive player with both feet on the floor. Once established, the defender is even allowed to jump straight up, or move sideways or backward, and still be considered legally positioned.

If the defender got into position first and stayed there, contact from the driving offensive player is a **charge**.

If the defender was still moving into position, or moving toward the offensive player rather than staying put, contact is usually a **block**.

## The No-Charge Semi-Circle

Near the basket, there's a marked semi-circle area where a different rule applies: if an offensive player is airborne, in control of the ball, and attempting a shot or pass, contact with a defender standing inside that semi-circle generally won't be called a charge — even if the defender was technically in position.

This protects players attacking the rim from a defender camping directly under the basket.

## Why It Matters

This is genuinely one of the harder calls in basketball, even for experienced referees, because it happens fast and hinges on split-second positioning.

Understanding the **"who got there first, and were they moving?"** logic is the key to reading these plays as a viewer or player.
      $content$,
      3,
      'Rule 33'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'charging-vs-blocking';`);
};
