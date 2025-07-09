// Recursive type: any property access at any depth yields a string
type RecordString = {
  [key: string]: RecordString;
} & {
  toString(): string;
  valueOf(): string;
  [Symbol.toPrimitive]?(hint: string): string;
};

// Creates a proxy that allows dynamic property access and returns the access path as a string.
export function createStringAccessProxy(): RecordString {
  return new Proxy(
    {},
    {
      get(_target: object, property: string | symbol): unknown {
        if (typeof property === "symbol") {
          return undefined;
        }
        return createStringAccessProxyWrapper(property.toString());
      },
    },
  ) as RecordString;
}

/**
 * Recursively creates a proxy that builds a string path as properties are accessed.
 * The proxy also supports string methods and can be converted to a string directly.
 *
 * @param path - The current property access path
 * @returns Proxy object that continues to build the path
 */
function createStringAccessProxyWrapper(path: string): unknown {
  // toString and valueOf return the current path string
  const toStringFn = (): string => path;
  const valueOfFn = (): string => path;

  const proxy = new Proxy(
    {},
    {
      get(_target: object, property: string | symbol): unknown {
        if (typeof property === "symbol") {
          return undefined;
        }
        if (property === "toString") {
          return toStringFn;
        }
        if (property === "valueOf") {
          return valueOfFn;
        }
        // If the property is a string method, bind it to the path
        if (
          typeof String.prototype[property as keyof typeof String.prototype] ===
          "function"
        ) {
          return (
            String.prototype[property as keyof typeof String.prototype] as (
              ...args: unknown[]
            ) => unknown
          ).bind(path);
        }
        // Otherwise, continue building the path
        return createStringAccessProxyWrapper(`${path}.${property.toString()}`);
      },
    },
  );

  // Define toString and valueOf as non-writable properties
  Object.defineProperties(proxy, {
    toString: {
      value: toStringFn,
      writable: false,
      configurable: true,
    },
    valueOf: {
      value: valueOfFn,
      writable: false,
      configurable: true,
    },
  });

  return proxy;
}

/**
 * Example usage:
 *
 * const obj = createStringAccessProxy();
 *
 * // Accessing properties builds a string path:
 * obj.a.b.toString(); // "a.b"
 * String(obj.a.b);   // "a.b"
 * `${obj.a.b}`;      // "a.b"
 *
 * // String methods are supported:
 * obj.a.b.split("."); // ["a", "b"]
 * obj.x.y.z.toUpperCase(); // "X.Y.Z"
 *
 * // Chaining works for any depth:
 * obj.foo.bar.baz.toString(); // "foo.bar.baz"
 */
