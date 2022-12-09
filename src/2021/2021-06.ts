import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2021', '6');
  const fishes: Array<number> = input.split(',').map(Number);

  const ageGroups: Record<number, number> = {};
  const MAX_AGE = 8;
  const POST_PARTUM = 6;

  const simulate = (days: number): number => {
    for (const age of fishes) {
      if (ageGroups[age]) {
        ageGroups[age]++;
      } else {
        ageGroups[age] = 1;
      }
    }

    for (let day = 0; day < days; day++) {
      let babies = 0;
      for (let age = 0; age <= MAX_AGE; age++) {
        if (age === 0) {
          babies = ageGroups[age] || 0;
        }

        if (age === MAX_AGE) {
          ageGroups[age] = babies;
        } else {
          ageGroups[age] = ageGroups[age + 1] || 0;
        }

        if (age === POST_PARTUM) {
          ageGroups[age] += babies;
        }
      }
    }

    return Object.values(ageGroups).reduce((sum, num) => sum + num, 0);
  };

  console.log('Part 1:', simulate(80));
  console.log('Part 2:', simulate(256));
}
