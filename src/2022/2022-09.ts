import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '9');
  const moves = input
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(' '))
    .map(([direction, distance]) => [direction, Number(distance)]);

  const doMoves = (rope: Array<{ x: number; y: number }>) => {
    const visited = new Set<string>();

    for (const [direction, distance] of moves) {
      for (let i = 0; i < distance; i++) {
        for (let j = 0; j < rope.length; j++) {
          if (j === 0) {
            switch (direction) {
              case 'U':
                rope[j].y++;
                break;
              case 'D':
                rope[j].y--;
                break;
              case 'R':
                rope[j].x++;
                break;
              case 'L':
                rope[j].x--;
                break;
            }

            continue;
          }

          const distX = rope[j - 1].x - rope[j].x;
          const distY = rope[j - 1].y - rope[j].y;

          if (Math.abs(distX) > 1 || Math.abs(distY) > 1) {
            rope[j].x += Math.min(Math.max(-1, distX), 1);
            rope[j].y += Math.min(Math.max(-1, distY), 1);
          }

          if (j === rope.length - 1) {
            visited.add(`${rope[j].x},${rope[j].y}`);
          }
        }
      }
    }

    return visited;
  };

  const createRope = (length: number) => new Array(length).fill(null).map(() => ({ x: 0, y: 0 }));

  // Output
  console.log('Part 1:', doMoves(createRope(2)).size);
  console.log('Part 2:', doMoves(createRope(10)).size);
}
