import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '4');

  const pairs = input
    .split('\n')
    .filter((line) => line.length)
    .map((line) => line.split(',').map((range) => range.split('-').map((n) => parseInt(n, 10))));

  let overlaps = 0;
  let overlapsAtAll = 0;

  for (const pair of pairs) {
    const [range1, range2] = pair;
    const [min1, max1] = range1;
    const [min2, max2] = range2;

    if ((min1 >= min2 && min1 <= max2) || (min2 >= min1 && min2 <= max1)) {
      overlapsAtAll++;
    }

    if (min1 >= min2 && max1 <= max2) {
      overlaps++;
    } else if (min2 >= min1 && max2 <= max1) {
      overlaps++;
    }
  }

  console.log('Overlap:', overlaps, overlapsAtAll);
}
