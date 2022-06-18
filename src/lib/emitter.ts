/**
 * Creates an event emitter
 * @returns Strongly-typed event emitter
 */
export function createEventEmitter<TEvents extends {
  [eventName in TEventNames]: (...args: never[]) => void
}, TEventNames extends keyof TEvents = keyof TEvents>() {
  const listeners: {
    [key: string]: Function[] | undefined
  } = {};

  const onceListeners: {
    [key: string]: Function[] | undefined
  } = {};

  const on = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    const eventListeners = listeners[eventName as string];
    if (!eventListeners) {
      listeners[eventName as string] = [handler];
      return;
    }

    eventListeners.push(handler);
  };

  const off = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    onceListeners[eventName as string] = onceListeners[eventName as string]?.filter((fn) => fn !== handler);
    listeners[eventName as string] = listeners[eventName as string]?.filter((fn) => fn !== handler);
  };

  const emit = <TEventName extends TEventNames>(eventName: TEventName, ...params: Parameters<TEvents[TEventName]>) => {
    const eventListeners = listeners[eventName as string];
    const onceEventListeners = onceListeners[eventName as string];

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

      onceListeners[eventName as string] = [];
    }

    if (errors.length > 0) {
      throw errors;
    }
  };


  const once = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    const eventListeners = onceListeners[eventName as string];
    if (!eventListeners) {
      onceListeners[eventName as string] = [handler];
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
