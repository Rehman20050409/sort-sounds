# Sort Sounds

Watch and **hear** sorting algorithms. Every comparison plays a note: short bars are low, tall bars are high. Bubble sort chirps its way up the scale; merge sort plays in tidy phrases.

Five algorithms: bubble, insertion, selection, merge and quick sort. You can change how many bars there are and how fast it runs, and it counts the comparisons and writes each one needs.

## Try it

Open `index.html` in a browser and press **Play**. No build step, no dependencies.

## How it works

Each algorithm in [`sorts.js`](sorts.js) is a **generator**: a function that can pause in the middle and carry on later. It sorts the array in place and pauses after every comparison or write, handing back what it just did:

```js
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
```

That keeps each algorithm looking like the textbook version, with no drawing or timing code mixed in. The page pulls steps out at whatever speed the slider says, draws the bars on a canvas, and plays a short note with the Web Audio API, pitched by the height of the bar.

The sorting code never touches the page, so the tests run it directly.

## Tests

```
node --test
```

They check that every algorithm sorts empty, single, sorted, reversed, duplicate-heavy and jumbled lists, never reaches outside the array, and costs what it should (for example, bubble sort stops after one pass on a sorted list).
