import { createEventEmitter } from './emitter';

interface Events {
  start: () => void;
  progress: (processed: number, total: number) => void;
  finish: () => void;
}

let emitter: ReturnType<typeof createEventEmitter<Events>>;

beforeEach(() => {
  emitter = createEventEmitter<Events>();
});

describe('on()', () => {
  it('calls the handler when the event is emitted', () => {
    const handler = jest.fn();
    emitter.on('start', handler);

    emitter.emit('start');
    emitter.emit('start');
    emitter.emit('start');

    expect(handler).toHaveBeenCalledTimes(3);
  });

  it('fires all handlers even if one of them throws an error', () => {
    const okHandler = jest.fn();
    const errorHandler = jest.fn().mockImplementation(() => { throw new Error(); });

    emitter.on('start', errorHandler);
    emitter.on('start', okHandler);

    try {
      emitter.emit('start');
    } catch {
      // empty
    }


    expect(errorHandler).toHaveBeenCalled();
    expect(okHandler).toHaveBeenCalled();
  });

  it('throws an array of all errors thrown in handlers', () => {
    const okHandler = jest.fn();
    const errorHandler = jest.fn().mockImplementation(() => { throw new Error(); });

    emitter.on('start', errorHandler);
    emitter.on('start', okHandler);

    let errors: unknown[] | null = null;

    try {
      emitter.emit('start');
    } catch (e) {
      if (e instanceof Array) {
        errors = e;
      }
    }

    expect(Array.isArray(errors)).toBe(true);
    expect(errors?.length).toBe(1);
  });

  it('does not fire when handler is removed with off()', () => {
    const handler = jest.fn();

    emitter.on('start', handler);
    emitter.off('start', handler);

    emitter.emit('start');

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('once()', () => {
  it('should call the handler only once', () => {
    const handler = jest.fn();

    emitter.once('start', handler);

    emitter.emit('start');
    emitter.emit('start');
    emitter.emit('start');
    emitter.emit('start');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires all handlers even if one of them throws an error', () => {
    const okHandler = jest.fn();
    const errorHandler = jest.fn().mockImplementation(() => { throw new Error(); });

    emitter.once('start', errorHandler);
    emitter.once('start', okHandler);

    try {
      emitter.emit('start');
    } catch {
      // empty
    }

    expect(errorHandler).toHaveBeenCalled();
    expect(okHandler).toHaveBeenCalled();
  });

  it('throws an array of all errors thrown in handlers', () => {
    const okHandler = jest.fn();
    const errorHandler = jest.fn().mockImplementation(() => { throw new Error(); });

    emitter.once('start', errorHandler);
    emitter.once('start', okHandler);

    let errors: unknown[] | null = null;

    try {
      emitter.emit('start');
    } catch (e) {
      if (e instanceof Array) {
        errors = e;
      }
    }

    expect(Array.isArray(errors)).toBe(true);
    expect(errors?.length).toBe(1);
  });

  it('should not fire handlers when removed with off()', () => {
    const handler = jest.fn();

    emitter.once('start', handler);
    emitter.off('start', handler);

    emitter.emit('start');
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('ts interface', () => {
  it('should be readonly', () => {
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

    expect(true).toBe(true);
  });

  it('should enforce event names', () => {
    const noop = () => {};

    // @ts-expect-error This event name was not defined in the Events interface
    emitter.emit('thisEventDoesntExist');

    // @ts-expect-error This event name was not defined in the Events interface
    emitter.off('thisEventDoesntExist', noop);

    // @ts-expect-error This event name was not defined in the Events interface
    emitter.on('thisEventDoesntExist', noop);

    // @ts-expect-error This event name was not defined in the Events interface
    emitter.once('thisEventDoesntExist', noop);

    expect(true).toBe(true);
  });

  it('should enforce all args are passed to emit()', () => {
    // @ts-expect-error No args passed, 2 expected
    emitter.emit('progress');

    // @ts-expect-error 1 arg passed, 2 expected
    emitter.emit('progress', 1);

    // @ts-expect-error Correct number of args, wrong type
    emitter.emit('progress', '1', 2);

    // no error - correct number of args passed
    emitter.emit('progress', 1, 2);

    expect(true).toBe(true);
  });
});


