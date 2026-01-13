const pool = require('../config/database');

const createReservation = async (req, res, next) => {
  try {
    const { reservation_date, number_of_guests, special_requests } = req.body;
    const customerId = req.user.id;
    const connection = await pool.getConnection();

    // Generate reservation number
    const now = new Date();
    const [lastRes] = await connection.execute(
      `SELECT reservation_number FROM reservations 
       WHERE DATE(created_at) = CURDATE() 
       ORDER BY created_at DESC LIMIT 1`
    );

    let resNumber;
    if (lastRes.length > 0) {
      const lastNumber = parseInt(lastRes[0].reservation_number.split('-')[2]);
      resNumber = `RES-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      resNumber = `RES-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`;
    }

    const [result] = await connection.execute(
      'INSERT INTO reservations (customer_id, reservation_number, reservation_date, number_of_guests, special_requests, status) VALUES (?, ?, ?, ?, ?, ?)',
      [customerId, resNumber, new Date(reservation_date), number_of_guests, special_requests, 'pending']
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        id: result.insertId,
        reservation_number: resNumber,
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [reservations] = await connection.execute('SELECT * FROM reservations WHERE id = ?', [id]);

    if (reservations.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const [items] = await connection.execute(
      `SELECT ri.*, mi.name, mi.description, mi.category 
       FROM reservation_items ri 
       JOIN menu_items mi ON ri.menu_item_id = mi.id 
       WHERE ri.reservation_id = ?`,
      [id]
    );

    connection.release();

    res.status(200).json({
      success: true,
      data: {
        ...reservations[0],
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

const addItemToReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { menu_item_id, quantity } = req.body;
    const connection = await pool.getConnection();

    // Check if menu item exists and is available
    const [menuItems] = await connection.execute('SELECT * FROM menu_items WHERE id = ?', [menu_item_id]);

    if (menuItems.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const menuItem = menuItems[0];

    if (!menuItem.is_available) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Menu item is not available'
      });
    }

    // Add item to reservation
    await connection.execute(
      'INSERT INTO reservation_items (reservation_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
      [id, menu_item_id, quantity, menuItem.price]
    );

    // Recalculate totals
    const [items] = await connection.execute(
      'SELECT SUM(price * quantity) as subtotal FROM reservation_items WHERE reservation_id = ?',
      [id]
    );

    const subtotal = items[0].subtotal || 0;
    const serviceCharge = subtotal * 0.1;
    const total = subtotal + serviceCharge;

    await connection.execute(
      'UPDATE reservations SET subtotal = ?, service_charge = ?, total = ? WHERE id = ?',
      [subtotal, serviceCharge, total, id]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Item added to reservation',
      data: {
        reservation_id: id,
        menu_item_id,
        quantity,
        subtotal,
        service_charge: serviceCharge,
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

const confirmReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { table_number } = req.body;
    const connection = await pool.getConnection();

    // Check if table is available
    const [tables] = await connection.execute(
      'SELECT * FROM tables WHERE table_number = ?',
      [table_number]
    );

    if (tables.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    const table = tables[0];

    if (!table.is_available) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Table is not available'
      });
    }

    // Get reservation to check capacity
    const [reservations] = await connection.execute('SELECT * FROM reservations WHERE id = ?', [id]);
    const reservation = reservations[0];

    if (table.capacity < reservation.number_of_guests) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Table capacity is not sufficient'
      });
    }

    // Update reservation
    await connection.execute(
      'UPDATE reservations SET status = ?, table_number = ? WHERE id = ?',
      ['confirmed', table_number, id]
    );

    // Update table availability
    await connection.execute('UPDATE tables SET is_available = false WHERE id = ?', [table.id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Reservation confirmed',
      data: {
        id,
        status: 'confirmed',
        table_number
      }
    });
  } catch (error) {
    next(error);
  }
};

const payReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_method, use_loyalty_points, loyalty_points_to_use } = req.body;
    const connection = await pool.getConnection();

    // Get reservation
    const [reservations] = await connection.execute('SELECT * FROM reservations WHERE id = ?', [id]);

    if (reservations.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const reservation = reservations[0];

    if (reservation.status !== 'seated') {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Reservation must be seated to pay'
      });
    }

    // Get customer
    const [customers] = await connection.execute('SELECT * FROM customers WHERE id = ?', [reservation.customer_id]);
    const customer = customers[0];

    let discount = 0;
    let pointsUsed = 0;

    if (use_loyalty_points && loyalty_points_to_use) {
      // 1 point = 1000 VND, max 50% of total
      const maxDiscount = reservation.total * 0.5;
      discount = Math.min(loyalty_points_to_use * 1000, maxDiscount);
      pointsUsed = discount / 1000;

      if (pointsUsed > customer.loyalty_points) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Insufficient loyalty points'
        });
      }
    }

    const totalAfterDiscount = reservation.total - discount;
    const loyaltyPointsGained = Math.floor(totalAfterDiscount * 0.01); // 1% of total

    // Update reservation
    await connection.execute(
      'UPDATE reservations SET status = ?, payment_status = ?, payment_method = ?, discount = ?, total = ? WHERE id = ?',
      ['completed', 'paid', payment_method, discount, totalAfterDiscount, id]
    );

    // Update customer loyalty points
    const newLoyaltyPoints = customer.loyalty_points - pointsUsed + loyaltyPointsGained;
    await connection.execute(
      'UPDATE customers SET loyalty_points = ? WHERE id = ?',
      [newLoyaltyPoints, reservation.customer_id]
    );

    // Release table
    if (reservation.table_number) {
      await connection.execute(
        'UPDATE tables SET is_available = true WHERE table_number = ?',
        [reservation.table_number]
      );
    }

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        id,
        status: 'completed',
        payment_status: 'paid',
        total: totalAfterDiscount,
        discount,
        loyalty_points_used: pointsUsed,
        loyalty_points_gained: loyaltyPointsGained
      }
    });
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Get reservation
    const [reservations] = await connection.execute('SELECT * FROM reservations WHERE id = ?', [id]);

    if (reservations.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const reservation = reservations[0];
    const allowedStatuses = ['pending', 'confirmed'];

    if (!allowedStatuses.includes(reservation.status) && req.user.role !== 'admin') {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending or confirmed reservations'
      });
    }

    // Update reservation
    await connection.execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      ['cancelled', id]
    );

    // Release table if confirmed
    if (reservation.status === 'confirmed' && reservation.table_number) {
      await connection.execute(
        'UPDATE tables SET is_available = true WHERE table_number = ?',
        [reservation.table_number]
      );
    }

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled',
      data: {
        id,
        status: 'cancelled'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservationById,
  addItemToReservation,
  confirmReservation,
  payReservation,
  cancelReservation
};
