const pool = require('../config/database');

const getAllCustomers = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();

    const [customers] = await connection.execute(
      'SELECT id, email, full_name, phone_number, address, loyalty_points, is_active FROM customers WHERE role = ?',
      ['customer']
    );

    connection.release();

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [customers] = await connection.execute(
      'SELECT id, email, full_name, phone_number, address, loyalty_points, is_active FROM customers WHERE id = ?',
      [id]
    );

    connection.release();

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customers[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone_number, address } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE customers SET full_name = COALESCE(?, full_name), phone_number = COALESCE(?, phone_number), address = COALESCE(?, address) WHERE id = ?',
      [full_name, phone_number, address, id]
    );

    const [updated] = await connection.execute(
      'SELECT id, email, full_name, phone_number, address, loyalty_points FROM customers WHERE id = ?',
      [id]
    );

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerReservations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM reservations WHERE customer_id = ?';
    const params = [id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ?, ?';
    params.push((page - 1) * limit, parseInt(limit));

    const [reservations] = await connection.execute(query, params);

    // Get items for each reservation
    for (const res of reservations) {
      const [items] = await connection.execute(
        `SELECT ri.*, mi.name, mi.description, mi.category 
         FROM reservation_items ri 
         JOIN menu_items mi ON ri.menu_item_id = mi.id 
         WHERE ri.reservation_id = ?`,
        [res.id]
      );
      res.items = items;
    }

    connection.release();

    res.status(200).json({
      success: true,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerReservations
};
