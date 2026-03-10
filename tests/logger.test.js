import assert from 'node:assert/strict';
import { test } from 'node:test';

import { processLogArgs } from '../src/lib/logger-helpers.js';

test('accepts message only as string', () => {
  const message = '[logger.test][messageOnly] accepts plain string';
  const { message: normalizedMessage, eventFields } = processLogArgs([message]);

  assert.equal(normalizedMessage, message);
  assert.deepEqual(eventFields, {});
});

test('accepts string detailedMessage', () => {
  const message = '[logger.test][stringDetails] string detail';
  const { eventFields } = processLogArgs([
    message,
    {
      detailedMessage: 'detail message',
    },
  ]);
  assert.deepEqual(eventFields, {
    detailedMessage: 'detail message',
  });
});

test('stringifies object detailedMessage', () => {
  const message = '[logger.test][objectDetails] object detail';
  const meta = {
    detailedMessage: { step: 'load', status: 'ok' },
  };
  const { eventFields } = processLogArgs([message, meta]);

  assert.equal(eventFields.detailedMessage, 'step=load, status=ok');
});

test('ignores additional properties in metadata object', () => {
  const { eventFields } = processLogArgs([
    '[logger.test][metadata] drops unexpected keys',
    { detailedMessage: 'detail', unexpected: 'value' },
  ]);

  assert.deepEqual(eventFields, { detailedMessage: 'detail' });
});

test('ignores extra positional params beyond metadata object', () => {
  const { eventFields } = processLogArgs([
    '[logger.test][extraParams] ignores extra args',
    { detailedMessage: 'detail' },
    { ignored: true },
  ]);

  assert.deepEqual(eventFields, { detailedMessage: 'detail' });
});
