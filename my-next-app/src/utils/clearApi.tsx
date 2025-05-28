export function cleanPayload<T extends object>(payload: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
  }
  