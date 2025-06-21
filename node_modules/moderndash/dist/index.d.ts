import { Paths as Paths$1 } from 'type-fest';
import { Call, Objects } from 'hotscript';

/**
 * Creates an array of elements split into groups the length of size. If array can't be split evenly, the final chunk will be the remaining elements.
 *
 * @example
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 * @param chunkSize The length of each chunk
 * @param array The array to chunk
 * @template TElem The type of the array elements
 * @returns Returns the new array of chunks
 */
declare function chunk<TElem>(array: readonly TElem[], chunkSize: number): TElem[][];

/**
 * Creates an object with counts of occurrences of items in the array.
 *
 * @example
 * const users = [
 *   { 'user': 'barney', 'active': true, age: 36 },
 *   { 'user': 'betty', 'active': false, age: 36 },
 *   { 'user': 'fred', 'active': true, age: 40 }
 * ]
 *
 * count(users, value => value.active ? 'active' : 'inactive');
 * // => { 'active': 2, 'inactive': 1 }
 *
 * count(users, value => value.age);
 * // => { 36: 2, 40: 1 }
 *
 * @param criteria The criteria to count by
 * @param array The array or record to iterate over
 * @template TElem The type of the array elements
 * @returns Returns the composed aggregate object
 */
declare function count<TElem, TKey extends PropertyKey>(array: readonly TElem[], criteria: (value: TElem) => TKey): Record<TKey, number>;

/**
 * This type builds an array with a minimum length.
 *
 * @example
 * let arr: ArrayMinLength<number, 3> = [1, 2, 3];
 * // => OK
 *
 * arr = [1, 2];
 * // => Type '[number, number]' is not assignable to type '[number, number, number, ...number[]]'.
 *
 * @template TElem The type of the array elements.
 * @template TMinLength The minimum length of the array.
 */
type ArrayMinLength<TElem, TMinLength extends number> = BuildArrayMinLength<TElem, TMinLength, []>;
type BuildArrayMinLength<TElem, TMinLength extends number, Current extends TElem[]> = Current["length"] extends TMinLength ? [...Current, ...TElem[]] : BuildArrayMinLength<TElem, TMinLength, [...Current, TElem]>;

type CompareFunction<TArrays extends ArrayMinLength<unknown[], 2>> = (a: TArrays[0][number], b: ArrayTail<TArrays>[number][number]) => boolean;
type ArrayTail<TArray extends unknown[]> = TArray extends [unknown, ...infer U] ? U : never;

/**
 * Create a new array with values from the first array that are not present in the other arrays.
 * Optionally, use a compare function to determine the comparison of elements (default is `===`).
 *
 * **Consider using the native [Set.prototype.difference()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference) function instead.**
 *
 * @example
 * difference([2, 1], [2, 3], [6])
 * // => [1]
 *
 * // ---- Custom compare function ----
 * const compareByFloor = (a, b) => Math.floor(a) === Math.floor(b);
 * difference([1.2, 3.1], [1.3, 2.4], compareByFloor)
 * // => [3.1]
 *
 * // ---- Only compare by id ----
 * const arr1 = [{ id: 1, name: 'Yeet' }, { id: 3, name: 'John' }];
 * const arr2 = [{ id: 3, name: 'Carl' }, { id: 4, name: 'Max' }];
 *
 * difference(arr1, arr2, (a, b) => a.id === b.id)
 * // => [{ id: 1, name: 'Yeet' }]
 *
 * @param arraysOrCompareFn Two or more arrays with an optional compare function at the end
 * @template TElem The type of the array elements
 * @template TArrays The type of the arrays provided
 * @returns Returns a new array of filtered values
 */
declare function difference<TElem>(...arraysOrCompareFn: ArrayMinLength<TElem[], 2>): TElem[];
declare function difference<TArrays extends ArrayMinLength<unknown[], 2>>(...arraysOrCompareFn: [...TArrays, CompareFunction<TArrays>]): TArrays[0];

/**
 * Creates a slice of `array` excluding elements dropped from the end.
 * Elements are dropped until `predicate` returns falsy.
 *
 * @example
 * const users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': true },
 *   { 'user': 'pebbles', 'active': true }
 * ]
 *
 * dropRightWhile(users, user => user.active)
 * // => objects for ['barney']
 * @param predicate The function invoked per iteration
 * @param array The array to query
 * @template TElem The type of the array elements
 * @returns Returns the slice of `array`
 */
declare function dropRightWhile<TElem>(array: readonly TElem[], predicate: (value: TElem) => boolean): TElem[];

/**
 * Creates a slice of `array` excluding elements dropped from the beginning.
 * Elements are dropped until `predicate` returns falsy.
 *
 * @example
 * const users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': true },
 *   { 'user': 'pebbles', 'active': false }
 * ]
 *
 * dropWhile(users, user => user.active)
 * // => objects for ['pebbles']
 * @param predicate The function invoked per iteration
 * @param array The array to query
 * @template TElem The type of the array elements
 * @returns Returns the slice of `array`
 */
declare function dropWhile<TElem>(array: readonly TElem[], predicate: (value: TElem) => boolean): TElem[];

/**
 * Creates an object with grouped items in the array.
 *
 * @deprecated
 * **Deprecated: Use the native "Object.groupBy()" function instead.**
 *
 * @example
 * group([6.1, 4.2, 6.3], Math.floor)
 * // => { 4: [4.2], 6: [6.1, 6.3] }
 *
 * group([6.1, 4.2, 6.3], value => value > 5 ? '>5' : '<=5')
 * // => { '<=5': [4.2], '>5': [6.1, 6.3] }
 *
 * @param collection The array or object to iterate over
 * @param getGroupKey A function that returns the group id for each item
 * @template TElem The type of the array elements
 * @returns An object with grouped items
 */
declare function group<TElem, TKey extends PropertyKey>(array: readonly TElem[], getGroupKey: (elem: TElem) => TKey): Record<TKey, TElem[]>;

/**
 * Create an array with unique values that are present in all arrays.
 * The order of the values is based on the first array.
 *
 * Optionally, use a compare function for element comparison (default is `===`).
 *
 * **Consider using the native [Set.prototype.intersection()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection) function instead.**
 *
 * @example
 * intersection([2, 1], [2, 3], [6, 2])
 * // => [2]
 *
 * // ---- Custom compare function ----
 * const compareFn = (a, b) => Math.floor(a) === Math.floor(b);
 *
 * intersection([1.2, 1.1], [1.3, 2.4], compareFn)
 * // => [1.2]
 *
 * // ---- Only compare by id ----
 * const arr1 = [{ id: 1, name: 'Yeet' }, { id: 3, name: 'John' }];
 * const arr2 = [{ id: 3, name: 'Carl' }, { id: 4, name: 'Max' }];
 *
 * intersection(arr1, arr2, (a, b) => a.id === b.id)
 * // => [{ id: 3, name: 'John' }]
 *
 * @param arraysOrCompareFn Two or more arrays with an optional compare function at the end
 * @template TElem Type of the array elements
 * @template TArrays Type of the arrays provided
 * @returns New array of intersecting values
 */
declare function intersection<TElem>(...arraysOrCompareFn: ArrayMinLength<TElem[], 2>): TElem[];
declare function intersection<TArrays extends ArrayMinLength<unknown[], 2>>(...arraysOrCompareFn: [...TArrays, CompareFunction<TArrays>]): TArrays[0];

/**
 * Moves an element within an array.
 *
 * @example
 * ```typescript
 * move([1, 2, 3, 4, 5], 0, 2);
 * // => [2, 3, 1, 4, 5]
 * ```
 *
 * @param array The input array
 * @param fromIndex Index of the element to move
 * @param toIndex Target index for the element
 * @throws If index is out of bounds
 * @template TArr Type of the array elements
 * @returns The modified array with the moved element
 */
declare function move<TArr>(array: TArr[], fromIndex: number, toIndex: number): TArr[];

/**
 * Creates an array from start to end (inclusive), stepping by step.
 * If start is larger than end, the array is generated in reverse
 *
 * @example
 * for (const num of range(1, 5)) {
 *   console.log(num);
 * }
 * // => 1 2 3 4 5
 *
 * // Array of even numbers between 0 and 10:
 * range(0, 10, 2);
 * // => [0, 2, 4, 6, 8, 10]
 *
 * // Descending range:
 * range(5, 0, 2);
 * // => [5, 3, 1]
 *
 * @param start Start number of sequence
 * @param end End number of sequence
 * @param step Step between numbers, default: 1
 * @throws If range is negative or step is 0
 * @returns An array of numbers
 */
declare function range(start: number, end: number, step?: number): number[];

/**
 * Creates a new array of shuffled values, using the Fisher-Yates-Durstenfeld Shuffle algorithm.
 *
 * @example
 * shuffle([1, 2, 3, 4])
 * // => [4, 1, 3, 2]
 * @param array Array to shuffle
 * @template TElem The type of the array elements
 * @returns A new shuffled array
 */
declare function shuffle<TElem>(array: readonly TElem[]): TElem[];

/**
 * Creates new array sorted in ascending/descending order with single or multiple criteria.
 *
 * @example
 * sort([1, 2, 3, 4], { order: 'desc' })
 * // => [4, 3, 2, 1]
 *
 * // --- Sorting by multiple properties ---
 * const array = [{ a: 2, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }];
 *
 * sort(array,
 *   { order: 'asc', by: item => item.a },
 *   { order: 'desc', by: item => item.b }
 * )
 * // => [{ a: 1, b: 2 }, { a: 1, b: 1 }, { a: 2, b: 1 }]
 *
 * @param array Array to sort
 * @param criteria Criteria to sort by
 * @param criteria.order Order to sort in, either 'asc' or 'desc'
 * @param criteria.by Iteratee function to sort based on a specific property
 * @template TElem Type of the array elements
 * @returns New sorted array
*/
declare function sort<TElem>(array: readonly TElem[], ...criteria: {
    order?: "asc" | "desc";
    by?: (item: TElem) => number | bigint | Date | string;
}[]): TElem[];

/**
 * Creates a slice of `array` with elements taken from the end.
 * Elements are taken until `predicate` returns falsy.
 *
 * @example
 * const users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': true },
 *   { 'user': 'pebbles', 'active': true }
 * ]
 *
 * takeRightWhile(users, user => user.active)
 * // => objects for ['fred', 'pebbles']
 * @param predicate The function invoked per iteration.
 * @param array The array to query.
 * @template TElem The type of the array elements.
 * @returns Returns the slice of `array`.
 */
declare function takeRightWhile<TElem>(array: readonly TElem[], predicate: (elem: TElem) => boolean): TElem[];

/**
 * Creates a slice of `array` with elements taken from the beginning.
 * Elements are taken until `predicate` returns falsy.
 *
 * @example
 * const users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': true },
 *   { 'user': 'pebbles', 'active': false }
 * ]
 *
 * takeWhile(users, user => user.active)
 * // => objects for ['barney', 'fred']
 * @param predicate The function invoked per iteration.
 * @param array The array to query.
 * @template TElem The type of the array elements.
 * @returns A new array of taken elements.
 */
declare function takeWhile<TElem>(array: readonly TElem[], predicate: (elem: TElem) => boolean): TElem[];

/**
 * Creates unique array retaining first occurrence of elements.
 *
 * A compare function is optional (default is `===`).
 *
 * @example
 * unique([2, 1, 2])
 * // => [2, 1]
 *
 * // compare by object values
 * const users = [
 *   { id: 1, name: 'john' },
 *   { id: 2, name: 'john' },
 *   { id: 2, name: 'john' },
 * ]
 *
 * unique(users, isEqual)
 * // => [{ id: 1, name: 'john' }, { id: 2, name: 'john' }]
 *
 * // compare by id
 * unique(users, (a, b) => a.name === b.name)
 * // => [{ id: 1, name: 'john' }]
 *
 * @param array Array to inspect
 * @param iteratee Iteratee invoked per element
 * @template TElem Type of the array elements
 * @returns A new unique array
 */
declare function unique<TElem>(array: readonly TElem[], compareFn?: (a: TElem, b: TElem) => boolean): TElem[];

type JsonifiableObject = {
    [Key in string]?: Jsonifiable;
} | {
    toJSON: () => Jsonifiable;
};
type JsonifiableArray = readonly Jsonifiable[];
type JsonPrimitive = string | number | boolean | null;
/**
 * Matches a value that can be losslessly converted to JSON.
 * Can be used to type values that you expect to pass to `JSON.stringify`.
 *
 * `undefined` is allowed in object fields (for example, `{a?: number}`) as a special case even though `JSON.stringify({a: undefined})` is `{}` because it makes this class more widely useful and checking for undefined-but-present values is likely an anti-pattern.
 *
 * @example
 * ```typescript
 * const error: Jsonifiable = {
 *     map: new Map([['a', 1]]),
 * };
 * // => TypeError: Map is not a valid JSON value.
 *
 * JSON.stringify(error);
 * // => {"map": {}}
 *
 * const good: Jsonifiable = {
 *     number: 3,
 *     date: new Date(),
 *     missing: undefined,
 * }
 *
 * JSON.stringify(good);
 * //=> {"number": 3, "date": "2022-10-17T22:22:35.920Z"}
 * ```
*/
type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;

type SupportedAlgorithms = "SHA-256" | "SHA-384" | "SHA-512";
/**
 * Generates a hash of the given data using the specified algorithm.
 *
 * It uses the Web Crypto API to generate the hash.
 *
 * *Note: If you need a secure hash use a specialized library like [crypto-js](https://www.npmjs.com/package/crypto-js) instead.*
 *
 * @example
 * // Hash a string using the default algorithm (SHA-256)
 * await hash('hello world');
 * // => "b94d27b9934d3e08a52e52d7da7dabfac484efe37a53..."
 *
 * // Hash an object using the SHA-512 algorithm
 * await hash({ foo: 'bar', baz: 123 }, 'SHA-512');
 * // => "d8f3c752c6820e580977099368083f4266b569660558..."
 *
 * @param data The data to hash, either as a string or a JSON-serializable object.
 * @param algorithm The hashing algorithm to use. Defaults to 'SHA-256'.
 * @returns A Promise that resolves to the hexadecimal representation of the hash.
 *
 * @throws {DOMException} If the specified algorithm is not supported by the Web Crypto API.
 */
declare function hash(data: Jsonifiable, algorithm?: SupportedAlgorithms): Promise<string>;

/**
 * Gets a random element an array. A single element is returned by default.
 * Specify the `multi` parameter to get an array of multiple random elements.
 *
 * If the array is empty, `undefined` is returned.
 * If `multi` is defined it returns an empty array.
 *
 * It uses `crypto.getRandomValues` to get the random element.
 * @example
 * randomElem([1, 2, 3, 4])
 * // => 2
 *
 * randomElem([1, 2, 3, 4], 2)
 * // => [3, 1]
 * @param array The array to sample.
 * @returns Returns the random element.
 */
declare function randomElem<TArr>(array: TArr[]): TArr | undefined;
declare function randomElem<TArr>(array: TArr[], multi: number): TArr[];

/**
 * Generates a random float between two given numbers, including those numbers.
 *
 * It uses `crypto.getRandomValues` to generate the random number.
 * @example
 * randomFloat(1, 10)
 * // => 1.123456789
 *
 * @param min The smallest float that can be generated.
 * @param max The largest float that can be generated.
 *
 * @returns A random float between `min` and `max`, including `min` and `max`.
 */
declare function randomFloat(min: number, max: number): number;

/**
 * Generates a random integer between two given numbers, including those numbers.
 *
 * It uses `crypto.getRandomValues` to generate the random number.
 * @example
 * randomInt(1, 10)
 * // => 5
 *
 * @param min The smallest integer that can be generated.
 * @param max The largest integer that can be generated.
 *
 * @returns A random integer between `min` and `max`, including `min` and `max`.
 */
declare function randomInt(min: number, max: number): number;

/**
 * Generates a random string of the specified length.
 * The default charset is alphanumeric characters.
 *
 * It uses `crypto.getRandomValues` to generate the random string.
 *
 * @example
 * randomString(8);
 * // => "JWw1p6rD"
 *
 * randomString(16, 'abc');
 * // => "cbaacbabcabccabc"
 * @param length The length of the string to generate.
 * @param charSet The set of characters to use when generating the string. Defaults to alphanumeric characters.
 * @returns A random string of the specified length.
 */
declare function randomString(length: number, charSet?: string): string;

/**
 * Debounces the decorated function. Only calling it after a specified amount of time has passed without any new calls.
 *
 * Look at {@link debounce} for the non-decorator version.
 *
 * @example
 * ```typescript
 * class TestClass {
 *   @decDebounce(100)
 *   testMethod(str: string) {
 *     console.log("Debounced:", str);
 *   }
 * }
 *
 * const instance = new TestClass();
 * instance.testMethod("Hello");
 * instance.testMethod("World");
 * // => Only the second invocation of `debouncedSayHello` is executed, after a delay of 1000ms.
 * ```
 * @param wait Milliseconds to wait before invoking the decorated function after the last invocation.
 */
declare function decDebounce(wait: number): (originalMethod: unknown, _context: ClassMethodDecoratorContext) => GenericFunction<any> & {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
};

/**
 * Only invokes the decorated function as long as it's called `<= n` times.
 * Subsequent calls to the decorated function return the result of the last invocation.
 *
 * Look at {@link maxCalls} for the non-decorator version.
 *
 * @example
 * ```typescript
 * class TestClass {
 *  private count = 0;
 *  @decMaxCalls(2)
 *  testMethod() {
 *    return ++this.count;
 *  }
 * }
 * const instance = new TestClass();
 * instance.testMethod(); // => 1
 * instance.testMethod(); // => 2
 * instance.testMethod(); // => 2
 * ```
 * @param n The number of calls before the cached result is returned.
 */
declare function decMaxCalls(n: number): (originalMethod: unknown, _context: ClassMethodDecoratorContext) => GenericFunction<any>;

type GenericFunction<TFunc extends (...args: any) => any> = (...args: Parameters<TFunc>) => ReturnType<TFunc>;

/**
 * Creates a function that memoizes the result of a given function.
 *
 * The cache key is determined by the `resolver` or by the arguments from the function call.
 *
 * **Options:**
 * - `resolver` A function that determines the cache key based on the arguments provided.
 * - `ttl` the time to live for the cache entries in milliseconds.
 *
 * **Properties:**
 * - `cache` The cache is an instance of `Map` and can be used to clear or inspect the cache.
 * It can be replaced by a custom cache that matches the `Map` interface.
 *
 *
 * This function can be used as a decorator with {@link decMemoize}.
 *
 * @example
 * ```typescript
 * function fibonacci(n: number) {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * }
 *
 * const memoizedFib = memoize(fibonacci, { ttl: 1000 })
 *
 * memoizedFib(40) // => 102334155
 * memoizedFib(40) // => 102334155 (cache hit)
 * setTimeout(() => memoizedFib(40), 1000) // => 102334155 (cache miss)
 *
 * // Cached values are exposed as the `cache` property.
 * memoizedFib.cache.get("40") // => [value, timestamp]
 * memoizedFib.cache.set("40", [1234, Date.now()])
 * memoizedFib.cache.clear()
 *
 * // This is the default way to create cache keys.
 * const defaultResolver = (...args: unknown[]) => JSON.stringify(args)
 * ```
 * @param func The function to have its output memoized.
 * @param options The options object with optional `resolver` and `ttl` parameters.
 * @param options.resolver - A function that determines the cache key for storing the result based on the arguments provided.
 * @param options.ttl - The time to live for the cache in milliseconds.
 * @template TFunc The type of the function to memoize.
 * @template Cache The type of the cache storage.
 * @returns Returns the new memoized function.
 */
declare function memoize<TFunc extends GenericFunction<TFunc>, Cache extends Map<string, [ReturnType<TFunc>, number]>>(func: TFunc, options?: {
    resolver?: (...args: Parameters<TFunc>) => string;
    ttl?: number;
}): TFunc & {
    cache: Cache;
};

/**
 * Memoizes the decorated function.
 * The cache key is either determined by the provided resolver or by the arguments used in the memoized function.
 *
 * **Options:**
 * - `resolver` A function that determines the cache key for storing the result based on the arguments provided.
 * - `ttl` sets the time to live for the cache in milliseconds. After `ttl` milliseconds, the next call to the memoized function will result in a cache miss.
 *
 * Look at {@link memoize} for the non-decorator version.
 *
 * @example
 * ```typescript
 * class TestClass {
 *   @decMemoize({ ttl: 1000 })
 *   testMethod(a: number, b: number) {
 *     return a + b;
 *   }
 * }
 * const instance = new TestClass();
 * instance.testMethod(1, 2); // => 3
 * instance.testMethod(1, 2); // => 3 (cached)
 *
 * // After 1 second:
 * instance.testMethod(1, 2); // => 3 (cache miss)
 * ```
 * @param options The options object.
 * @param options.resolver - A function that determines the cache key for storing the result based on the arguments provided.
 * @param options.ttl - The time to live for the cache in milliseconds.
 */
declare function decMemoize(options?: Parameters<typeof memoize>[1]): (originalMethod: unknown, _context: ClassMethodDecoratorContext) => GenericFunction<GenericFunction<any>> & {
    cache: Map<string, [any, number]>;
};

/**
 * Only invokes the decorated function after it's called more than `n` times.
 *
 * Look at {@link minCalls} for the non-decorator version.
 *
 * @example
 * ```typescript
 * class TestClass {
 *   @decMinCalls(2)
 *   testMethod() {
 *     return 1;
 *   }
 * }
 * const instance = new TestClass();
 * instance.testMethod(); // => undefined
 * instance.testMethod(); // => undefined
 * instance.testMethod(); // => 1
 * ```
 * @param n The number of calls before the decorated function is invoked.
 */
declare function decMinCalls(n: number): (originalMethod: unknown, _context: ClassMethodDecoratorContext) => (this: unknown, ...args: unknown[]) => any;

/**
 * The decorated function is invoked at most once per every `wait` milliseconds.
 *
 * Look at {@link throttle} for the non-decorator version.
 *
 * @example
 * ```typescript
 * class TestClass {
 *   @decThrottle(1000)
 *   testMethod() {
 *     console.log("Throttled!");
 *   }
 * }
 *
 * const instance = new TestClass();
 * instance.testMethod(); // => "Throttled!" is logged once per second.
 * instance.testMethod(); // nothing happens
 * ```
 * @param wait The number of milliseconds to wait between invocations.
 */
declare function decThrottle(wait: number): (originalMethod: unknown, _context: ClassMethodDecoratorContext) => GenericFunction<any>;

type Tail<T extends unknown[]> = T extends [infer _Head, ...infer Tail] ? Tail : never;
/**
 * Transforms a function into a decorator function.
 *
 * @example
 * ```typescript
 * function log(func: Function, message: string) {
 *   return function (...args: unknown[]) {
 *     console.log(message);
 *     return func(...args);
 *   };
 * }
 *
 * const logger = toDecorator(log);
 *
 * class TestClass {
 *   @logger("Hello world!")
 *   testMethod() {
 *     return 1;
 *   }
 * }
 *
 * const instance = new TestClass();
 * instance.testMethod();
 * // => Log "Hello World" and return 1
 * ```
 * @param func The function to transform.
 * @returns A decorator function that can be used to decorate a method.
 */
declare function toDecorator<TFunc extends GenericFunction<TFunc>>(func: TFunc): (...args: Tail<Parameters<TFunc>>) => (originalMethod: unknown, _context: ClassMethodDecoratorContext) => ReturnType<TFunc>;

/**
 * Creates a debounced version of a function. Only calling it after a specified amount of time has passed without any new calls.
 *
 * **Methods:**
 * - `cancel()` will cancel the next invocation of the debounced function.
 * - `flush()` will immediately invoke the debounced function and cancel any pending invocations.
 * - `pending()` returns true if the debounced function is set to invoke.
 *
 * This function can be used as a decorator with {@link decDebounce}.
 *
 * @example
 * const sayHello = (name: string) => console.log(`Hello, ${name}!`);
 * const debouncedSayHello = debounce(sayHello, 200);
 *
 * debouncedSayHello("John");
 * debouncedSayHello("Jane");
 * // => Only the second invocation of `debouncedSayHello` is executed, after a delay of 200ms.
 * @param func The function to debounce.
 * @param wait The number of milliseconds to wait before invoking `func`.
 * @returns A debounced version of `func` with `cancel` and `flush` methods.
 */
declare function debounce<TFunc extends GenericFunction<TFunc>>(func: TFunc, wait: number): TFunc & {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
};

/**
 * Creates a function that invokes the given function as long as it's called `<= n` times.
 *
 * Subsequent calls to the created function return the result of the last `func` invocation.
 *
 * This function can be used as a decorator with {@link decMaxCalls}.
 * @example
 * let count = 0;
 * const addCount = () => ++count;
 *
 * // Allow addCount to be invoked twice.
 * const limitAddCount = maxCalls(addCount, 2)
 *
 * limitAddCount() // => 1
 * limitAddCount() // => 2
 * limitAddCount() // => 2
 * // => `limitAddCount` is invoked twice and the result is cached.
 * @param n The number of calls before the cached result is returned.
 * @param func The function to restrict.
 * @returns Returns the new restricted function.
 */
declare function maxCalls<TFunc extends GenericFunction<TFunc>>(func: TFunc, n: number): TFunc;

/**
 * Creates a function that invokes the given function once it's called more than `n` times.
 * Returns undefined until the minimum call count is reached.
 *
 * This function can be used as a decorator with {@link decMinCalls}.
 * @example
 * const caution = () => console.log("Caution!");
 * const limitedCaution = minCalls(caution, 2);
 *
 * limitedCaution()
 * limitedCaution()
 * limitedCaution()
 * // => `caution` is invoked on the third call.
 * @param n The number of calls before the given function is invoked.
 * @param func The function to restrict.
 * @returns Returns the new restricted function.
 */
declare function minCalls<TFunc extends GenericFunction<TFunc>>(func: TFunc, n: number): (this: unknown, ...args: Parameters<TFunc>) => ReturnType<TFunc> | undefined;

/**
 * Generates a function that invokes the given function `func` at most once per every `wait` milliseconds.
 * The throttled function always returns the result of the last `func` invocation.
 *
 * This function can be used as a decorator with {@link decThrottle}.
 * @example
 * const throttled = throttle(() => console.log("Throttled!"), 1000);
 *
 * throttled();
 * throttled();
 * // => "Throttled!" is logged once per second.
 * @param func The function to throttle.
 * @param wait The number of milliseconds to throttle invocations to.
 * @returns Returns the new throttled function.
 */
declare function throttle<TFunc extends GenericFunction<TFunc>>(func: TFunc, wait: number): TFunc;

/**
 * Invokes a function `n` times, returning an array of the results of
 * each invocation.
 *
 * @example
 * times(index => console.log("Run", index), 3)
 * // => "Run 0" | "Run 1" | "Run 2"
 * times(Math.random, 3)
 * // => [0.123, 0.456, 0.789]
 * times(() => 0, 4)
 * // => [0, 0, 0, 0]
 * @param n The number of times to invoke `func`.
 * @param func The function invoked per iteration.
 * @returns Returns an array of results.
 */
declare function times<TInput>(func: (index: number) => TInput, n: number): TInput[];

/**
 * Calculates the average of an array of numbers
 *
 * Returns `NaN` if the input array is empty.
 * @example
 * average([1, 2, 3, 4, 5]) // => 3
 *
 * @param numbers The input array of numbers
 * @returns The average of the input array, or NaN if the input array is empty
 */
declare function average(numbers: readonly number[]): number;

/**
 * Calculates the median of an array of numbers
 *
 * Returns `NaN` if the input array is empty.
 * @example
 * median([1, 2, 3, 4, 5]) // => 3
 * median([1, 2, 3, 4, 5, 6]) // => 3.5
 *
 * @param numbers The input array of numbers
 * @returns The median of the input array
 */
declare function median(numbers: readonly number[]): number;

/**
 * Rounds a number to the given precision.
 *
 * @example
 * round(1.23456, 2); // => 1.23
 * round(1.235, 1); // => 1.2
 * round(1234.56); // => 1234.56
 *
 * @param number The number to be rounded.
 * @param precision The number of decimal places to round to. Defaults to 2.
 * @returns The rounded number.
 */
declare function round(number: number, precision?: number): number;

/**
 * Calculates the sum of an array of numbers.
 *
 * Returns `NaN` if the input array is empty.
 * @example
 * sum([1, 2, 3, 4, 5]) // => 15
 *
 * @param numbers The input array of numbers
 * @returns The sum of the input array
 */
declare function sum(numbers: readonly number[]): number;

type GenericObject = Record<PropertyKey, any>;

type StringIfNever<Type> = [Type] extends [never] ? string : Type;
type PathOrString<TObj> = StringIfNever<Paths$1<TObj, {
    bracketNotation: true;
    maxRecursionDepth: 20;
}>>;
/**
 * Flattens an object into a single level object.
 *
 * @example
 * const obj = { a: { b: 2, c: [{ d: 3 }, { d: 4 }] } };
 * flatKeys(obj);
 * // => { 'a.b': 2, 'a.c[0].d': 3, 'a.c[1].d': 4 }
 *
 * @param obj The object to flatten.
 * @template TObj The type of the object to flatten.
 * @returns A new object with flattened keys.
 */
declare function flatKeys<TObj extends GenericObject>(obj: TObj): Record<PathOrString<TObj>, unknown>;

/**
 * The type of a plain object.
 *
 * This is a more strict type than the `object` type which also includes functions and arrays.
 *
 * You can validate if a value is a plain object with {@link isPlainObject}.
 * @example
 * let obj: PlainObject = { a: 1, b: 2 };
 *
 * obj = [1, 2, 3];
 * // => Type 'number[]' is not assignable to type 'PlainObject'.
 */
type PlainObject = Record<PropertyKey, unknown>;

/**
 * This function combines two or more objects into a single new object. Arrays and other types are overwritten.
 *
 * @example
 * // ---- Nested objects are merged ----
 * merge({ a: 1 }, { b: 2 }, { c: 3, d: { e: 4 } })
 * // => { a: 1, b: 2, c: 3, d: { e: 4 } }
 *
 * // ---- Other types are overwritten ----
 * merge({ a: [1, 2] }, { a: [3, 4] })
 * // => { a: [3, 4] }
 *
 * merge({ a: 1 }, { a: "Yes" })
 * // => { a: "Yes" }
 * @param target The target object
 * @param sources The source objects
 * @template TTarget The type of the target object
 * @template TSources The type of the source objects
 * @returns A new merged object
 */
declare function merge<TTarget extends GenericObject, TSources extends ArrayMinLength<GenericObject, 1>>(target: TTarget, ...sources: TSources): MergeDeepObjects<[TTarget, ...TSources]>;
type OptionalPropertyNames<T> = {
    [K in keyof T]-?: (PlainObject extends {
        [P in K]: T[K];
    } ? K : never);
}[keyof T];
type SpreadProperties<L, R, K extends keyof L & keyof R> = {
    [P in K]: L[P] | Exclude<R[P], undefined>;
};
type Id<T> = T extends infer U ? {
    [K in keyof U]: U[K];
} : never;
type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>>;
type MergeDeepObjects<A extends readonly [...unknown[]]> = A extends [infer L, ...infer R] ? SpreadTwo<L, MergeDeepObjects<R>> : unknown;

/**
 * Omit specified keys from an object
 *
 * @example
 * const obj = {a: 1, b: 2, c: 3};
 * omit(obj, ['a', 'b']);
 * // => {c: 3}
 *
 * @param object The object to filter
 * @param keysToOmit The keys to exclude from the returned object
 * @template TObj The type of the object
 * @returns - An object without the specified keys
 */
declare function omit<TObj extends GenericObject, Key extends keyof TObj>(object: TObj, keysToOmit: Key[]): Omit<TObj, Key>;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @example
 * const object = { 'a': 1, 'b': '2', 'c': 3 }
 *
 * pick(object, ['a', 'c'])
 * // => { 'a': 1, 'c': 3 }
 * @param object The source object.
 * @param keysToPick The property paths to pick.
 * @template TObj The type of the object.
 * @returns Returns the new object.
 */
declare function pick<TObj extends GenericObject, Key extends keyof TObj>(object: TObj, keysToPick: Key[]): Pick<TObj, Key>;

type Paths<TObj> = Call<Objects.AllPaths, TObj> | string & {};
type UpdateObj<TObj extends PlainObject, TPath extends string, TVal> = Call<Objects.Update<TPath, TVal>, TObj>;
/**
 * Sets the value at path of object. If a portion of path doesn’t exist, it’s created.
 *
 * @example
 * const obj = { a: { b: 2 } };
 * set(obj, 'a.c', 1);
 * // => { a: { b: 2, c: 1 } }
 *
 * // `[number]` can be used to access array elements
 * set(obj, 'a.c[0]', 'hello');
 * // => { a: { b: 2, c: ['hello'] } }
 *
 * // numbers with dots are treated as keys
 * set(obj, 'a.c.0.d', 'world');
 * // => { a: { b: 2, c: { 0: { d: 'world' } } }
 *
 * // supports numbers in keys
 * set(obj, 'a.e0.a', 1);
 * // => { a: { e0: { a: 1 } } }
 *
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 * @template TObj The type of the object.
 * @template TPath The type of the object path.
 * @template TVal The type of the value to set.
 * @returns The modified object.
 */
declare function set<TObj extends GenericObject, TPath extends Paths<TObj>, TVal>(obj: TObj, path: TPath, value: TVal): UpdateObj<TObj, TPath, TVal>;

/**
 * A class managing an async function queue with limited concurrency (e.g., 10 functions with 3 running at a time).
 *
 * **Methods:**
 * - `add` - Adds an async function or array of functions to the queue. Returns a promise that resolves or rejects when the added function(s) finish.
 * - `clear` - Clears the queue.
 * - `pause` - Pauses the queue.
 * - `resume` - Resumes the queue.
 * - `getQueue` - Returns the current queue.
 * - `isPaused` - Returns whether the queue is paused.
 * - `done` - Returns a promise resolving when all added tasks are finished. Individual rejections don't affect the done() promise.
 *
 * @example
 * // Create a queue that can run 3 tasks concurrently
 * const queue = new Queue(3);
 *
 * queue.add(() => fetch('https://example.com'));
 *
 * queue.add(async () => {
 *   const response = await fetch('https://example.com');
 *   return response.json();
 * });
 *
 * await queue.done();
 * console.log("All tasks finished");
 *
 * // Add an array of tasks to the queue and wait for them to resolve
 * await queue.add([
 *   () => fetch('https://apple.com'),
 *   () => fetch('https://microsoft.com')
 * ]);
 * // => [Response, Response]
 */
declare class Queue {
    private running;
    private maxConcurrent;
    private paused;
    private queue;
    private finishedPromise;
    private finishedResolver;
    /**
     * @constructor
     * @param maxConcurrent The maximum number of async functions to run concurrently.
     */
    constructor(maxConcurrent: number);
    /**
     * Add async functions or an array of async functions to the queue.
     *
     * @param asyncFn The async function(s) to add to the queue.
     * @returns A promise that resolves when the added function(s) finishes.
     */
    add<TProm, TAsyncFn extends () => Promise<TProm>>(asyncFn: TAsyncFn): Promise<TProm>;
    add<TProm, TAsyncFn extends () => Promise<TProm>>(asyncFn: TAsyncFn[]): Promise<TProm[]>;
    private buildWaitingPromise;
    private run;
    /** Removes all the tasks from the queue */
    clear(): void;
    /** Pauses the execution of the queue */
    pause(): void;
    /** Resumes the execution of the tasks in the queue */
    resume(): void;
    /** Return the tasks added to the queue */
    getQueue(): (() => Promise<any>)[];
    /** Returns whether the queue is paused */
    isPaused(): boolean;
    /** Returns a shared promise that resolves when the queue is empty and all tasks have finished executing. */
    done(): Promise<boolean>;
    private checkIfDone;
}

/**
 * Similar to [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race?retiredLocale=de)
 * but allows to specify how many promises to wait for.
 *
 * @example
 * const prom1 = Promise.resolve(1);
 * const prom2 = new Promise(resolve => setTimeout(resolve, 100, 2));
 * const prom3 = Promise.resolve(3);
 *
 * const firstTwo = await races(2, prom1, prom2, prom3);
 * // => [1, 3]
 *
 * @template TRes The type of the result of the promises.
 * @param waitFor The number of promises to wait for.
 * @param promises The promises to wait for.
 * @returns A promise that resolves an array of the results of the first n promises.
 */
declare function races<TRes>(waitFor: number, ...promises: Promise<TRes>[]): Promise<TRes[]>;

/**
 * Retry a function until it succeeds or the maximum number of retries is reached.
 *
 * Default maxRetries: `5`.
 * Default backoff: `2^retries * 100ms` (100, 200, 400, 800, 1600, 3200, ...)
 *
 * @example
 * await retry(() => fetch('https://example.com'));
 *
 * // ---- Advanced example ----
 * const fetchSite = async () => {
 *   const response = await fetch('https://example.com');
 *   if(!response.ok)
 *     throw new Error('Failed to fetch');
 * }
 *
 * const logger = (error: unknown, retry?: number) => console.log("Retrying", retry, error);
 *
 * await retry(fetchSite, { maxRetries: 3, backoff: retries => retries * 1000, onRetry: logger });
 * // => Will retry 3 times with a 1 second delay between each retry.
 * // => Will log the error and retry number.
 *
 * @param func The function to retry.
 * @param options The options for the retry.
 * @param options.maxRetries The maximum number of retries. Defaults to `5`.
 * @param options.backoff The backoff function to use. Defaults to `2^retries * 100`.
 * @param options.onRetry The function to call when a retry is attempted. It will be called with the error and the attempt number.
 * @template TRes The type of the result of the function.
 * @returns A promise that resolves when the function succeeds.
 */
declare function retry<TRes>(func: () => Promise<TRes>, options?: {
    maxRetries?: number;
    backoff?: ((retries: number) => number);
    onRetry?: (error?: unknown, attempted?: number) => void;
}): Promise<TRes>;

/**
 * Sleeps for the given amount of time.
 *
 * @example
 * await sleep(1000);
 * // => Waits for 1 second.
 * @param ms  Amount of time to sleep in milliseconds.
 * @returns A promise that resolves after the given amount of time.
 */
declare function sleep(ms: number): Promise<unknown>;

/**
 * Returns a new promise that will reject with an error after a specified timeout.
 *
 * @example
 * try {
 *   await timeout(fetch('https://example.com'), 1000);
 * } catch (error) {
 *   console.log(error.message);
 *   // => 'Promise timed out after 1000ms'
 * }
 * @template TRes - The type of the resolved value.
 * @param promise The promise to wrap.
 * @param timeout The timeout in milliseconds.
 *
 * @returns A new promise that will reject with an error after the specified timeout.
 */
declare function timeout<TRes>(promise: Promise<TRes>, timeout: number): Promise<TRes>;

/**
 * Attempts to execute a promise and returns an array with the result or error.
 *
 * This is useful for handling errors in async functions without try/catch blocks.
 *
 * @example
 * ```typescript
 * const [data, error] = await tryCatch(fetch('https://example.com/api'));
 * if (error)
 *   console.error(`Error: ${error.message}`);
 * ```
 * @param promise A Promise to be executed.
 * @returns A Promise that resolves to an array containing the result or error.
 * If the Promise executes successfully, the array contains the result and a null error.
 * If the Promise throws an error, the array contains undefined for the result and the error object.
 *
 * @template TRes The type of the result.
 */
declare function tryCatch<TRes>(promise: Promise<TRes>): Promise<[TRes, undefined] | [undefined, Error]>;

/**
 * Converts `string` to camelCase.
 *
 * @example
 * camelCase('Foo Bar')
 * // => 'fooBar'
 * camelCase('--foo-bar--')
 * // => 'fooBar'
 * camelCase('__FOO_BAR__')
 * // => 'fooBar'
 * @param str The string to convert.
 * @returns Returns the camel cased string.
 */
declare function camelCase(str: string): string;

/**
 * Converts the first character of a string to upper case and the remaining to lower case.
 *
 * @example
 * capitalize('FRED')
 * // => 'Fred'
 * @param str The string to capitalize.
 * @returns Returns the capitalized string.
 */
declare function capitalize(str: string): string;

/**
 * Deburrs a string by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @example
 * deburr('déjà vu')
 * // => 'deja vu'
 * @param str The string to deburr.
 * @returns Returns the deburred string.
 */
declare function deburr(str: string): string;

/**
 * Converts the characters `&`, `<`, `>`, `"` and `'` in a string to their corresponding HTML entities.
 *
 * @example
 * escapeHtml('fred, barney, & pebbles')
 * // => 'fred, barney, &amp; pebbles'
 * @param str The string to escape.
 * @returns Returns the escaped string.
 */
declare function escapeHtml(str: string): string;

/**
 * Escapes the `RegExp` special characters `^`, `$`, `\`, `.`, `*`, `+`,
 * `?`, `(`, `)`, `[`, `]`, `{`, `}`, and `|` in a string.
 *
 * @example
 * escapeRegExp('[moderndash](https://moderndash.io/)')
 * // => '\[moderndash\]\(https://moderndash\.io/\)'
 * @param str The string to escape.
 * @returns Returns the escaped string.
 */
declare function escapeRegExp(str: string): string;

/**
 * Converts a string to kebab-case.
 *
 * @example
 * kebabCase('Foo Bar')
 * // => 'foo-bar'
 * kebabCase('fooBar')
 * // => 'foo-bar'
 * kebabCase('__FOO_BAR__')
 * // => 'foo-bar'
 *
 * @param str The string to convert.
 * @returns Returns the kebab cased string.
 */
declare function kebabCase(str: string): string;

/**
 * Converts a string to PascalCase.
 *
 * @example
 * pascalCase('Foo Bar')
 * // => 'FooBar'
 * pascalCase('fooBar')
 * // => 'FooBar'
 * pascalCase('__FOO_BAR__')
 * // => 'FooBar'
 *
 * @param str The string to convert.
 * @returns Returns the pascal cased string.
 */
declare function pascalCase(str: string): string;

/**
 * Replaces the last occurrence of a string.
 *
 * @example
 * ```typescript
 * replaceLast("Foo Bar Bar", "Bar", "Boo");
 * // => "Foo Bar Boo"
 * ```
 *
 * @param str The string to replace in.
 * @param searchFor The string to search for.
 * @param replaceWith The string to replace with.
 * @returns The replaced string.
 */
declare function replaceLast(str: string, searchFor: string, replaceWith: string): string;

/**
 * Converts a string to snake_case.
 *
 * @example
 * snakeCase('Foo Bar')
 * // => 'foo_bar'
 * snakeCase('fooBar')
 * // => 'foo_bar'
 * snakeCase('--FOO-BAR--')
 * // => 'foo_bar'
 * snakeCase('foo2bar')
 * // => 'foo_2_bar'
 *
 * @param str The string to convert.
 * @returns Returns the snake cased string.
 */
declare function snakeCase(str: string): string;

/**
 * Split a string into words. Can deal with camelCase, PascalCase & snake_case.
 *
 * @example
 * splitWords('camelCase')
 * // => ['camel', 'Case']
 *
 * splitWords('PascalCase')
 * // => ['Pascal', 'Case']
 *
 * splitWords('hello_world-123')
 * // => ['hello', 'world', '123']
 *
 * @param str The string to split into words.
 * @returns An array of words.
 */
declare function splitWords(str: string): string[];

/**
 * Converts a string to Title Case.
 *
 * @example
 * titleCase('--foo-bar--')
 * // => 'Foo Bar'
 * titleCase('fooBar')
 * // => 'Foo Bar'
 * titleCase('__FOO_BAR__')
 * // => 'Foo Bar'
 * titleCase('HélloWorld')
 * // => 'Hello World'
 * @param str The string to convert.
 * @returns Returns the title cased string.
 */
declare function titleCase(str: string): string;

/**
 * Trim the string from the left and right by the given characters
 *
 * *Use the native [trim](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) method if you want to trim whitespace.*
 * @example
 * ```ts
 * trim('$$abc$', '$') // => 'abc'
 * trim('!!abc_!', '_!') // => 'abc'
 * ```
 * @param str The string to trim
 * @param chars The characters to trim
 * @returns The trimmed string
 */
declare function trim(str: string, chars: string): string;

/**
 * Trims the specified characters from the end of the string.
 *
 * *Use the native [trimEnd](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd) method if you want to trim whitespace.*
 * @example
 * ```ts
 * trimEnd('abc$$$', '$') // => 'abc'
 * trimEnd('abc_!!_', '_!') // => 'abc'
 * ```
 * @param str The string to trim
 * @param chars The characters to trim
 * @returns The trimmed string
 */
declare function trimEnd(str: string, chars: string): string;

/**
 * Trims specified characters from the start of the string.
 *
 * *Use the native [trimStart](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart) method if you want to trim whitespace.*
 * @example
 * ```ts
 * trimStart('$$$abc', '$') // => 'abc'
 * trimStart('_!!_abc', '_!') // => 'abc'
 * ```
 * @param str The string to trim
 * @param chars The characters to trim
 * @returns The trimmed string
 */
declare function trimStart(str: string, chars: string): string;

/**
 * Truncates a string if it's longer than the given maximum length.
 * The last characters of the truncated string are replaced with the ellipsis
 * string which defaults to "...".
 *
 * @example
 * truncate("Hello, world!", { length: 5 })
 * // => "Hello..."
 *
 * truncate("Hello, world!", { length: 5, ellipsis: " [...]" })
 * // => "Hello [...]"
 *
 * truncate("Hello, world!", { length: 5, separator: " " })
 * // => "Hello, ..."
 *
 * @param str The string to truncate
 * @param options The options object
 * @param options.length The maximum string length (default: 30)
 * @param options.ellipsis The string to indicate text is omitted (default: "...")
 * @param options.separator The separator pattern to truncate to (default: none)
 * @returns The truncated string
 */
declare function truncate(str: string, options?: {
    length?: number;
    ellipsis?: string;
    separator?: string;
}): string;

/**
 * Converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&#39;`
 * in a string to their corresponding characters.
 *
 * @example
 * unescapeHtml('fred, barney, &amp; pebbles')
 * // => 'fred, barney, & pebbles'
 * @param str The string to unescape.
 * @returns Returns the unescaped string.
 */
declare function unescapeHtml(str: string): string;

/**
 * Checks if a value is empty.
 *
 * Supports: strings, arrays, objects, maps, sets, typed arrays.
 * @example
 * isEmpty(null)
 * // => true
 *
 * isEmpty({})
 * // => true
 *
 * isEmpty("")
 * // => true
 *
 * isEmpty([1, 2, 3])
 * // => false
 *
 * isEmpty('abc')
 * // => false
 *
 * isEmpty({ 'a': 1 })
 * // => false
 * @param value The value to check.
 * @returns Returns `true` if `value` is empty, else `false`.
 */
declare function isEmpty(value: string | object | null | undefined): boolean;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * Supports: primitives, arrays, objects, dates, regexes, maps, sets, buffers, typed arrays
 *
 * @example
 * const object = { a: { b: 2 } };
 * const other = { a: { b: 2 } };
 *
 * isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 * @param a The value to compare.
 * @param b The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 */
declare function isEqual(a: unknown, b: unknown): boolean;

/**
 * Checks if the value is a plain object.
 *
 * Refers to the {@link PlainObject} type.
 * @example
 * isPlainObject({}) // => true
 * isPlainObject({ a: 1 }) // => true
 * isPlainObject(null) // => false
 * isPlainObject('1') // => false
 * isPlainObject([]) // => false
 * isPlainObject(new Function()) // => false
 * isPlainObject(new Date()) // => false
 * @param value The value to check
 * @returns Boolean indicating if the value is a plain object
 */
declare function isPlainObject(value: unknown): value is PlainObject;

/**
 * Checks if given string is a valid URL
 *
 * @deprecated
 * **Deprecated: Use the native "URL.canParse" method instead.**
 *
 * @example
 * isUrl('https://google.com')
 * // => true
 * isUrl('google.com')
 * // => false
 * @param str The string to check.
 * @returns Returns `true` if given string is a valid URL, else `false`.
 */
declare function isUrl(str: string): boolean;

export { type ArrayMinLength, type GenericFunction, type GenericObject, type Jsonifiable, type PlainObject, Queue, average, camelCase, capitalize, chunk, count, debounce, deburr, decDebounce, decMaxCalls, decMemoize, decMinCalls, decThrottle, difference, dropRightWhile, dropWhile, escapeHtml, escapeRegExp, flatKeys, group, hash, intersection, isEmpty, isEqual, isPlainObject, isUrl, kebabCase, maxCalls, median, memoize, merge, minCalls, move, omit, pascalCase, pick, races, randomElem, randomFloat, randomInt, randomString, range, replaceLast, retry, round, set, shuffle, sleep, snakeCase, sort, splitWords, sum, takeRightWhile, takeWhile, throttle, timeout, times, titleCase, toDecorator, trim, trimEnd, trimStart, truncate, tryCatch, unescapeHtml, unique };
