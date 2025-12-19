const VALID_PRIORITIES = ['low', 'medium', 'high'];

function isBoolean(val) {
  return typeof val === 'boolean';
}

function validateCreate(req, res, next) {
  const { title, description, completed, priority } = req.body;
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('description is required and must be a non-empty string');
  }
  if (completed !== undefined && !isBoolean(completed)) {
    errors.push('completed must be a boolean');
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push('priority must be one of: low, medium, high');
  }
  if (errors.length) return res.status(400).json({ errors });
  next();
}

function validateUpdate(req, res, next) {
  const { title, description, completed, priority } = req.body;
  const errors = [];
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push('title must be a non-empty string');
  }
  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push('description must be a non-empty string');
  }
  if (completed !== undefined && !isBoolean(completed)) {
    errors.push('completed must be a boolean');
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push('priority must be one of: low, medium, high');
  }
  if (errors.length) return res.status(400).json({ errors });
  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
};
