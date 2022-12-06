import { fetchPuzzle } from '../utils/puzzle';

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '6');
  const data = input.split('');
  const buffer: Array<string> = [];

  const findMarker = (markerLen: number): number => {
    for (let i = 0; i < data.length; i++) {
      buffer.push(data[i]);
      while (buffer.length > markerLen) {
        buffer.shift();
      }

      if (buffer.length === markerLen && [...new Set(buffer)].length === buffer.length) {
        return i + 1;
      }
    }

    return -1;
  };

  console.log('Part 1:', findMarker(4));
  console.log('Part 2:', findMarker(14));
}
