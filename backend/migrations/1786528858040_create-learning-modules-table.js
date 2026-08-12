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
  pgm.createTable('learning_modules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    slug: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    category_id: {
      type: 'uuid',
      notNull: true,
      references: 'categories',
      onDelete: 'RESTRICT',
    },
    content: {
      type: 'text',
      notNull: true, // Markdown
    },
    reading_time: {
      type: 'integer',
      notNull: true, // minutes, set manually per lesson
    },
    fiba_rule_reference: {
      type: 'varchar(50)',
      notNull: false, // e.g. "Rule 24, Art. 24.1" — null for original content (Positions, Skills, etc.)
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('learning_modules', 'category_id');
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('learning_modules');
};
