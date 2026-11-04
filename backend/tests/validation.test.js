import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidPassword,
  isValidMoney,
  isValidDate,
  validateMovement,
  validateBudget,
  validateCategory,
  monthRange,
} from '../src/utils/validation.js';

test('valida correos electrónicos', () => {
  assert.equal(isValidEmail('persona@example.com'), true);
  assert.equal(isValidEmail('correo-invalido'), false);
  assert.equal(isValidEmail(''), false);
});

test('valida longitud de contraseña', () => {
  assert.equal(isValidPassword('clave123'), true);
  assert.equal(isValidPassword('corta'), false);
  assert.equal(isValidPassword('x'.repeat(129)), false);
});

test('valida importes positivos con hasta dos decimales', () => {
  assert.equal(isValidMoney('100'), true);
  assert.equal(isValidMoney('100.25'), true);
  assert.equal(isValidMoney('0'), false);
  assert.equal(isValidMoney('-10'), false);
  assert.equal(isValidMoney('10.999'), false);
});

test('valida fechas reales en formato ISO', () => {
  assert.equal(isValidDate('2026-11-04'), true);
  assert.equal(isValidDate('2026-02-30'), false);
  assert.equal(isValidDate('04/11/2026'), false);
});

test('acepta un movimiento completo y rechaza datos incompletos', () => {
  const valid = { type: 'expense', description: 'Supermercado', amount: '12500.50', date: '2026-11-04', categoryId: 1 };
  assert.deepEqual(validateMovement(valid), {});
  assert.ok(Object.keys(validateMovement({ ...valid, amount: '-1' })).includes('amount'));
});

test('valida presupuestos mensuales y categorías', () => {
  assert.deepEqual(validateBudget({ categoryId: 1, amount: '50000', month: 11, year: 2026 }), {});
  assert.ok(validateBudget({ categoryId: 1, amount: '0', month: 13, year: 2026 }).month);
  assert.deepEqual(validateCategory({ name: 'Mascotas', type: 'expense' }), {});
  assert.ok(validateCategory({ name: 'A', type: 'other' }).name);
});

test('calcula correctamente el rango de un período mensual', () => {
  assert.deepEqual(monthRange(2, 2026), { first: '2026-02-01', next: '2026-03-01' });
  assert.deepEqual(monthRange(12, 2026), { first: '2026-12-01', next: '2027-01-01' });
});
