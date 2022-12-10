import { fetchPuzzle } from '../utils/puzzle';

const REPORT_CYCLES = 40;
const LAST_CYCLE = 240;
const LINE_WIDTH = 40;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '10');

  const instructions: Array<[string, number]> = input
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(' '))
    .map(([op, arg]) => [op, parseInt(arg, 10)]);

  let register = 1;

  let cycle = 0;
  let programCounter = 0;
  let instructionCounter = 0;

  let nextReport = 20;
  let signalSum = 0;

  const screen: Array<string> = Array.from({ length: LAST_CYCLE }).map(() => ' ');

  while (cycle < LAST_CYCLE) {
    cycle++;

    if (cycle === nextReport) {
      const signalStrength = cycle * register;
      signalSum += signalStrength;
      nextReport += REPORT_CYCLES;
    }

    const [op, arg] = instructions[programCounter];

    switch (op) {
      case 'noop':
        programCounter++;
        break;

      case 'addx':
        if (instructionCounter === 1) {
          register += arg;
          programCounter++;
          instructionCounter = 0;
        } else {
          instructionCounter++;
        }
        break;
    }

    const pos = cycle % LINE_WIDTH;
    if (pos >= register - 1 && pos <= register + 1) {
      screen[cycle] = '█';
    }
  }

  // Output
  console.log('Part 1:', signalSum);
  console.log('Part 2:');
  console.log(screen.slice(0, 39).join(''));
  console.log(screen.slice(40, 79).join(''));
  console.log(screen.slice(80, 119).join(''));
  console.log(screen.slice(120, 159).join(''));
  console.log(screen.slice(160, 199).join(''));
  console.log(screen.slice(200, 239).join(''));
}
