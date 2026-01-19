const validator = require('validator');

// Sanitize input to prevent injection attacks
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

// Validate registration input
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(sanitizeInput(email))) {
    errors.email = 'Invalid email format';
  }

  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one number';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  // Sanitize inputs
  req.body.email = sanitizeInput(email).toLowerCase();
  next();
};

// Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email) {
    errors.email = 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  req.body.email = sanitizeInput(email).toLowerCase();
  next();
};

// Validate task input
const validateTask = (req, res, next) => {
  const { title, description, dueDate } = req.body;
  const errors = {};

  // Title validation
  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  // Description validation (optional)
  if (description && description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  // Due date validation (optional)
  if (dueDate && !validator.isISO8601(dueDate)) {
    errors.dueDate = 'Invalid date format';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  // Sanitize inputs
  if (title) req.body.title = sanitizeInput(title);
  if (description) req.body.description = sanitizeInput(description);

  next();
};

// Validate task update (all fields optional)
const validateTaskUpdate = (req, res, next) => {
  const { title, description, dueDate, completed } = req.body;
  const errors = {};

  // Title validation (optional on update)
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Title cannot be empty';
    } else if (title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
  }

  // Description validation
  if (description !== undefined && description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  // Due date validation
  if (dueDate !== undefined && dueDate !== null && !validator.isISO8601(dueDate)) {
    errors.dueDate = 'Invalid date format';
  }

  // Completed validation
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.completed = 'Completed must be a boolean';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  // Sanitize inputs
  if (title) req.body.title = sanitizeInput(title);
  if (description) req.body.description = sanitizeInput(description);

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  validateTaskUpdate
};
