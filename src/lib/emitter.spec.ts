/* eslint-disable @typescript-eslint/no-empty-function */
import test from 'ava';

import { createEventEmitter } from './emitter';

interface Events {
  start: () => void;
  progress: (processed: number, total: number) => void;
  finish: () => void;
}

test('on / emit', ({ is }) => {
  const emitter = createEventEmitter<Events>();

  let invocationCount = 0;
  emitter.on('start', () => {
    invocationCount++;
  });

  emitter.emit('start'); // 1
  emitter.emit('start'); // 2
  emitter.emit('finish'); // our handler shouldn't be invoked for this event
  emitter.emit('start'); // 3

  is(invocationCount, 3);
});

test('can attach multiple events', ({ assert }) => {
  const emitter = createEventEmitter<Events>();

  let firstHandlerCalled = false;
  let secondHandlerCalled = false;

  emitter.on('progress', () => {
    firstHandlerCalled = true;
  });

  emitter.on('progress', () => {
    secondHandlerCalled = true;
  });

  emitter.emit('progress', 3, 5);

  assert(firstHandlerCalled && secondHandlerCalled);
});

test('once / emit', ({ is }) => {
  const emitter = createEventEmitter<Events>();

  let invocationCount = 0;
  emitter.once('start', () => {
    invocationCount++;
  });

  emitter.emit('start');
  emitter.emit('start');

  is(invocationCount, 1);
});

test('off / emit', ({ is }) => {
  const emitter = createEventEmitter<Events>();

  let invocationCount = 0;

  const handler = () => {
    invocationCount++;
  };
  emitter.on('finish', handler);

  emitter.emit('finish');
  emitter.emit('finish');
  emitter.emit('finish');
  emitter.off('finish', handler);
  emitter.emit('finish');
  emitter.emit('finish');

  // nothing happens
  emitter.off('start', () => {});

  is(invocationCount, 3);
});

test('interface should be readonly', ({ assert }) => {
  const emitter = createEventEmitter<Events>();

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noop: any = () => {};

  // @ts-expect-error Should not be able to reassign function
  emitter.emit = noop;

  // @ts-expect-error Should not be able to reassign function
  emitter.off = noop;

  // @ts-expect-error Should not be able to reassign function
  emitter.on = noop;

  // @ts-expect-error Should not be able to reassign function
  emitter.once = noop;

  assert(true);
});