# simple-typed-events

[![npm version](https://badge.fury.io/js/simple-typed-events.svg)](https://www.npmjs.com/package/simple-typed-events) [![codecov](https://codecov.io/gh/bsssshhhhhhh/simple-typed-events/branch/master/graph/badge.svg?token=SZMB2OHTTH)](https://codecov.io/gh/bsssshhhhhhh/simple-typed-events)

Simple event emitter interface with full TypeScript support. Simply define your event names and their callbacks in an interface and pass it to `createEventEmitter` as a generic arg.

---

## Function list:

- `createEventEmitter<T>()` - returns an object with 4 functions
  - `on` - Attach event listener
  - `off` - Detach event listener
  - `once` - Attach an event listener that will only fire once
  - `emit` - Emit an event

```ts
import { createEventEmitter } from 'simple-typed-events';

interface Events {
  start: () => void;
  progress: (loaded: number, total: number) => void;
  finish: () => void;
}

const emitter = createEventEmitter<Events>();

// attach event listener with on()
emitter.on('start', () => {});

// the Events interface can be used as a lookup type
const onProgress: Events['progress'] = (loaded, total) => {
  // ...
};

emitter.on('progress', onProgress);
emitter.on('progress', (loaded, total) => {
  // ...
});

emitter.once('finish', () => {
  // ...
});

emitter.emit('progress'); // Typescript error! the args of the progress event must be passed
emitter.emit('progress', 3); // Still not legal. Both args must be passed
emitter.emit('progress', 3, 5); // no error

// detach listeners by reference
emitter.off('progress', onProgress);
```

---

Copyright © 2021 Brian Simon
