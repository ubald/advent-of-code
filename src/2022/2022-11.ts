import { fetchPuzzle } from '../utils/puzzle';

enum Op {
  Mult = '*',
  Add = '+',
}

type Monkey = {
  readonly items: Array<number>;
  readonly op: Op;
  readonly opValue: number;
  readonly test: number;
  readonly result: [number, number];
  inspectionCount: number;
};

const PART1_ROUND_COUNT = 20;
const PART2_ROUND_COUNT = 10000;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '11');

  const run = (roundCount: number, calm: boolean) => {
    const monkeys: Array<Monkey> = [];
    let products = 1;

    for (const monkeyDef of input.split('\n\n')) {
      const matches = monkeyDef.match(
        /Monkey ([0-9]):\n.*Starting items: ([0-9, ]+)\n.*Operation: new = old ([+*]) ([0-9a-z]+)\n.*Test: divisible by ([0-9]+)\n.*If true: throw to monkey ([0-9])\n.*If false: throw to monkey ([0-9])/,
      )!;

      const monkey: Monkey = {
        items: matches[2].split(', ').map((item) => Number(item)),
        op: matches[3] === '+' ? Op.Add : Op.Mult,
        opValue: Number(matches[4]),
        test: Number(matches[5]),
        result: [Number(matches[6]), Number(matches[7])],
        inspectionCount: 0,
      };

      monkeys[Number(matches[1])] = monkey;
      products *= monkey.test;
    }

    for (let i = 0; i < roundCount; ++i) {
      for (const monkey of monkeys) {
        monkey.inspectionCount += monkey.items.length;
        for (let level of monkey.items.splice(0)) {
          const opValue = monkey.opValue || level;
          if (monkey.op === Op.Add) {
            level += opValue;
          } else if (monkey.op === Op.Mult) {
            level *= opValue;
          }

          if (calm) {
            level = Math.floor(level / 3);
          }

          level %= products;

          if (level % monkey.test === 0) {
            monkeys[monkey.result[0]].items.push(level);
          } else {
            monkeys[monkey.result[1]].items.push(level);
          }
        }
      }
    }

    return monkeys
      .sort((a, b) => b.inspectionCount - a.inspectionCount)
      .slice(0, 2)
      .reduce((acc, monkey) => acc * monkey.inspectionCount, 1);
  };

  // Output
  console.log('Part 1:', run(PART1_ROUND_COUNT, true));
  console.log('Part 2:', run(PART2_ROUND_COUNT, false));
}
