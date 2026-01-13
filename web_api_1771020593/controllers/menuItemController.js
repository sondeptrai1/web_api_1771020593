const pool = require('../config/database');

const getAllMenuItems = async (req, res, next) => {
  try {
    const { search, category, vegetarian_only, spicy_only, available_only, page = 1, limit = 10 } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (vegetarian_only === 'true') {
      query += ' AND is_vegetarian = true';
    }

    if (spicy_only === 'true') {
      query += ' AND is_spicy = true';
    }

    if (available_only === 'true') {
      query += ' AND is_available = true';
    }

    const countResult = await connection.execute(`SELECT COUNT(*) as total FROM menu_items WHERE 1=1 ${query.replace('SELECT * FROM menu_items WHERE 1=1', '')}`, params);
    const total = countResult[0][0].total;

    query += ' LIMIT ?, ?';
    params.push((page - 1) * limit, parseInt(limit));

    const [items] = await connection.execute(query, params);

    connection.release();

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [items] = await connection.execute('SELECT * FROM menu_items WHERE id = ?', [id]);

    connection.release();

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: items[0]
    });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, category, price, image_url, preparation_time, is_vegetarian, is_spicy } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO menu_items (name, description, category, price, image_url, preparation_time, is_vegetarian, is_spicy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, price, image_url, preparation_time, is_vegetarian || false, is_spicy || false]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        id: result.insertId,
        ...req.body
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image_url, preparation_time, is_vegetarian, is_spicy, is_available } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE menu_items SET name = COALESCE(?, name), description = COALESCE(?, description), category = COALESCE(?, category), price = COALESCE(?, price), image_url = COALESCE(?, image_url), preparation_time = COALESCE(?, preparation_time), is_vegetarian = COALESCE(?, is_vegetarian), is_spicy = COALESCE(?, is_spicy), is_available = COALESCE(?, is_available) WHERE id = ?',
      [name, description, category, price, image_url, preparation_time, is_vegetarian, is_spicy, is_available, id]
    );

    const [updated] = await connection.execute('SELECT * FROM menu_items WHERE id = ?', [id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Check if item is in active reservations
    const [reservationItems] = await connection.execute(
      `SELECT ri.* FROM reservation_items ri 
       JOIN reservations r ON ri.reservation_id = r.id 
       WHERE ri.menu_item_id = ? AND r.status NOT IN ('completed', 'cancelled')`,
      [id]
    );

    if (reservationItems.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item - it is in active reservations'
      });
    }

    await connection.execute('DELETE FROM menu_items WHERE id = ?', [id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const searchMenuItems = async (req, res, next) => {
  try {
    const { q } = req.query;
    const connection = await pool.getConnection();

    const [items] = await connection.execute(
      `SELECT * FROM menu_items WHERE name LIKE ? OR description LIKE ? OR category LIKE ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    connection.release();

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems
};
