// Sorting algorithms written as generators: each one sorts the array in place and pauses
// (yields) after every comparison or write, so the page can draw and play a note per step.
// A step is [kind, i, j]: 'compare' looks at two positions, 'swap' exchanges them, 'write' sets one.
// No DOM in here, so the same file runs in the browser and in Node for the tests.
'use strict';

function swap(a, i, j) {
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
}

function* bubble(a) {
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      yield ['compare', i, i + 1];
      if (a[i] > a[i + 1]) {
        swap(a, i, i + 1);
        swapped = true;
        yield ['swap', i, i + 1];
      }
    }
    if (!swapped) return; // a pass with no swaps means it is already sorted
  }
}

function* insertion(a) {
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0; j--) {
      yield ['compare', j - 1, j];
      if (a[j - 1] <= a[j]) break;
      swap(a, j - 1, j);
      yield ['swap', j - 1, j];
    }
  }
}

function* selection(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      yield ['compare', min, j];
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      swap(a, i, min);
      yield ['swap', i, min];
    }
  }
}

function* merge(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* merge(a, lo, mid);
  yield* merge(a, mid + 1, hi);
  const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1);
  let i = 0, j = 0, k = lo;
  while (i < left.length && j < right.length) {
    yield ['compare', lo + i, mid + 1 + j];
    a[k] = left[i] <= right[j] ? left[i++] : right[j++];
    yield ['write', k++];
  }
  while (i < left.length) {
    a[k] = left[i++];
    yield ['write', k++];
  }
  while (j < right.length) {
    a[k] = right[j++];
    yield ['write', k++];
  }
}

function* quick(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let p = lo; // everything left of p is smaller than the pivot
  for (let i = lo; i < hi; i++) {
    yield ['compare', i, hi];
    if (a[i] < pivot) {
      if (i !== p) {
        swap(a, i, p);
        yield ['swap', i, p];
      }
      p++;
    }
  }
  if (p !== hi) {
    swap(a, p, hi);
    yield ['swap', p, hi];
  }
  yield* quick(a, lo, p - 1);
  yield* quick(a, p + 1, hi);
}

const SORTS = { 'Bubble sort': bubble, 'Insertion sort': insertion, 'Selection sort': selection, 'Merge sort': merge, 'Quick sort': quick };

if (typeof module !== 'undefined') module.exports = { SORTS };
