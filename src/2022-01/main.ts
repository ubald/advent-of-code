import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '1');

  const elves = [];

  for (const elfBlock of input.split('\n\n')) {
    const elfCalories = elfBlock
      .split('\n')
      .map((line) => parseInt(line, 10))
      .reduce((a, b) => a + b, 0);
    elves.push({ calories: elfCalories });
  }

  elves.sort((a, b) => b.calories - a.calories);

  console.log('Max calories:', elves[0].calories);
  console.log(
    'Top 3 calories:',
    elves.slice(0, 3).reduce((a, b) => a + b.calories, 0),
  );
}
