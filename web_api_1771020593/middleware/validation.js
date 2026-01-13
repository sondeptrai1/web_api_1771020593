const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().required(),
  phone_number: Joi.string(),
  address: Joi.string()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const menuItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Soup').required(),
  price: Joi.number().required(),
  image_url: Joi.string(),
  preparation_time: Joi.number(),
  is_vegetarian: Joi.boolean(),
  is_spicy: Joi.boolean()
});

const reservationSchema = Joi.object({
  reservation_date: Joi.date().required(),
  number_of_guests: Joi.number().required(),
  special_requests: Joi.string()
});

const addItemSchema = Joi.object({
  menu_item_id: Joi.number().required(),
  quantity: Joi.number().required()
});

const confirmReservationSchema = Joi.object({
  table_number: Joi.string().required()
});

const paymentSchema = Joi.object({
  payment_method: Joi.string().valid('cash', 'card', 'online').required(),
  use_loyalty_points: Joi.boolean(),
  loyalty_points_to_use: Joi.number()
});

const tableSchema = Joi.object({
  table_number: Joi.string().required(),
  capacity: Joi.number().required()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    req.validated = value;
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  menuItemSchema,
  reservationSchema,
  addItemSchema,
  confirmReservationSchema,
  paymentSchema,
  tableSchema
};
