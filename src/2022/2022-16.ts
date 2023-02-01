import { fetchPuzzle } from '../utils/puzzle';

type Node<N = any> = {
  readonly name: string;
  readonly edges: Array<Edge<Node<N> & N>>;
};

type Edge<N extends Node = Node> = {
  readonly weight: number;
  readonly target: N;
};

type Valve = {
  readonly flow: number;
  readonly tunnels: Array<string>;
};

type ValveNode = Node<Valve> & Valve;

const TIME_LIMIT = 30;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '16-sample');

  const rawValvesList = input
    .split('\n')
    .filter(Boolean)
    .map(
      (line) =>
        line
          .match(/Valve ([A-Z]+) has flow rate=([0-9]+); tunnels? leads? to valves? ([A-Z, ]+)/)
          ?.slice(1) as [string, string, string],
    )
    .map((matches) => [matches[0], Number(matches[1]), matches[2]?.split(', ') ?? []]);
  const valves: Map<string, ValveNode> = rawValvesList.reduce(
    (acc, [name, flow, tunnels]) => acc.set(name, { name, flow, tunnels, edges: [] }),
    new Map(),
  );

  const startValve = valves.get(rawValvesList[0][0] as any[0] as string)!;

  // for (const valve of valves.values()) {
  //   for (const tunnel of valve.tunnels) {
  //     const neighbor = valves.get(tunnel)!;
  //     valve.edges.push({ weight: 1, target: neighbor });
  //   }
  // }

  const optimize = (valve: ValveNode, depth = 0): Array<Edge<ValveNode>> => {
    if (valve.flow === 0) {
      // Eliminate this node
      return valve.tunnels.reduce(
        (acc, tunnel) => acc.concat(optimize(valves.get(tunnel)!, depth + 1)),
        [] as Array<Edge<ValveNode>>,
      );
    } else {
      if (valve.edges.length === 0) {
        for (const tunnel of valve.tunnels) {
          valve.edges.push(...optimize(valves.get(tunnel)!, depth + 1));
        }
      }
      return [{ weight: 1, target: valve }];
    }
  };

  const root: ValveNode = {
    name: 'ROOT',
    flow: 0,
    tunnels: [],
    edges: optimize(startValve),
  };

  const visit = (valve: ValveNode, opened: Set<Valve> = new Set(), time = 0): number => {
    if (time >= 30) {
      return 0;
    }

    let largestFlow = 0;

    for (const openCurrentValve of [true, false]) {
      let f = 0;
      let t = time;

      if (openCurrentValve && (valve.flow === 0 || opened.has(valve))) {
        // Can't open a valve with no flow or a valve that's already opened ¯\_(ツ)_/¯
        continue;
      } else if (openCurrentValve) {
        opened.add(valve);
        f += valve.flow;
        t += 1;
      }

      if (t >= TIME_LIMIT) {
        largestFlow = Math.max(largestFlow, f);
        continue;
      }

      for (const edge of valve.edges) {
        // if (opened.has(edge.target)) {
        //   continue;
        // }

        largestFlow = Math.max(
          largestFlow,
          f + visit(edge.target, new Set(opened), t + edge.weight),
        );
      }
    }

    return largestFlow;
  };

  console.log('Part 1:', visit(root));

  // const valves: Map<string, ValveNode> = new Map();
  // for (const [name, [flow]] of rawValves) {
  //   valves.set(name, {
  //     flow,
  //     edges: [],
  //   });
  // }
  //
  // for (const [name, valve] of valves) {
  //   for (const tunnel of rawValves.get(name)![1]) {
  //     valve.edges.push({
  //       weight: 1,
  //       target: valves.get(tunnel)!,
  //     });
  //   }
  // }
  //
  // const visit = (valve: ValveNode, opened: Set<Valve> = new Set(), flow = 0, time = 0): number => {
  //   if (time >= 30) {
  //     return flow;
  //   }
  //
  //   let largestFlow = 0;
  //   for (const openCurrentValve of [true, false]) {
  //     let f = flow;
  //     let t = time;
  //     if (openCurrentValve && (valve.flow === 0 || opened.has(valve))) {
  //       // Can't open a valve with no flow or a valve that's already opened ¯\_(ツ)_/¯
  //       continue;
  //     } else if (openCurrentValve) {
  //       f += valve.flow;
  //       t += 1;
  //       opened.add(valve);
  //     }
  //
  //     if (t >= TIME_LIMIT) {
  //       largestFlow = Math.max(largestFlow, f);
  //       continue;
  //     }
  //
  //     for (const edge of valve.edges) {
  //       if (opened.has(edge.target)) {
  //         continue;
  //       }
  //
  //       largestFlow = Math.max(largestFlow, visit(edge.target, new Set(opened), f, t + 1));
  //     }
  //   }
  //
  //   return largestFlow;
  // };
  //
  // console.log('Part 1:', visit(valves.get(startValve)!));
}
