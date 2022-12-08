import { fetchPuzzle } from '../utils/puzzle';

type Tree = {
  visible: boolean;
  score: number;
  height: number;
};

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '8');
  const grid: Array<Array<Tree>> = input
    .split('\n')
    .filter(Boolean)
    .map((line) =>
      line.split('').map((height) => ({ visible: false, score: 0, height: parseInt(height, 10) })),
    );

  const gridWidth = grid[0].length;
  const gridHeight = grid.length;

  // Horizontal scan + scenic score
  for (let y = 0; y < gridHeight; y++) {
    let maxHeightSeenLTR = -1;
    let maxHeightSeenRTL = -1;

    for (let x = 0; x < gridWidth; x++) {
      // Left to right
      if (grid[y][x].height > maxHeightSeenLTR) {
        grid[y][x].visible = true;
        maxHeightSeenLTR = grid[y][x].height;
      }

      // Right to left
      if (grid[y][gridWidth - 1 - x].height > maxHeightSeenRTL) {
        grid[y][gridWidth - 1 - x].visible = true;
        maxHeightSeenRTL = grid[y][gridWidth - 1 - x].height;
      }

      // Scenic score
      let visibleCountA = 0;
      for (let xx = x + 1; xx < gridWidth; xx++) {
        visibleCountA++;
        if (grid[y][xx].height >= grid[y][x].height) {
          break;
        }
      }

      let visibleCountB = 0;
      for (let xx = x - 1; xx >= 0; xx--) {
        visibleCountB++;
        if (grid[y][xx].height >= grid[y][x].height) {
          break;
        }
      }

      let visibleCountC = 0;
      for (let yy = y + 1; yy < gridHeight; yy++) {
        visibleCountC++;
        if (grid[yy][x].height >= grid[y][x].height) {
          break;
        }
      }

      let visibleCountD = 0;
      for (let yy = y - 1; yy >= 0; yy--) {
        visibleCountD++;
        if (grid[yy][x].height >= grid[y][x].height) {
          break;
        }
      }

      grid[y][x].score = visibleCountA * visibleCountB * visibleCountC * visibleCountD;
    }
  }

  // Vertical scan (there's probably a better way to do this that repetition)
  for (let x = 0; x < gridWidth; x++) {
    let maxHeightSeenTTB = -1;
    let maxHeightSeenBTT = -1;

    for (let y = 0; y < gridHeight; y++) {
      // TTB
      if (grid[y][x].height > maxHeightSeenTTB) {
        grid[y][x].visible = true;
        maxHeightSeenTTB = grid[y][x].height;
      }

      // BBT
      if (grid[gridHeight - 1 - y][x].height > maxHeightSeenBTT) {
        grid[gridHeight - 1 - y][x].visible = true;
        maxHeightSeenBTT = grid[gridHeight - 1 - y][x].height;
      }
    }
  }

  // Final calculations
  let howManyVisible = 0;
  let highestScore = 0;
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (grid[y][x].visible) {
        howManyVisible++;
      }
      if (grid[y][x].score > highestScore) {
        highestScore = grid[y][x].score;
      }
    }
  }

  // Output
  console.log('Part 1:', howManyVisible);
  console.log('Part 2:', highestScore);
}
