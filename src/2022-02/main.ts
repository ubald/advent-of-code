import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '2');

  const mapping: Record<string, string> = {
    X: 'A',
    Y: 'B',
    Z: 'C',
  };

  const rules: Record<string, [string, number]> = {
    A: ['C', 1],
    B: ['A', 2],
    C: ['B', 3],
  };

  const losses: Record<string, string> = {
    C: 'A',
    A: 'B',
    B: 'C',
  };

  let totalPart1 = 0;
  let totalPart2 = 0;

  const calculateOutcome = (opponentPlay: string, selfPlay: string): number => {
    const draw = opponentPlay === selfPlay;
    const win = rules[selfPlay][0] === opponentPlay;
    return rules[selfPlay][1] + (win ? 6 : draw ? 3 : 0);
  };

  for (const roundData of input.split('\n').filter((line) => line.length)) {
    const [opponentPlay, selfPlayAlias] = roundData.split(' ');
    totalPart1 += calculateOutcome(opponentPlay, mapping[selfPlayAlias]);
    totalPart2 += calculateOutcome(
      opponentPlay,
      selfPlayAlias === 'X'
        ? rules[opponentPlay][0]
        : selfPlayAlias === 'Y'
        ? opponentPlay
        : losses[opponentPlay],
    );
  }

  console.log('Part 1 Points:', totalPart1);
  console.log('Part 2 Points:', totalPart2);
}
