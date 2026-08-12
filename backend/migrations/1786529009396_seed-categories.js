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
    INSERT INTO categories (name, slug) VALUES
      ('Basketball Basics', 'basketball-basics'),
      ('Rules and Violations', 'rules-and-violations'),
      ('Fouls', 'fouls'),
      ('Positions', 'positions'),
      ('Offense', 'offense'),
      ('Defense', 'defense'),
      ('Skills Development', 'skills-development');
  `);
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM categories WHERE slug IN (
      'basketball-basics', 'rules-and-violations', 'fouls',
      'positions', 'offense', 'defense', 'skills-development'
    );
  `);
};
