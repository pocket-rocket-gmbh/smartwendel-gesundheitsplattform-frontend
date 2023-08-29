export function debounce<F extends (...params: any[]) => void>(fn: F, delay = 500) {
  let timeoutID: number = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function areObjectsEqual(obj1: Record<string, any>, obj2: Record<string, any>, excludeKeys?: string[]): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (excludeKeys && excludeKeys.includes(key)) continue;
    
    if (obj1[key] !== obj2[key]) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj1[key])) {
        if (areArraysEqual(obj1[key], obj2[key])) {
          continue;
        }
      }
      if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
        if (areObjectsEqual(obj1[key], obj2[key], excludeKeys)) {
          continue;
        }
      }

      return false;
    }
  }

  return true;
}

export function deepToRaw<T extends Record<string, any>>(sourceObj: T): T {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item));
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (input && typeof input === "object") {
      return Object.keys(input).reduce((acc, key) => {
        acc[key as keyof typeof acc] = objectIterator(input[key]);
        return acc;
      }, {} as T);
    }
    return input;
  };

  return objectIterator(sourceObj);
}
