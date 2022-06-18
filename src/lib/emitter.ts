/**
 * Creates an event emitter
 * @returns Strongly-typed event emitter
 */
export function createEventEmitter<TEvents extends {
  [eventName in TEventNames]: (...args: never[]) => void
}, TEventNames extends keyof TEvents = keyof TEvents>() {
  const listeners: {
    [key: string | number | symbol]: Function[] | undefined
  } = {};

  const onceListeners: {
    [key: string | number | symbol]: Function[] | undefined
  } = {};

  const on = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    const eventListeners = listeners[eventName];
    if (!eventListeners) {
      listeners[eventName] = [handler];
      return;
    }

    eventListeners.push(handler);
  };

  const off = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    onceListeners[eventName] = onceListeners[eventName]?.filter((fn) => fn !== handler);
    listeners[eventName] = listeners[eventName]?.filter((fn) => fn !== handler);
  };

  const emit = <TEventName extends TEventNames>(eventName: TEventName, ...params: Parameters<TEvents[TEventName]>) => {
    const eventListeners = listeners[eventName];
    const onceEventListeners = onceListeners[eventName];

    const errors: unknown[] = [];

    if (eventListeners && eventListeners.length > 0) {
      for (let i = 0; i < eventListeners.length; i++) {
        try {
          eventListeners[i](...params);
        } catch (e) {
          errors.push(e);
        }
      }
    }

    if (onceEventListeners && onceEventListeners.length > 0) {
      for (let i = 0; i < onceEventListeners.length; i++) {
        try {
          onceEventListeners[i](...params);
        } catch (e) {
          errors.push(e);
        }
      }

      onceListeners[eventName] = [];
    }

    if (errors.length > 0) {
      throw errors;
    }
  };


  const once = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    const eventListeners = onceListeners[eventName];
    if (!eventListeners) {
      onceListeners[eventName] = [handler];
      return;
    }

    eventListeners.push(handler);
  };

  return {
    /**
     * Attach an event listener
     */
    on,

    /**
     * Detach an event listener
     */
    off,

    /**
     * Emit an event
     */
    emit,

    /**
     * Attach an event listener that will only be called once
     */
    once
  } as const;
}
