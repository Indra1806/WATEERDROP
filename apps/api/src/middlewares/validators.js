import { body, param, validationResult } from 'express-validator';

// Common function to handle validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Login validation
export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Order creation validation
export const createOrderValidation = [
  body('products').isArray({ min: 1 }).withMessage('Products array is required'),
  body('products.*.productId').isMongoId().withMessage('Valid productId is required'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Order status update validation
export const updateStatusValidation = [
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('status').isIn(['pending', 'delivered', 'cancelled']).withMessage('Invalid status value'),
];
