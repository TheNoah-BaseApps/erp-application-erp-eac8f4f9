export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
}

export function validateProductCode(code) {
  if (!code || typeof code !== 'string') return false;
  return code.trim().length > 0;
}

export function validateCustomerCode(code) {
  if (!code || typeof code !== 'string') return false;
  return code.trim().length > 0;
}

export function validatePositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validatePositiveInteger(value) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
}

export function validateMonth(month) {
  if (!month) return false;
  const date = new Date(month);
  return date instanceof Date && !isNaN(date);
}

export function validateRole(role) {
  const validRoles = ['admin', 'manager', 'sales_rep', 'viewer'];
  return validRoles.includes(role);
}

export function validateTelephone(telephone) {
  if (!telephone || typeof telephone !== 'string') return false;
  return telephone.trim().length > 0;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim();
}

export function validateProductData(data) {
  const errors = {};
  
  if (!data.product_name || !data.product_name.trim()) {
    errors.product_name = 'Product name is required';
  }
  
  if (!validateProductCode(data.product_code)) {
    errors.product_code = 'Valid product code is required';
  }
  
  if (!data.product_category || !data.product_category.trim()) {
    errors.product_category = 'Product category is required';
  }
  
  if (!data.unit || !data.unit.trim()) {
    errors.unit = 'Unit is required';
  }
  
  if (!validatePositiveNumber(data.critical_stock_level)) {
    errors.critical_stock_level = 'Critical stock level must be a positive number';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateCostData(data) {
  const errors = {};
  
  if (!data.product_id || !data.product_id.trim()) {
    errors.product_id = 'Product ID is required';
  }
  
  if (!validateMonth(data.month)) {
    errors.month = 'Valid month is required';
  }
  
  if (!validatePositiveNumber(data.unit_cost)) {
    errors.unit_cost = 'Unit cost must be a positive number';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateCustomerData(data) {
  const errors = {};
  
  if (!data.customer_name || !data.customer_name.trim()) {
    errors.customer_name = 'Customer name is required';
  }
  
  if (!validateCustomerCode(data.customer_code)) {
    errors.customer_code = 'Valid customer code is required';
  }
  
  if (!validateTelephone(data.telephone_number)) {
    errors.telephone_number = 'Telephone number is required';
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Valid email format is required';
  }
  
  if (data.payment_terms_limit && !validatePositiveInteger(data.payment_terms_limit)) {
    errors.payment_terms_limit = 'Payment terms limit must be a positive integer';
  }
  
  if (data.balance_risk_limit && !validatePositiveNumber(data.balance_risk_limit)) {
    errors.balance_risk_limit = 'Balance risk limit must be a positive number';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}