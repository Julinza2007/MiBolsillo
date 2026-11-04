export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 254;
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

export function isValidMoney(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  const text = String(value).trim();
  return /^(?:\d+)(?:\.\d{1,2})?$/.test(text) && Number(text) > 0 && Number.isFinite(Number(text)) && Number(text) <= 9999999999.99;
}

export function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateMovement(body) {
  const errors = {};
  if (!['income', 'expense'].includes(body?.type)) errors.type = 'Seleccioná ingreso o gasto.';
  if (typeof body?.description !== 'string' || body.description.trim().length < 2 || body.description.trim().length > 140) errors.description = 'La descripción debe tener entre 2 y 140 caracteres.';
  if (!isValidMoney(body?.amount)) errors.amount = 'El importe debe ser mayor que cero y tener hasta dos decimales.';
  if (!isValidDate(body?.date)) errors.date = 'Ingresá una fecha válida.';
  if (!Number.isInteger(Number(body?.categoryId)) || Number(body?.categoryId) <= 0) errors.categoryId = 'Seleccioná una categoría válida.';
  return errors;
}

export function validateBudget(body) {
  const errors = {};
  if (!isValidMoney(body?.amount)) errors.amount = 'El presupuesto debe ser mayor que cero y tener hasta dos decimales.';
  if (!Number.isInteger(Number(body?.categoryId)) || Number(body?.categoryId) <= 0) errors.categoryId = 'Seleccioná una categoría válida.';
  const month = Number(body?.month);
  const year = Number(body?.year);
  if (!Number.isInteger(month) || month < 1 || month > 12) errors.month = 'El mes no es válido.';
  if (!Number.isInteger(year) || year < 2000 || year > 2100) errors.year = 'El año no es válido.';
  return errors;
}

export function validateCategory(body) {
  const errors = {};
  if (typeof body?.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 50) errors.name = 'El nombre debe tener entre 2 y 50 caracteres.';
  if (!['income', 'expense'].includes(body?.type)) errors.type = 'El tipo debe ser ingreso o gasto.';
  return errors;
}

export function monthRange(month, year) {
  const first = `${year}-${String(month).padStart(2, '0')}-01`;
  const next = new Date(Date.UTC(Number(year), Number(month), 1)).toISOString().slice(0, 10);
  return { first, next };
}
