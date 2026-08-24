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
      'The Cylinder Principle',
      'the-cylinder-principle',
      (SELECT id FROM categories WHERE slug = 'rules-and-violations'),
      $content$
# The Cylinder Principle

The cylinder principle is the foundation for almost every foul call involving player contact — it defines the personal space each player is legally entitled to on the court.

## What is "The Cylinder"?

Imagine an invisible cylinder surrounding each player, matching their own body width and reaching from the floor to the ceiling above them.

This cylinder is bounded by their hands in front, their backside behind them, and the outer edges of their arms and legs on the sides.

## The Core Idea

A player is entitled to occupy their own cylinder — including the space directly above them when jumping straight up.

An opponent who enters that space and causes contact is generally responsible for it.

## Verticality

This is why you'll hear commentators talk about "verticality" on defense: a defender who jumps straight up within their own cylinder, arms raised, isn't fouling — even if an offensive player runs into them.

But the moment a defender leans, reaches, or drifts outside their own cylinder and causes contact, responsibility shifts to them.

## Why It Matters

Nearly every contact-related call — charging, blocking, illegal use of hands — comes back to this one idea: stay in your own space, and moving into someone else's space is usually on you.

Once you can picture the cylinder, a lot of foul calls that look random on TV start making a lot more sense.
      $content$,
      3,
      'Rule 32'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DELETE FROM learning_modules WHERE slug = 'the-cylinder-principle';`);
};
