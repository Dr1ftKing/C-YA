exports.up = (pgm) => {
  // Create users table
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    birthday: { type: 'date', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create proposals table
  pgm.createTable('proposals', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    date_range_start: { type: 'date', notNull: true },
    date_range_end: { type: 'date', notNull: true },
    creator_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    num_slots: { type: 'integer', notNull: true },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create slots table
  pgm.createTable('slots', {
    id: 'id',
    proposal_id: {
      type: 'integer',
      notNull: true,
      references: 'proposals',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    has_account: { type: 'boolean', notNull: true, default: false },
    claimed_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create availability_entries table
  pgm.createTable('availability_entries', {
    id: 'id',
    slot_id: {
      type: 'integer',
      notNull: true,
      references: 'slots',
      onDelete: 'CASCADE'
    },
    date: { type: 'date', notNull: true },
    busy_times: { type: 'jsonb' }, // Array of {start: "14:00", end: "16:00"}
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create availability_history table for tracking changes
  pgm.createTable('availability_history', {
    id: 'id',
    slot_id: {
      type: 'integer',
      notNull: true,
      references: 'slots',
      onDelete: 'CASCADE'
    },
    date: { type: 'date', notNull: true },
    busy_times: { type: 'jsonb' },
    action: { type: 'varchar(50)', notNull: true }, // 'created', 'updated', 'deleted'
    changed_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create session table for express-session
  pgm.createTable('session', {
    sid: { type: 'varchar', notNull: true, primaryKey: true },
    sess: { type: 'json', notNull: true },
    expire: { type: 'timestamp(6)', notNull: true }
  });

  pgm.createIndex('session', 'expire');
};

exports.down = (pgm) => {
  pgm.dropTable('availability_history');
  pgm.dropTable('availability_entries');
  pgm.dropTable('slots');
  pgm.dropTable('proposals');
  pgm.dropTable('session');
  pgm.dropTable('users');
};