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
    UPDATE learning_modules
    SET category_id = (SELECT id FROM categories WHERE slug = 'fouls')
    WHERE slug IN (
      'what-is-a-foul',
      'charging-vs-blocking',
      'the-cylinder-principle'
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    UPDATE learning_modules
    SET category_id = (SELECT id FROM categories WHERE slug = 'rules-and-violations')
    WHERE slug IN (
      'what-is-a-foul',
      'charging-vs-blocking',
      'the-cylinder-principle'
    );
  `);
};