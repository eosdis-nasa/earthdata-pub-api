const crypto = require('crypto');
const { AsyncLocalStorage } = require('async_hooks');

const ERROR_REFERENCE_ID = /^EDP-\d{8}T\d{6}Z-[0-9A-F]{8}$/;
const ACTION_TOKEN = /^[A-Za-z][A-Za-z0-9_]{0,40}$/;
const pageStorage = new AsyncLocalStorage();

function createReferenceId(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `EDP-${stamp}-${hex}`;
}

function publicErrorBody(referenceId) {
  return {
    referenceId,
    error: {
      code: 500,
      referenceId
    }
  };
}

function safePage(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.length > 200) return '';
  if (/[?#\s]/.test(value)) return '';
  return value;
}

function safeToken(value) {
  return typeof value === 'string' && ACTION_TOKEN.test(value) ? value : '';
}

function actionFromEvent(event) {
  if (!event || typeof event !== 'object') return '';
  const resource = safeToken(event.resource);
  const operation = safeToken(event.operation);
  if (resource && operation) return `${resource} ${operation}`;
  return resource || operation;
}

function pageFromEvent(event) {
  const stored = safePage(pageStorage.getStore());
  if (!event || typeof event !== 'object') return stored;
  return safePage(event.page) || stored;
}

function logReferenceError(referenceId, name, event) {
  const details = [actionFromEvent(event), pageFromEvent(event)].filter(Boolean);
  console.error('Earthdata Pub error', referenceId, name, ...details);
}

function returnedServerFailure(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return false;
  const code = Number(result.statusCode);
  return Number.isFinite(code) && code >= 500;
}

function withPage(page, fn) {
  const safe = safePage(page);
  if (!safe) return fn();
  return pageStorage.run(safe, fn);
}

function guard(handler) {
  return async function guarded(event, context) {
    try {
      const result = await handler(event, context);
      if (!returnedServerFailure(result)) return result;
      const referenceId = createReferenceId();
      logReferenceError(referenceId, 'Error', event);
      return publicErrorBody(referenceId);
    } catch (error) {
      const referenceId = createReferenceId();
      const name = error && typeof error.name === 'string' ? error.name : 'Error';
      logReferenceError(referenceId, name, event);
      return publicErrorBody(referenceId);
    }
  };
}

module.exports = {
  ERROR_REFERENCE_ID,
  createReferenceId,
  publicErrorBody,
  safePage,
  withPage,
  logReferenceError,
  guard
};
