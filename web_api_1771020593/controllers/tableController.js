const pool = require('../config/database');

const getAllTables = async (req, res, next) => {
  try {
    const { available_only } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM tables';
    const params = [];

    if (available_only === 'true') {
      query += ' WHERE is_available = true';
    }

    const [tables] = await connection.execute(query, params);

    connection.release();

    res.status(200).json({
      success: true,
      data: tables
    });
  } catch (error) {
    next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const { table_number, capacity } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO tables (table_number, capacity, is_available) VALUES (?, ?, true)',
      [table_number, capacity]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: {
        id: result.insertId,
        table_number,
        capacity,
        is_available: true
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { table_number, capacity, is_available } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE tables SET table_number = COALESCE(?, table_number), capacity = COALESCE(?, capacity), is_available = COALESCE(?, is_available) WHERE id = ?',
      [table_number, capacity, is_available, id]
    );

    const [updated] = await connection.execute('SELECT * FROM tables WHERE id = ?', [id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Table updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM tables WHERE id = ?', [id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTables,
  createTable,
  updateTable,
  deleteTable
};
