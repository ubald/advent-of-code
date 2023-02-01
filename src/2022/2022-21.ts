import { fetchPuzzle } from '../utils/puzzle';

type MonkeyMap = Map<string, MonkeyFn>;
type MonkeyFn = (monkeys: MonkeyMap) => number;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '21');

  const raw = input
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(': '))
    .reduce((acc, [id, op]) => {
      acc.set(id, op);
      return acc;
    }, new Map());

  const monkeys = Array.from(raw.entries()).reduce((acc, [id, statement]) => {
    const statementParts = statement.split(' ');
    let fn: MonkeyFn;
    if (statementParts.length === 1) {
      fn = (_) => Number(statementParts[0]);
    } else {
      const [op1, op, op2] = statementParts;
      fn = (monke) => {
        const val1 = monke.get(op1)!(monke);
        const val2 = monke.get(op2)!(monke);
        switch (op) {
          case '+':
            return val1 + val2;
          case '-':
            return val1 - val2;
          case '*':
            return val1 * val2;
          case '/':
            return val1 / val2;
          default:
            throw new Error(`Unknown op: ${op}`);
        }
      };
    }
    acc.set(id, fn);
    return acc;
  }, new Map());

  // Output
  console.log('Part 1:', monkeys.get('root')!(monkeys));
}
