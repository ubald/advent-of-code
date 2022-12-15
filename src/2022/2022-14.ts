import * as readline from 'readline';
import { fetchPuzzle } from '../utils/puzzle';

enum Thing {
  Wall = '#',
  Air = '.',
  Sand = 'o',
  Source = '+',
}

class Cave {
  private readonly map: Map<number, Map<number, Thing>> = new Map();
  width = 0;
  height = 0;

  getCoord(x: number, y: number): Thing {
    return this.map.get(x)?.get(y) ?? Thing.Air;
  }

  setCoord(x: number, y: number, thing: Thing): void {
    if (!this.map.has(x)) {
      this.map.set(x, new Map());
    }
    this.map.get(x)?.set(y, thing);

    this.width = Math.max(this.width, x + 1);
    this.height = Math.max(this.height, y + 1);
  }
}

const draw = (cave: Cave): string => {
  let output = '';
  for (let y = 0; y < cave.height; y++) {
    for (let x = 0; x < cave.width; x++) {
      output += cave.getCoord(x, y);
    }
    output += '\n';
  }
  return output;
};

const animate = async (cave: Cave, timeout = 10): Promise<void> => {
  console.clear();
  console.log(draw(cave));
  await new Promise((resolve) => setTimeout(resolve, timeout));
};

const wait = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
};

const SOURCE_X = 500;
const SOURCE_Y = 0;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '14');

  const inputWalls = input
    .split('\n')
    .filter(Boolean)
    .map((line) =>
      line.split(' -> ').map((coord) => coord.split(',').map(Number) as [number, number]),
    );

  const flow = async (
    walls: Array<Array<[number, number]>>,
    bottomlessPit = false,
    shouldDraw = true,
  ): Promise<number> => {
    const cave: Cave = new Cave();

    cave.setCoord(SOURCE_X, SOURCE_Y, Thing.Source);

    for (const wallCoords of walls) {
      let [x1, y1] = wallCoords[0];
      for (const wallCoord of wallCoords) {
        const [x2, y2] = wallCoord;
        if (x1 === x2) {
          for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            cave.setCoord(x1, y, Thing.Wall);
          }
        } else {
          for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            cave.setCoord(x, y1, Thing.Wall);
          }
        }
        [x1, y1] = wallCoord;
      }
    }

    const limit = bottomlessPit ? cave.height : cave.height + 1;

    let intoTheVoid = false;
    let settleCount = 0;

    await animate(cave);
    await wait('Press enter to continue');

    while (!intoTheVoid) {
      let settled = false;
      let x = SOURCE_X;
      let y = SOURCE_Y;

      while (!settled) {
        while (
          y < limit &&
          (cave.getCoord(x, y) === Thing.Air || cave.getCoord(x, y) === Thing.Source)
        ) {
          y++;
        }

        if (bottomlessPit && y > limit) {
          intoTheVoid = true;
          break;
        }

        if (bottomlessPit && x - 1 < 0) {
          intoTheVoid = true;
          break;
        } else if (y < limit && cave.getCoord(x - 1, y) === Thing.Air) {
          x -= 1;
        } else if (bottomlessPit && x + 1 >= cave.width) {
          intoTheVoid = true;
          break;
        } else if (y < limit && cave.getCoord(x + 1, y) === Thing.Air) {
          x += 1;
        } else {
          cave.setCoord(x, y - 1, Thing.Sand);
          settled = true;
          settleCount++;
          if (!bottomlessPit && x === SOURCE_X && y - 1 === SOURCE_Y) {
            intoTheVoid = true;
            break;
          }
          break;
        }
      }

      if (shouldDraw) {
        await animate(cave);
      }
    }

    await animate(cave);

    return settleCount;
  };

  console.log('Part 1:', await flow(inputWalls, true, false));
  console.log('Part 2:', await flow(inputWalls, false, true));
}
