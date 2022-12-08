import { fetchPuzzle } from '../utils/puzzle';

type Node = {
  name: string;
  size: number;
  parent?: Node;
  children: Array<Node>;
};

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '7');

  const root: Node = {
    name: '/',
    size: 0,
    children: [],
  };

  let cwd: Node | undefined = undefined;

  for (const line of input.split('\n')) {
    if (!line.length) {
      continue;
    }

    const tokens = line.split(' ');

    switch (tokens[0]) {
      case '$':
        // Command
        switch (tokens[1]) {
          case 'cd':
            switch (tokens[2]) {
              case '/':
                cwd = root;
                break;

              case '..':
                cwd = cwd!.parent;
                break;

              default:
                cwd = cwd!.children.find((child) => child.name === tokens[2]);
                break;
            }
            break;

          case 'ls':
            // Normally would have a state machine but it's the only command
            break;

          default:
            console.error('Unknown command', tokens[1]);
            break;
        }
        break;

      case 'dir':
        // Directory
        cwd!.children.push({
          name: tokens[1],
          size: 0,
          parent: cwd,
          children: [],
        });
        break;

      default:
        // File
        cwd!.children.push({
          name: tokens[1],
          size: parseInt(tokens[0], 10),
          parent: cwd,
          children: [],
        });
        break;
    }
  }

  const calculateSize = (node: Node): number => {
    // Lazy file ignoring
    if (node.children.length === 0) {
      return node.size;
    }

    let size = 0;
    for (const child of node.children) {
      const childSize = calculateSize(child);
      size += childSize;
    }
    node.size = size;
    return size;
  };

  calculateSize(root);

  const largeishNodes: Array<Node> = [];
  const findLargestButNotQuite = (node: Node) => {
    // Lazy file ignoring
    if (node.children.length === 0) {
      return;
    }

    if (node.size <= 100000) {
      largeishNodes.push(node);
    }

    for (const child of node.children) {
      findLargestButNotQuite(child);
    }
  };
  findLargestButNotQuite(root);
  console.log(
    'Part 1:',
    largeishNodes.reduce((acc, node) => acc + node.size, 0),
  );

  const space = 70000000;
  const unused = 30000000;
  const used = root.size;
  const candidates: Array<Node> = [];

  const findDeleteCandidate = (node: Node) => {
    if (node.children.length === 0) {
      return;
    }

    if (space - (used - node.size) >= unused) {
      candidates.push(node);
    }

    for (const child of node.children) {
      findDeleteCandidate(child);
    }
  };
  findDeleteCandidate(root);

  candidates.sort((a, b) => a.size - b.size);
  console.log('Part 2:', candidates[0].size);
}
