import { fetchPuzzle } from '../utils/puzzle';

type Packet = Array<Packet> | number;
type Packets = Array<Packet>;

export async function main(): Promise<void> {
  const input = await fetchPuzzle('2022', '13');

  const parsePackets = (rawPackets: string, start = 0): [Packets, number] => {
    const packets: Packets = [];
    let acc = '';

    for (let i = start; i < rawPackets.length; i++) {
      if (rawPackets[i] === '[') {
        const [subPackets, subOffset] = parsePackets(rawPackets, i + 1);

        packets.push(subPackets);
        acc = '';

        i = subOffset;
      } else if (rawPackets[i] === ']') {
        if (acc.length) {
          packets.push(Number(acc));
          acc = '';
        }

        return [packets, i];
      } else if (rawPackets[i] === ',') {
        if (acc.length) {
          packets.push(Number(acc));
          acc = '';
        }
      } else {
        acc = `${acc}${rawPackets[i]}`;
      }
    }

    // Only the outer look arrives here and there is an extra a surrounding array
    return [packets[0] as any, rawPackets.length];
  };

  const pairs: Array<[Packets, Packets]> = input
    .split('\n\n')
    .map((rawPair) => rawPair.split('\n').filter(Boolean) as [string, string])
    // .slice(0, 1)
    .map((rawPairs) => rawPairs.map((rawPair) => parsePackets(rawPair)[0]) as [Packets, Packets]);

  // TODO: Boring, maybe another day
}
