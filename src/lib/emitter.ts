export function createEventEmitter<TEvents extends {
  [eventName in TEventNames]: (...args: any[]) => void
}, TEventNames extends keyof TEvents = keyof TEvents>() {
  const listeners: {
    // eslint-disable-next-line @typescript-eslint/ban-types
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
    const eventListeners = listeners[eventName as string];
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }

    listeners[eventName as string] = eventListeners.filter((fn) => fn !== handler);
  };

  const emit = <TEventName extends TEventNames>(eventName: TEventName, ...params: Parameters<TEvents[TEventName]>) => {
    const eventListeners = listeners[eventName as string];
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }

    for (let i = 0; i < eventListeners.length; i++) {
      eventListeners[i](...params);
    }
  };
  

  const once = <TEventName extends TEventNames>(eventName: TEventName, handler: TEvents[TEventName]) => {
    const onHandler = ((...args: Parameters<typeof handler>) => {
      handler(...args);
      off(eventName, onHandler);
    }) as TEvents[TEventName];

    on(eventName, onHandler);
  };

  return {
    on,
    off,
    emit,
    once
  } as const;
}
