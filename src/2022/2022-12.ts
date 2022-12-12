import { fetchPuzzle } from '../utils/puzzle';

type Node = {
  readonly edges: Array<Edge>;
};

type Edge = {
  readonly weight: number;
  readonly target: TerrainNode;
};

type TerrainNode = Node & {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

function reconstructPath(cameFrom: Map<TerrainNode, TerrainNode>, node: TerrainNode) {
  let length = 0;
  let current = node;
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    length++;
  }
  return length;
}

function findPath(
  start: TerrainNode,
  goal: TerrainNode,
  h: (node: TerrainNode, goal: TerrainNode) => number,
): number {
  const openSet: Array<TerrainNode> = [start];
  const cameFrom: Map<TerrainNode, TerrainNode> = new Map();
  const gScore: Map<TerrainNode, number> = new Map([[start, 0]]);
  const fScore: Map<TerrainNode, number> = new Map([[start, h(start, goal)]]);

  while (openSet.length) {
    const current = openSet.reduce((min, node) => {
      const minScore = fScore.get(min) ?? Infinity;
      const nodeScore = fScore.get(node) ?? Infinity;

      return nodeScore < minScore ? node : min;
    }, openSet[0]);

    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);

    for (const edge of current.edges) {
      const neighbor = edge.target;
      const tentativeGScore = (gScore.get(current) ?? Infinity) + edge.weight;
      if (tentativeGScore >= (gScore.get(neighbor) ?? Infinity)) {
        continue;
      }

      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(neighbor, tentativeGScore + h(neighbor, goal));

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      }
    }
  }

  return -1;
}

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '12');

  let temp_x = 0;
  let temp_y = 0;

  let start: TerrainNode | undefined = undefined;
  let goal: TerrainNode | undefined = undefined;

  // Parse input
  const terrain: Array<Array<TerrainNode>> = input
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      temp_x = 0;

      const lineElevations = line.split('').map((character) => {
        const node = {
          x: temp_x,
          y: temp_y,
          z: character.charCodeAt(0) - 97,
          edges: [],
        };

        if (character === 'S') {
          node.z = 0;
          start = node;
        } else if (character === 'E') {
          node.z = 25;
          goal = node;
        }

        temp_x++;

        return node;
      });

      temp_y++;

      return lineElevations;
    });

  // Sanity check
  if (!start || !goal) {
    throw new Error('Start or goal not found');
  }

  // Connect nodes
  for (let y = 0; y < terrain.length; y++) {
    for (let x = 0; x < terrain[y].length; x++) {
      const node = terrain[y][x];

      // Up
      if (y > 0 && terrain[y - 1][x].z - node.z <= 1) {
        node.edges.push({ weight: 1, target: terrain[y - 1][x] });
      }

      // Down
      if (y < terrain.length - 1 && terrain[y + 1][x].z - node.z <= 1) {
        node.edges.push({ weight: 1, target: terrain[y + 1][x] });
      }

      // Left
      if (x > 0 && terrain[y][x - 1].z - node.z <= 1) {
        node.edges.push({ weight: 1, target: terrain[y][x - 1] });
      }

      // Right
      if (x < terrain[y].length - 1 && terrain[y][x + 1].z - node.z <= 1) {
        node.edges.push({ weight: 1, target: terrain[y][x + 1] });
      }
    }
  }

  // Heuristic
  const h = (node: TerrainNode, target: TerrainNode): number =>
    Math.abs(
      Math.sqrt(
        Math.pow(node.x - target.x, 2) +
          Math.pow(node.y - target.y, 2) +
          Math.pow(node.z - target.z, 2),
      ),
    );
  // Output
  console.log('Part 1:', findPath(start, goal, h));
  console.log(
    'Part 2:',
    terrain
      .flatMap((node) => node)
      .filter((node) => node.z === 0)
      .map((node) => findPath(node, goal!, h))
      .filter((length) => length !== -1)
      .sort((a, b) => a - b)[0],
  );
}
