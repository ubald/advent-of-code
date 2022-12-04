import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '3');

  const values: Record<string, number> = {};
  for (let i = 0; i <= 26; i++) {
    values[String.fromCharCode(97 + i)] = 1 + i;
    values[String.fromCharCode(65 + i)] = 27 + i;
  }

  let prioritiesPart1 = 0;
  let prioritiesPart2 = 0;

  const rucksacks = [];

  // Part 1
  for (const line of input.split('\n')) {
    if (!line.length) {
      continue;
    }

    const items = line.split('');
    rucksacks.push(items);
    const compartments = [items.slice(0, items.length / 2), items.slice(items.length / 2)];

    for (const itemA of compartments[0]) {
      const common = compartments[1].includes(itemA);
      if (!common) {
        continue;
      }

      prioritiesPart1 += values[itemA];
      break;
    }
  }

  // Part 2
  for (let i = 0; i < rucksacks.length; i += 3) {
    const sack1 = rucksacks[i];
    const sack2 = rucksacks[i + 1];
    const sack3 = rucksacks[i + 2];

    for (const item1 of sack1) {
      const common2 = sack2.includes(item1);
      if (!common2) {
        continue;
      }

      const common3 = sack3.includes(item1);
      if (!common3) {
        continue;
      }

      prioritiesPart2 += values[item1];
      break;
    }
  }

  console.log('Priorities Part 1:', prioritiesPart1);
  console.log('Priorities Part 2:', prioritiesPart2);
}
