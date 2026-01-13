const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabaseAndTables = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
  });

  try {
    // Create database
    const dbName = process.env.DATABASE_NAME || 'db_exam_1771020519';
    await conn.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbName}`
    );
    console.log('Database created successfully');

    // Close and reconnect to the new database
    await conn.end();
    
    const connWithDb = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: dbName,
    });

    // Create customers table
    await connWithDb.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        address TEXT,
        loyalty_points INT DEFAULT 0,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('customers table created');

    // Create menu_items table
    await connWithDb.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category ENUM('Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Soup') NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        preparation_time INT,
        is_vegetarian BOOLEAN DEFAULT false,
        is_spicy BOOLEAN DEFAULT false,
        is_available BOOLEAN DEFAULT true,
        rating DECIMAL(3, 1) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('menu_items table created');

    // Create tables table
    await connWithDb.execute(`
      CREATE TABLE IF NOT EXISTS tables (
        id INT PRIMARY KEY AUTO_INCREMENT,
        table_number VARCHAR(10) UNIQUE NOT NULL,
        capacity INT NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('tables table created');

    // Create reservations table
    await connWithDb.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        reservation_number VARCHAR(50) UNIQUE NOT NULL,
        reservation_date TIMESTAMP NOT NULL,
        number_of_guests INT NOT NULL,
        table_number VARCHAR(10),
        status ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
        special_requests TEXT,
        subtotal DECIMAL(10, 2) DEFAULT 0,
        service_charge DECIMAL(10, 2) DEFAULT 0,
        discount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) DEFAULT 0,
        payment_method ENUM('cash', 'card', 'online'),
        payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
        INDEX (customer_id),
        INDEX (reservation_number)
      )
    `);
    console.log('reservations table created');

    // Create reservation_items table
    await connWithDb.execute(`
      CREATE TABLE IF NOT EXISTS reservation_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        reservation_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
        INDEX (reservation_id),
        INDEX (menu_item_id)
      )
    `);
    console.log('reservation_items table created');

    console.log('All tables created successfully!');
    await connWithDb.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating database or tables:', error);
    process.exit(1);
    process.exit(1);
  }
};

createDatabaseAndTables();
