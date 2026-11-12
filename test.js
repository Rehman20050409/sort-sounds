// Run with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { SORTS } = require('./sorts.js');

// Runs a sort to the end and returns how many steps of each kind it took.
function run(sort, a) {
  const counts = { compare: 0, swap: 0, write: 0 };
  for (const [kind, i, j = i] of sort(a)) {
    counts[kind]++;
    assert.ok(i >= 0 && i < a.length && j >= 0 && j < a.length, `${kind} ${i},${j} is outside the array`);
  }
  return counts;
}

const cases = {
  empty: [],
  one: [7],
  sorted: [1, 2, 3, 4, 5, 6],
  reversed: [6, 5, 4, 3, 2, 1],
  duplicates: [3, 1, 3, 2, 1, 3, 2, 2],
  random: Array.from({ length: 200 }, (_, i) => (i * 7919) % 211), // fixed, so a failure can be repeated
};

for (const [name, sort] of Object.entries(SORTS)) {
  test(`${name} sorts every kind of input`, () => {
    for (const [label, input] of Object.entries(cases)) {
      const a = [...input];
      run(sort, a);
      assert.deepEqual(a, [...input].sort((x, y) => x - y), label);
    }
  });
}

test('step counts match what each algorithm should cost', () => {
  const sorted = () => Array.from({ length: 50 }, (_, i) => i);
  // already sorted: bubble and insertion stop after one pass, selection still checks every pair
  assert.deepEqual(run(SORTS['Bubble sort'], sorted()), { compare: 49, swap: 0, write: 0 });
  assert.deepEqual(run(SORTS['Insertion sort'], sorted()), { compare: 49, swap: 0, write: 0 });
  assert.equal(run(SORTS['Selection sort'], sorted()).compare, 50 * 49 / 2);
  // merge sort needs far fewer comparisons than bubble sort on a jumbled list
  const merge = run(SORTS['Merge sort'], [...cases.random]).compare;
  const bubble = run(SORTS['Bubble sort'], [...cases.random]).compare;
  assert.ok(merge < bubble / 5, `merge ${merge} vs bubble ${bubble}`);
});
