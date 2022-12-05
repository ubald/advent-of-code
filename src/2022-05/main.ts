import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '5');

  const [cratesInput, movesInput] = input.split('\n\n');
  const crateLines = cratesInput.split('\n').filter((line) => line.length);
  const moveLines = movesInput.split('\n').filter((line) => line.length);

  const CRATE_LEN = 4;
  const pileCount = Math.ceil(crateLines[0].length / CRATE_LEN);

  const makePiles = () => {
    const piles: Array<Array<string>> = [];
    for (let i = 0; i < crateLines.length - 1; i++) {
      for (let j = 0; j < pileCount; j++) {
        const crate = crateLines[i].charAt(j * CRATE_LEN + 1);
        if (crate === ' ') {
          continue;
        }

        if (!piles[j]) {
          piles[j] = [];
        }

        piles[j].push(crate);
      }
    }
    return piles;
  };

  let piles: Array<Array<string>>;

  // Part 1
  piles = makePiles();
  for (const moveLine of moveLines) {
    const [_move, count, _from, from, _to, to] = moveLine.split(' ').map(Number);

    for (let i = 0; i < count; i++) {
      piles[to - 1].unshift(piles[from - 1].shift()!);
    }
  }

  console.log('Part 1:', piles.map((pile) => pile[0]).join(''));

  // Part 2
  piles = makePiles();
  for (const moveLine of moveLines) {
    const [_move, count, _from, from, _to, to] = moveLine.split(' ').map(Number);

    piles[to - 1].unshift(...piles[from - 1].splice(0, count)!);
  }

  console.log('Part 2:', piles.map((pile) => pile[0]).join(''));
}
