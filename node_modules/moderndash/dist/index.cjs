"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Queue: () => Queue,
  average: () => average,
  camelCase: () => camelCase,
  capitalize: () => capitalize,
  chunk: () => chunk,
  count: () => count,
  debounce: () => debounce,
  deburr: () => deburr,
  decDebounce: () => decDebounce,
  decMaxCalls: () => decMaxCalls,
  decMemoize: () => decMemoize,
  decMinCalls: () => decMinCalls,
  decThrottle: () => decThrottle,
  difference: () => difference,
  dropRightWhile: () => dropRightWhile,
  dropWhile: () => dropWhile,
  escapeHtml: () => escapeHtml,
  escapeRegExp: () => escapeRegExp,
  flatKeys: () => flatKeys,
  group: () => group,
  hash: () => hash,
  intersection: () => intersection,
  isEmpty: () => isEmpty,
  isEqual: () => isEqual,
  isPlainObject: () => isPlainObject,
  isUrl: () => isUrl,
  kebabCase: () => kebabCase,
  maxCalls: () => maxCalls,
  median: () => median,
  memoize: () => memoize,
  merge: () => merge,
  minCalls: () => minCalls,
  move: () => move,
  omit: () => omit,
  pascalCase: () => pascalCase,
  pick: () => pick,
  races: () => races,
  randomElem: () => randomElem,
  randomFloat: () => randomFloat,
  randomInt: () => randomInt,
  randomString: () => randomString,
  range: () => range,
  replaceLast: () => replaceLast,
  retry: () => retry,
  round: () => round,
  set: () => set,
  shuffle: () => shuffle,
  sleep: () => sleep,
  snakeCase: () => snakeCase,
  sort: () => sort,
  splitWords: () => splitWords,
  sum: () => sum,
  takeRightWhile: () => takeRightWhile,
  takeWhile: () => takeWhile,
  throttle: () => throttle,
  timeout: () => timeout,
  times: () => times,
  titleCase: () => titleCase,
  toDecorator: () => toDecorator,
  trim: () => trim,
  trimEnd: () => trimEnd,
  trimStart: () => trimStart,
  truncate: () => truncate,
  tryCatch: () => tryCatch,
  unescapeHtml: () => unescapeHtml,
  unique: () => unique
});
module.exports = __toCommonJS(src_exports);

// src/array/chunk.ts
function chunk(array, chunkSize) {
  const intSize = Math.trunc(chunkSize);
  if (array.length === 0 || intSize < 1)
    return [];
  let index = 0;
  let resultIndex = 0;
  const result = new Array(Math.ceil(array.length / intSize));
  while (index < array.length) {
    result[resultIndex++] = array.slice(index, index += intSize);
  }
  return result;
}

// src/array/count.ts
function count(array, criteria) {
  const result = {};
  for (const value of array) {
    const key = criteria(value);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

// src/helpers/fastArrayFlat.ts
function fastArrayFlat(arrays) {
  let result = arrays.shift() ?? [];
  for (const array of arrays) {
    result = [...result, ...array];
  }
  return result;
}

// src/array/difference.ts
function difference(...arraysOrCompareFn) {
  const compareFnProvided = typeof arraysOrCompareFn.at(-1) === "function";
  const compareFunction = compareFnProvided && arraysOrCompareFn.pop();
  const arrays = arraysOrCompareFn;
  const firstArray = arrays.shift();
  const combinedRestArray = fastArrayFlat(arrays);
  if (!compareFunction) {
    const restSet = new Set(combinedRestArray);
    return firstArray.filter((element) => !restSet.has(element));
  }
  const difference2 = [];
  for (const element of firstArray) {
    if (combinedRestArray.every((item) => !compareFunction(element, item))) {
      difference2.push(element);
    }
  }
  return difference2;
}

// src/array/dropRightWhile.ts
function dropRightWhile(array, predicate) {
  let i = array.length;
  while (i > 0 && predicate(array[i - 1])) {
    i--;
  }
  return array.slice(0, i);
}

// src/array/dropWhile.ts
function dropWhile(array, predicate) {
  const index = array.findIndex((x) => !predicate(x));
  return array.slice(index === -1 ? array.length : index);
}

// src/array/group.ts
function group(array, getGroupKey) {
  const result = {};
  for (const elem of array) {
    const key = getGroupKey(elem);
    (result[key] ??= []).push(elem);
  }
  return result;
}

// src/array/unique.ts
function unique(array, compareFn) {
  if (!compareFn)
    return [...new Set(array)];
  const uniqueArray = [];
  for (const value of array) {
    if (!uniqueArray.some((uniqueValue) => compareFn(value, uniqueValue)))
      uniqueArray.push(value);
  }
  return uniqueArray;
}

// src/array/intersection.ts
function intersection(...arraysOrCompareFn) {
  const compareFnProvided = typeof arraysOrCompareFn.at(-1) === "function";
  const compareFunction = compareFnProvided && arraysOrCompareFn.pop();
  const arrays = arraysOrCompareFn;
  const firstArray = unique(arrays.shift());
  const combinedRestArray = fastArrayFlat(arrays);
  if (!compareFunction) {
    const restSet = new Set(combinedRestArray);
    return firstArray.filter((element) => restSet.has(element));
  }
  const intersection2 = [];
  for (const element of firstArray) {
    if (combinedRestArray.some((item) => compareFunction(element, item))) {
      intersection2.push(element);
    }
  }
  return intersection2;
}

// src/array/move.ts
function move(array, fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= array.length)
    throw new Error(`Invalid 'fromIndex': ${fromIndex}. Must be between 0 and ${array.length - 1}.`);
  if (toIndex < 0 || toIndex >= array.length)
    throw new Error(`Invalid 'toIndex': ${toIndex}. Must be between 0 and ${array.length - 1}.`);
  if (fromIndex === toIndex)
    return array;
  const item = array[fromIndex];
  if (fromIndex < toIndex)
    for (let index = fromIndex; index < toIndex; index++)
      array[index] = array[index + 1];
  else
    for (let index = fromIndex; index > toIndex; index--)
      array[index] = array[index - 1];
  array[toIndex] = item;
  return array;
}

// src/array/range.ts
function range(start, end, step = 1) {
  if (step <= 0)
    throw new Error("The step must be greater than 0.");
  step = start > end ? -step : step;
  const length = Math.floor(Math.abs((end - start) / step)) + 1;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = start + i * step;
  }
  return result;
}

// src/array/shuffle.ts
function shuffle(array) {
  const shuffledArray = [...array];
  for (let index = shuffledArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledArray[index], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[index]];
  }
  return shuffledArray;
}

// src/array/sort.ts
function sort(array, ...criteria) {
  return [...array].sort((a, b) => {
    for (const { order = "asc", by = (item) => item } of criteria) {
      const aValue = by(a);
      const bValue = by(b);
      if (aValue !== bValue) {
        const compare = aValue < bValue ? -1 : 1;
        return order === "asc" ? compare : -compare;
      }
    }
    return 0;
  });
}

// src/array/takeRightWhile.ts
function takeRightWhile(array, predicate) {
  const result = [];
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      result.unshift(array[i]);
    } else {
      break;
    }
  }
  return result;
}

// src/array/takeWhile.ts
function takeWhile(array, predicate) {
  const result = [];
  for (const element of array) {
    if (predicate(element)) {
      result.push(element);
    } else {
      break;
    }
  }
  return result;
}

// src/crypto/hash.ts
var textEncoder;
async function hash(data, algorithm = "SHA-256") {
  textEncoder ??= new TextEncoder();
  const dataBuffer = typeof data === "string" ? textEncoder.encode(data) : textEncoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hexValues = hashArray.map((b) => b.toString(16).padStart(2, "0"));
  return hexValues.join("");
}

// src/crypto/randomInt.ts
function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw new TypeError("min and max must be integers");
  if (min >= max)
    throw new Error("max must be greater than min");
  const range2 = max - min + 1;
  const randomBytes = Math.ceil(Math.log2(range2) / 8);
  const maxRandNumber = Math.pow(256, randomBytes);
  const randomBuffer = new Uint8Array(randomBytes);
  let randomValue;
  do {
    crypto.getRandomValues(randomBuffer);
    randomValue = 0;
    for (let index = 0; index < randomBytes; index++) {
      randomValue = (randomValue << 8) + randomBuffer[index];
    }
  } while (randomValue >= maxRandNumber - maxRandNumber % range2);
  return min + randomValue % range2;
}

// src/crypto/randomElem.ts
function randomElem(array, multi) {
  if (multi === void 0) {
    if (array.length === 0) return void 0;
    return getSingleElement(array);
  }
  if (multi && array.length === 0) return [];
  const result = new Array(multi);
  for (let i = 0; i < multi; i++) {
    result[i] = getSingleElement(array);
  }
  return result;
}
function getSingleElement(array) {
  const randomIndex = randomInt(0, array.length - 1);
  return array[randomIndex];
}

// src/crypto/randomFloat.ts
function randomFloat(min, max) {
  if (min >= max)
    throw new Error("max must be greater than min");
  const randomBuffer = new Uint32Array(2);
  crypto.getRandomValues(randomBuffer);
  const randomBigInt = BigInt(randomBuffer[0]) << 21n | BigInt(randomBuffer[1]) >> 11n;
  const fraction = Number(randomBigInt) / Number.MAX_SAFE_INTEGER;
  return min + fraction * (max - min);
}

// src/crypto/randomString.ts
var DEFAULT_CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function randomString(length, charSet = DEFAULT_CHARSET) {
  if (charSet.length <= 0) return "";
  let result = "";
  for (let index = 0; index < length; index++) {
    const randomIndex = randomInt(0, charSet.length - 1);
    result += charSet[randomIndex];
  }
  return result;
}

// src/decorator/toDecorator.ts
function toDecorator(func) {
  return function(...args) {
    return function(originalMethod, _context) {
      const funcArgs = [originalMethod, ...args];
      return func(...funcArgs);
    };
  };
}

// src/function/debounce.ts
function debounce(func, wait) {
  let timeoutId;
  const debounced = function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = void 0;
    }, wait);
  };
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = void 0;
  };
  debounced.flush = function(...args) {
    debounced.cancel();
    func.apply(this, args);
  };
  debounced.pending = function() {
    return timeoutId !== void 0;
  };
  return debounced;
}

// src/decorator/decDebounce.ts
function decDebounce(wait) {
  return toDecorator(debounce)(wait);
}

// src/function/maxCalls.ts
function maxCalls(func, n) {
  let count2 = 0;
  let result;
  return function(...args) {
    if (count2 < n) {
      count2 += 1;
      result = func.apply(this, args);
    }
    return result;
  };
}

// src/decorator/decMaxCalls.ts
function decMaxCalls(n) {
  return toDecorator(maxCalls)(n);
}

// src/function/memoize.ts
var defaultResolver = (...args) => JSON.stringify(args);
function memoize(func, options = {}) {
  const resolver = options.resolver ?? defaultResolver;
  const ttl = options.ttl;
  const cache = /* @__PURE__ */ new Map();
  const memoizedFunc = function(...args) {
    const key = resolver(...args);
    if (cache.has(key)) {
      const [cacheResult, cacheTime] = cache.get(key);
      if (ttl === void 0 || Date.now() - cacheTime < ttl) {
        return cacheResult;
      }
    }
    const result = func.apply(this, args);
    cache.set(key, [result, Date.now()]);
    return result;
  };
  memoizedFunc.cache = cache;
  return memoizedFunc;
}

// src/decorator/decMemoize.ts
function decMemoize(options = {}) {
  return toDecorator(memoize)(options);
}

// src/function/minCalls.ts
function minCalls(func, n) {
  let count2 = 1;
  return function(...args) {
    if (count2 > n) {
      return func.apply(this, args);
    }
    count2 += 1;
  };
}

// src/decorator/decMinCalls.ts
function decMinCalls(n) {
  return toDecorator(minCalls)(n);
}

// src/function/throttle.ts
function throttle(func, wait) {
  let inThrottle = false;
  let lastResult;
  return function(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
    return lastResult;
  };
}

// src/decorator/decThrottle.ts
function decThrottle(wait) {
  return toDecorator(throttle)(wait);
}

// src/function/times.ts
function times(func, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(func(i));
  }
  return result;
}

// src/number/sum.ts
function sum(numbers) {
  if (numbers.length === 0)
    return NaN;
  return numbers.reduce((total, current) => total + current, 0);
}

// src/number/average.ts
function average(numbers) {
  if (numbers.length === 0)
    return NaN;
  return sum(numbers) / numbers.length;
}

// src/number/median.ts
function median(numbers) {
  if (numbers.length === 0)
    return NaN;
  const sortedArray = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sortedArray.length / 2);
  return sortedArray.length % 2 === 0 ? (sortedArray[mid - 1] + sortedArray[mid]) / 2 : sortedArray[mid];
}

// src/number/round.ts
function round(number, precision = 2) {
  const factor = Math.pow(10, precision);
  return Math.round((number + Number.EPSILON) * factor) / factor;
}

// src/validate/isPlainObject.ts
function isPlainObject(value) {
  return value?.constructor === Object;
}

// src/object/flatKeys.ts
function flatKeys(obj) {
  const flatObject = {};
  for (const [key, value] of Object.entries(obj)) {
    addToResult(key, value, flatObject);
  }
  return flatObject;
}
function addToResult(prefix, value, flatObject) {
  if (isPlainObject(value)) {
    const flatObj = flatKeys(value);
    for (const [flatKey, flatValue] of Object.entries(flatObj)) {
      flatObject[`${prefix}.${flatKey}`] = flatValue;
    }
  } else if (Array.isArray(value)) {
    for (const [index, element] of value.entries()) {
      addToResult(`${prefix}[${index}]`, element, flatObject);
    }
  } else {
    flatObject[prefix] = value;
  }
}

// src/object/merge.ts
function merge(target, ...sources) {
  const targetCopy = { ...target };
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      targetCopy[key] = isPlainObject(value) && isPlainObject(targetCopy[key]) ? merge(targetCopy[key], value) : value;
    }
  }
  return targetCopy;
}

// src/object/pick.ts
function pick(object, keysToPick) {
  const result = {};
  for (const key of keysToPick) {
    result[key] = object[key];
  }
  return result;
}

// src/object/omit.ts
function omit(object, keysToOmit) {
  const allKeys = Object.keys(object);
  const filteredKeys = difference(allKeys, keysToOmit);
  return pick(object, filteredKeys);
}

// src/object/set.ts
var validPathRegex = /^[^.[\]]+(?:\.[^.[\]]+)*(?:\[\d+])*(?:\.[^.[\]]+(?:\[\d+])*)*$/;
var pathSplitRegex = /\.|(?=\[)/g;
var matchBracketsRegex = /[[\]]/g;
function set(obj, path, value) {
  if (!validPathRegex.test(path))
    throw new Error("Invalid path, look at the examples for the correct format.");
  const pathParts = path.split(pathSplitRegex);
  let currentObj = obj;
  for (let index = 0; index < pathParts.length; index++) {
    const key = pathParts[index].replace(matchBracketsRegex, "");
    if (index === pathParts.length - 1) {
      currentObj[key] = value;
      break;
    }
    const nextElementInArray = pathParts[index + 1].startsWith("[");
    const nextElementInObject = !nextElementInArray;
    if (nextElementInArray && !Array.isArray(currentObj[key])) {
      currentObj[key] = [];
    }
    if (nextElementInObject && !isPlainObject(currentObj[key])) {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  }
  return obj;
}

// src/promise/queue.ts
var Queue = class {
  running = 0;
  maxConcurrent;
  paused = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue = [];
  finishedPromise;
  finishedResolver;
  /**
   * @constructor
   * @param maxConcurrent The maximum number of async functions to run concurrently.
   */
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
  }
  add(asyncFn) {
    if (Array.isArray(asyncFn)) {
      const promises = asyncFn.map((fn) => this.buildWaitingPromise(fn));
      return Promise.all(promises);
    } else {
      return this.buildWaitingPromise(asyncFn);
    }
  }
  buildWaitingPromise(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject });
      this.run();
    });
  }
  run() {
    while (this.queue.length > 0 && this.running < this.maxConcurrent && !this.paused) {
      this.running++;
      const queueElement = this.queue.shift();
      void queueElement.asyncFn().then((result) => {
        queueElement.resolve(result);
      }).catch((error) => {
        queueElement.reject(error);
      }).finally(() => {
        this.running--;
        this.run();
      });
    }
    this.checkIfDone();
  }
  /** Removes all the tasks from the queue */
  clear() {
    for (const queueElement of this.queue) {
      queueElement.reject(new Error("Queue cleared"));
    }
    this.queue = [];
  }
  /** Pauses the execution of the queue */
  pause() {
    this.paused = true;
  }
  /** Resumes the execution of the tasks in the queue */
  resume() {
    this.paused = false;
    this.run();
  }
  /** Return the tasks added to the queue */
  getQueue() {
    return this.queue.map((queueElement) => queueElement.asyncFn);
  }
  /** Returns whether the queue is paused */
  isPaused() {
    return this.paused;
  }
  /** Returns a shared promise that resolves when the queue is empty and all tasks have finished executing. */
  done() {
    if (this.queue.length === 0 && this.running === 0)
      return Promise.resolve(true);
    this.finishedPromise ??= new Promise((resolve) => this.finishedResolver = () => resolve(true));
    return this.finishedPromise;
  }
  checkIfDone() {
    if (this.queue.length === 0 && this.running === 0 && this.finishedResolver) {
      this.finishedResolver();
      this.finishedPromise = void 0;
      this.finishedResolver = void 0;
    }
  }
};

// src/promise/races.ts
function races(waitFor, ...promises) {
  return new Promise((resolve, reject) => {
    if (promises.length < waitFor)
      waitFor = promises.length;
    const results = [];
    let resolved = 0;
    for (const promise of promises) {
      promise.then((value) => {
        results.push(value);
        resolved++;
        if (resolved >= waitFor) {
          resolve(results);
        }
      }).catch((error) => {
        reject(error);
      });
    }
  });
}

// src/promise/sleep.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/promise/retry.ts
async function retry(func, options) {
  const backOffFn = options?.backoff ?? ((retries2) => 2 ** retries2 * 100);
  const maxRetries = options?.maxRetries ?? 5;
  const onRetry = options?.onRetry ?? (() => {
  });
  let retries = 0;
  let lastError;
  while (retries <= maxRetries) {
    try {
      if (retries > 0)
        onRetry(lastError, retries);
      return await func();
    } catch (error) {
      lastError = error;
      retries++;
      if (retries > maxRetries) {
        throw error;
      }
      await sleep(backOffFn(retries));
    }
  }
  throw new Error("Retry terminated without success, this should never happen");
}

// src/promise/timeout.ts
function timeout(promise, timeout2) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout2}ms`));
    }, timeout2);
    promise.then(
      (result) => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

// src/promise/tryCatch.ts
async function tryCatch(promise) {
  try {
    const data = await promise;
    return [data, void 0];
  } catch (error) {
    if (error instanceof Error)
      return [void 0, error];
    throw error;
  }
}

// src/string/splitWords.ts
var wordsRegex = /(?:\d*[a-z]+)|(?:[A-Z][a-z]+)|(?:\d*[A-Z]+(?=[^a-z]|$))|\d+/g;
function splitWords(str) {
  return str.match(wordsRegex) ?? [];
}

// src/string/capitalize.ts
function capitalize(str) {
  if (str === "") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// src/string/deburr.ts
var accentControlRegex = /[\u0300-\u036F]/g;
function deburr(str) {
  return str.normalize("NFD").replace(accentControlRegex, "");
}

// src/string/camelCase.ts
function camelCase(str) {
  if (str === "") return "";
  str = deburr(str);
  const words = splitWords(str);
  if (words.length === 0) return "";
  let camelCase2 = words[0].toLowerCase();
  for (let index = 1; index < words.length; index++) {
    const word = words[index];
    camelCase2 += capitalize(word);
  }
  return camelCase2;
}

// src/string/escapeHtml.ts
var charRegex = /["&'<>]/g;
var escapeChars = /* @__PURE__ */ new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"]
]);
function escapeHtml(str) {
  return str.replace(charRegex, (char) => escapeChars.get(char));
}

// src/string/escapeRegExp.ts
var escapeCharsRegex = /[$()*+.?[\\\]^{|}]/g;
function escapeRegExp(str) {
  return str.replace(escapeCharsRegex, "\\$&");
}

// src/string/kebabCase.ts
function kebabCase(str) {
  if (str === "") return "";
  str = deburr(str);
  const words = splitWords(str);
  let kebabCase2 = "";
  for (const word of words) {
    kebabCase2 += word.toLowerCase() + "-";
  }
  return kebabCase2.slice(0, -1);
}

// src/string/pascalCase.ts
function pascalCase(str) {
  if (str === "") return "";
  str = deburr(str);
  const words = splitWords(str);
  let pascalCase2 = "";
  for (const word of words) {
    pascalCase2 += capitalize(word);
  }
  return pascalCase2;
}

// src/string/replaceLast.ts
function replaceLast(str, searchFor, replaceWith) {
  const index = str.lastIndexOf(searchFor);
  if (index === -1)
    return str;
  return str.slice(0, index) + replaceWith + str.slice(index + searchFor.length);
}

// src/string/snakeCase.ts
function snakeCase(str) {
  if (str === "") return "";
  str = deburr(str);
  const words = splitWords(str);
  let snakeCase2 = "";
  for (const word of words) {
    if (snakeCase2.length > 0) {
      snakeCase2 += "_";
    }
    snakeCase2 += word.toLowerCase();
  }
  return snakeCase2;
}

// src/string/titleCase.ts
function titleCase(str) {
  if (str === "") return "";
  str = deburr(str);
  const words = splitWords(str);
  let titleCase2 = "";
  for (const word of words) {
    titleCase2 += capitalize(word) + " ";
  }
  return titleCase2.trimEnd();
}

// src/string/trim.ts
function trim(str, chars) {
  let startIndex = 0;
  while (startIndex < str.length && chars.includes(str[startIndex])) {
    startIndex++;
  }
  let endIndex = str.length - 1;
  while (endIndex >= startIndex && chars.includes(str[endIndex])) {
    endIndex--;
  }
  return str.slice(startIndex, endIndex + 1);
}

// src/string/trimEnd.ts
function trimEnd(str, chars) {
  let lastIndex = str.length - 1;
  while (lastIndex >= 0 && chars.includes(str[lastIndex])) {
    lastIndex--;
  }
  return str.slice(0, lastIndex + 1);
}

// src/string/trimStart.ts
function trimStart(str, chars) {
  let startIndex = 0;
  while (startIndex < str.length && chars.includes(str[startIndex])) {
    startIndex++;
  }
  return str.slice(startIndex);
}

// src/string/truncate.ts
function truncate(str, options) {
  const { length = 30, ellipsis = "...", separator } = options ?? {};
  if (str.length <= length) return str;
  const end = length - ellipsis.length;
  if (end < 1)
    return ellipsis;
  let truncated = str.slice(0, end);
  if (separator) {
    const sepIndex = truncated.lastIndexOf(separator);
    if (sepIndex > -1) {
      truncated = truncated.slice(0, sepIndex);
    }
  }
  return truncated + ellipsis;
}

// src/string/unescapeHtml.ts
var htmlEntitiesRegex = /&(?:amp|lt|gt|quot|#39);/g;
var entityMap = /* @__PURE__ */ new Map([
  ["&amp;", "&"],
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&quot;", '"'],
  ["&#39;", "'"]
]);
function unescapeHtml(str) {
  return str.replace(htmlEntitiesRegex, (entity) => entityMap.get(entity));
}

// src/validate/isEmpty.ts
function isEmpty(value) {
  if (value === null || value === void 0)
    return true;
  if (typeof value === "string" || Array.isArray(value))
    return value.length === 0;
  if (value instanceof Map || value instanceof Set)
    return value.size === 0;
  if (ArrayBuffer.isView(value))
    return value.byteLength === 0;
  if (typeof value === "object")
    return Object.keys(value).length === 0;
  return false;
}

// src/validate/isEqual.ts
function isEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b))
    return isSameArray(a, b);
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp)
    return a.toString() === b.toString();
  if (isPlainObject(a) && isPlainObject(b))
    return isSameObject(a, b);
  if (a instanceof ArrayBuffer && b instanceof ArrayBuffer)
    return dataViewsAreEqual(new DataView(a), new DataView(b));
  if (a instanceof DataView && b instanceof DataView)
    return dataViewsAreEqual(a, b);
  if (isTypedArray(a) && isTypedArray(b)) {
    if (a.byteLength !== b.byteLength) return false;
    return isSameArray(a, b);
  }
  return false;
}
function isSameObject(a, b) {
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);
  if (!isEqual(keys1, keys2)) return false;
  for (const key of keys1) {
    if (!isEqual(a[key], b[key])) return false;
  }
  return true;
}
function isSameArray(a, b) {
  if (a.length !== b.length) return false;
  return a.every((element, index) => isEqual(element, b[index]));
}
function dataViewsAreEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  for (let offset = 0; offset < a.byteLength; offset++) {
    if (a.getUint8(offset) !== b.getUint8(offset)) return false;
  }
  return true;
}
function isTypedArray(value) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

// src/validate/isUrl.ts
function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Queue,
  average,
  camelCase,
  capitalize,
  chunk,
  count,
  debounce,
  deburr,
  decDebounce,
  decMaxCalls,
  decMemoize,
  decMinCalls,
  decThrottle,
  difference,
  dropRightWhile,
  dropWhile,
  escapeHtml,
  escapeRegExp,
  flatKeys,
  group,
  hash,
  intersection,
  isEmpty,
  isEqual,
  isPlainObject,
  isUrl,
  kebabCase,
  maxCalls,
  median,
  memoize,
  merge,
  minCalls,
  move,
  omit,
  pascalCase,
  pick,
  races,
  randomElem,
  randomFloat,
  randomInt,
  randomString,
  range,
  replaceLast,
  retry,
  round,
  set,
  shuffle,
  sleep,
  snakeCase,
  sort,
  splitWords,
  sum,
  takeRightWhile,
  takeWhile,
  throttle,
  timeout,
  times,
  titleCase,
  toDecorator,
  trim,
  trimEnd,
  trimStart,
  truncate,
  tryCatch,
  unescapeHtml,
  unique
});
//# sourceMappingURL=index.cjs.map