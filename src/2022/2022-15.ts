import { fetchPuzzle } from '../utils/puzzle';

type Packet = Array<Packet> | number;
type Packets = Array<Packet>;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '15');

  const sensors = input
    .split('\n')
    .filter(Boolean)
    .map(
      (line) =>
        line
          .match(
            /Sensor at x=([0-9-]+), y=([0-9-]+): closest beacon is at x=([0-9-]+), y=([0-9-]+)/,
          )
          ?.slice(1)
          .map(Number) as [number, number, number, number],
    )
    .map(([sx, sy, bx, by]) => ({
      x: sx,
      y: sy,
      beacon: { x: bx, y: by },
      radius: Math.abs(sx - bx) + Math.abs(sy - by),
    }));

  // PART 1
  const line = 2000000;
  const noBeacon: Set<number> = new Set();
  for (const sensor of sensors) {
    if (sensor.y - sensor.radius <= line && sensor.y + sensor.radius >= line) {
      const halfWidth = sensor.radius - Math.abs(line - sensor.y);
      for (let i = sensor.x - halfWidth; i <= sensor.x + halfWidth; i++) {
        const beacon = sensors.find((s) => s.beacon.x === i && s.beacon.y === line);
        if (!beacon) {
          noBeacon.add(i);
        }
      }
    }
  }

  console.log('Part 1: ', noBeacon.size);

  // PART 2
  const MAX = 4000000;

  // Scan vertically for a gap on the horizontal coverage
  let gapY = 0;
  for (let y = 0; y <= MAX; y++) {
    const ranges: Array<Array<number>> = [];
    for (const sensor of sensors) {
      if (sensor.y - sensor.radius <= y && sensor.y + sensor.radius >= y) {
        const halfWidth = sensor.radius - Math.abs(y - sensor.y);
        ranges.push([Math.max(0, sensor.x - halfWidth), Math.min(MAX, sensor.x + halfWidth)]);
      }
    }

    let found = false;
    let lastX = -1;

    for (const range of ranges.sort((a, b) => a[0] - b[0])) {
      if (range[0] > lastX + 1) {
        found = true;
        break;
      } else if (range[1] >= MAX) {
        break;
      }
      lastX = Math.max(lastX, range[1]);
    }

    if (found) {
      gapY = y;
      break;
    }
  }

  // Scan horizontally for a gap on the vertical coverage
  let gapX = 0;
  for (let x = 0; x <= MAX; x++) {
    const ranges: Array<Array<number>> = [];
    for (const sensor of sensors) {
      if (sensor.x - sensor.radius <= x && sensor.x + sensor.radius >= x) {
        const halfHeight = sensor.radius - Math.abs(x - sensor.x);
        ranges.push([Math.max(0, sensor.y - halfHeight), Math.min(MAX, sensor.y + halfHeight)]);
      }
    }

    let found = false;
    let lastY = -1;
    for (const range of ranges.sort((a, b) => a[0] - b[0])) {
      if (range[0] > lastY + 1) {
        found = true;
        break;
      } else if (range[1] >= MAX) {
        break;
      }
      lastY = Math.max(lastY, range[1]);
    }

    if (found) {
      gapX = x;
      break;
    }
  }

  console.log('Part 2: ', gapX, gapY, gapX * MAX + gapY);
}
