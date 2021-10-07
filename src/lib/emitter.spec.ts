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

test('can attach multiple event listeners', ({ assert }) => {
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

  emitter.once('start', () => {
    invocationCount++;
  });

  emitter.emit('start');
  emitter.emit('start');

  is(invocationCount, 2);
});

test('on / off / emit', ({ is }) => {
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
  emitter.off('start', () => { });

  is(invocationCount, 3);
});


test('once / off', ({ is }) => {
  const emitter = createEventEmitter<Events>();

  let called = false;
  const onEvent = () => { called = true; };

  emitter.once('finish', onEvent);
  emitter.off('finish', onEvent);
  emitter.emit('finish');

  is(called, false);
});


test('interface should be readonly', ({ assert }) => {
  const emitter = createEventEmitter<Events>();


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noop: any = () => { };

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

test('should not be able to pass event names that were not defined', ({ assert }) => {
  const emitter = createEventEmitter<Events>();

  const noop = () => { };

  // @ts-expect-error Should error
  emitter.emit('no');

  // @ts-expect-error Should error
  emitter.off('no', noop);

  // @ts-expect-error Should error
  emitter.on('no', noop);

  // @ts-expect-error Should error
  emitter.once('no', noop);

  assert(true);
});

test('enforce that all args are passed to emit()', ({ assert }) => {
  const emitter = createEventEmitter<Events>();

  // @ts-expect-error No args passed, 2 expected
  emitter.emit('progress');

  // @ts-expect-error 1 arg passed, 2 expected
  emitter.emit('progress', 1);

  // @ts-expect-error Correct number of args, wrong type
  emitter.emit('progress', '1', 2);

  // no error - correct number of args passed
  emitter.emit('progress', 1, 2);

  assert(true);
});
