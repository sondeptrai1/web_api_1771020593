const pool = require('./config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    const connection = await pool.getConnection();

    // Clear existing data
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    await connection.execute('TRUNCATE TABLE reservation_items');
    await connection.execute('TRUNCATE TABLE reservations');
    await connection.execute('TRUNCATE TABLE tables');
    await connection.execute('TRUNCATE TABLE menu_items');
    await connection.execute('TRUNCATE TABLE customers');
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');

    // Seed customers (5 customers)
    const customers = [
      { email: 'customer1@example.com', password: 'password123', full_name: 'Nguyễn Văn A', phone_number: '0912345678', address: '123 Đường ABC, TP.HCM' },
      { email: 'customer2@example.com', password: 'password123', full_name: 'Trần Thị B', phone_number: '0912345679', address: '456 Đường DEF, TP.HCM' },
      { email: 'customer3@example.com', password: 'password123', full_name: 'Lê Văn C', phone_number: '0912345680', address: '789 Đường GHI, TP.HCM' },
      { email: 'admin@example.com', password: 'admin123', full_name: 'Admin User', phone_number: '0987654321', address: 'Admin Office' },
      { email: 'customer4@example.com', password: 'password123', full_name: 'Phạm Thị D', phone_number: '0912345681', address: '321 Đường JKL, TP.HCM' }
    ];

    for (const customer of customers) {
      const hashedPassword = await bcrypt.hash(customer.password, 10);
      const role = customer.email === 'admin@example.com' ? 'admin' : 'customer';
      await connection.execute(
        'INSERT INTO customers (email, password, full_name, phone_number, address, role, loyalty_points) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [customer.email, hashedPassword, customer.full_name, customer.phone_number, customer.address, role, 0]
      );
    }
    console.log('✓ Seeded 5 customers');

    // Seed menu items (20 items)
    const menuItems = [
      // Appetizer (4 items)
      { name: 'Gỏi Cuốn Tôm', description: 'Gỏi cuốn tôm tươi với nước chấm đặc biệt', category: 'Appetizer', price: 50000, preparation_time: 10, is_vegetarian: false, is_spicy: false },
      { name: 'Cánh Gà Nướng', description: 'Cánh gà nướng vàng giòn', category: 'Appetizer', price: 60000, preparation_time: 15, is_vegetarian: false, is_spicy: true },
      { name: 'Gỏi Cuốn Chay', description: 'Gỏi cuốn rau fresh', category: 'Appetizer', price: 40000, preparation_time: 10, is_vegetarian: true, is_spicy: false },
      { name: 'Xiên Nướng', description: 'Xiên nướng thịt bò thơm ngon', category: 'Appetizer', price: 55000, preparation_time: 12, is_vegetarian: false, is_spicy: false },
      
      // Main Course (8 items)
      { name: 'Phở Bò', description: 'Phở bò truyền thống Hà Nội', category: 'Main Course', price: 80000, preparation_time: 20, is_vegetarian: false, is_spicy: false },
      { name: 'Cơm Gà Xối Mỡ', description: 'Cơm gà Hainanese', category: 'Main Course', price: 90000, preparation_time: 15, is_vegetarian: false, is_spicy: false },
      { name: 'Bún Chả', description: 'Bún chả nướng thơm ngon', category: 'Main Course', price: 75000, preparation_time: 18, is_vegetarian: false, is_spicy: true },
      { name: 'Mực Nướng', description: 'Mực nướng mỡ hành', category: 'Main Course', price: 120000, preparation_time: 20, is_vegetarian: false, is_spicy: false },
      { name: 'Cơm Rượu', description: 'Cơm rượu gà thơm lừng', category: 'Main Course', price: 85000, preparation_time: 25, is_vegetarian: false, is_spicy: false },
      { name: 'Tôm Sú Nướng', description: 'Tôm sú nướng với bơ tỏi', category: 'Main Course', price: 180000, preparation_time: 18, is_vegetarian: false, is_spicy: false },
      { name: 'Cơm Rau', description: 'Cơm chiên rau tươi', category: 'Main Course', price: 65000, preparation_time: 12, is_vegetarian: true, is_spicy: false },
      { name: 'Canh Chua Cá', description: 'Canh chua cá basa chua ngon', category: 'Main Course', price: 95000, preparation_time: 22, is_vegetarian: false, is_spicy: false },
      
      // Soup (3 items)
      { name: 'Súp Nấm', description: 'Súp nấm hương thơm', category: 'Soup', price: 45000, preparation_time: 12, is_vegetarian: true, is_spicy: false },
      { name: 'Súp Tôm', description: 'Súp tôm chua cay', category: 'Soup', price: 55000, preparation_time: 15, is_vegetarian: false, is_spicy: true },
      { name: 'Súp Cua', description: 'Súp cua béo ngậy', category: 'Soup', price: 65000, preparation_time: 20, is_vegetarian: false, is_spicy: false },
      
      // Beverage (3 items)
      { name: 'Cà Phê Đen Đá', description: 'Cà phê đen đá vừa', category: 'Beverage', price: 20000, preparation_time: 5, is_vegetarian: true, is_spicy: false },
      { name: 'Nước Cam Ép', description: 'Nước cam ép tươi mỗi ngày', category: 'Beverage', price: 30000, preparation_time: 5, is_vegetarian: true, is_spicy: false },
      { name: 'Nước Chanh Tươi', description: 'Nước chanh tươi thanh mát', category: 'Beverage', price: 25000, preparation_time: 3, is_vegetarian: true, is_spicy: false },
      
      // Dessert (2 items)
      { name: 'Chè Đậu Xanh', description: 'Chè đậu xanh mát lạnh', category: 'Dessert', price: 30000, preparation_time: 3, is_vegetarian: true, is_spicy: false },
      { name: 'Kem Hoa Quả', description: 'Kem hoa quả tươi ngon', category: 'Dessert', price: 40000, preparation_time: 5, is_vegetarian: true, is_spicy: false }
    ];

    for (const item of menuItems) {
      await connection.execute(
        'INSERT INTO menu_items (name, description, category, price, preparation_time, is_vegetarian, is_spicy, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, true)',
        [item.name, item.description, item.category, item.price, item.preparation_time, item.is_vegetarian, item.is_spicy]
      );
    }
    console.log('✓ Seeded 20 menu items');

    // Seed tables (8 tables)
    const tables = [
      { table_number: 'T01', capacity: 2 },
      { table_number: 'T02', capacity: 2 },
      { table_number: 'T03', capacity: 4 },
      { table_number: 'T04', capacity: 4 },
      { table_number: 'T05', capacity: 6 },
      { table_number: 'T06', capacity: 6 },
      { table_number: 'T07', capacity: 8 },
      { table_number: 'T08', capacity: 8 }
    ];

    for (const table of tables) {
      await connection.execute(
        'INSERT INTO tables (table_number, capacity, is_available) VALUES (?, ?, true)',
        [table.table_number, table.capacity]
      );
    }
    console.log('✓ Seeded 8 tables');

    // Seed reservations (10 reservations)
    const now = new Date();
    const reservations = [
      { customerId: 1, date: new Date(now.getTime() + 2*24*60*60*1000), guests: 2, status: 'pending', specialRequests: 'Bàn gần cửa' },
      { customerId: 2, date: new Date(now.getTime() + 3*24*60*60*1000), guests: 4, status: 'confirmed', specialRequests: 'Không cay' },
      { customerId: 1, date: new Date(now.getTime() + 4*24*60*60*1000), guests: 3, status: 'seated', specialRequests: null },
      { customerId: 3, date: new Date(now.getTime() + 1*24*60*60*1000), guests: 2, status: 'completed', specialRequests: 'Tổ chức sinh nhật' },
      { customerId: 2, date: new Date(now.getTime() + 5*24*60*60*1000), guests: 6, status: 'pending', specialRequests: 'Bàn góc' },
      { customerId: 1, date: new Date(now.getTime() + 1*24*60*60*1000), guests: 4, status: 'completed', specialRequests: null },
      { customerId: 3, date: new Date(now.getTime() + 6*24*60*60*1000), guests: 2, status: 'cancelled', specialRequests: 'Đã hủy' },
      { customerId: 2, date: new Date(now.getTime() + 7*24*60*60*1000), guests: 8, status: 'pending', specialRequests: 'Tiệc công ty' },
      { customerId: 5, date: new Date(now.getTime() + 2*24*60*60*1000), guests: 3, status: 'confirmed', specialRequests: null },
      { customerId: 1, date: new Date(now.getTime() + 8*24*60*60*1000), guests: 2, status: 'pending', specialRequests: 'Bàn yên tĩnh' }
    ];

    let resIndex = 1;
    for (const res of reservations) {
      const resNumber = `RES-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(resIndex).padStart(3, '0')}`;
      
      const [result] = await connection.execute(
        'INSERT INTO reservations (customer_id, reservation_number, reservation_date, number_of_guests, status, special_requests) VALUES (?, ?, ?, ?, ?, ?)',
        [res.customerId, resNumber, res.date, res.guests, res.status, res.specialRequests]
      );
      
      const reservationId = result.insertId;

      // Add items to reservation
      const itemsPerReservation = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < itemsPerReservation; i++) {
        const menuItemId = Math.floor(Math.random() * 20) + 1;
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        const [menuItem] = await connection.execute(
          'SELECT price FROM menu_items WHERE id = ?',
          [menuItemId]
        );
        
        if (menuItem.length > 0) {
          await connection.execute(
            'INSERT INTO reservation_items (reservation_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
            [reservationId, menuItemId, quantity, menuItem[0].price]
          );
        }
      }

      // Calculate totals
      const [items] = await connection.execute(
        'SELECT SUM(price * quantity) as subtotal FROM reservation_items WHERE reservation_id = ?',
        [reservationId]
      );

      const subtotal = items[0].subtotal || 0;
      const serviceCharge = subtotal * 0.1;
      const total = subtotal + serviceCharge;

      await connection.execute(
        'UPDATE reservations SET subtotal = ?, service_charge = ?, total = ? WHERE id = ?',
        [subtotal, serviceCharge, total, reservationId]
      );

      resIndex++;
    }
    console.log('✓ Seeded 10 reservations with items');

    connection.release();
    console.log('\n✓ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
