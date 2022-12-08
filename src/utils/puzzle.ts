import axios from 'axios';
import * as fs from 'fs';

export const fetchPuzzle = async (year: string, day: string): Promise<string> => {
  const filePath = `src/${year}/${year}-${day.padStart(2, '0')}.txt`;

  if (!fs.existsSync(filePath)) {
    const fileURL = `https://adventofcode.com/${year}/day/${day}/input`;

    console.log(`Downloading puzzle input from ${fileURL}`);
    const response = await axios.get(fileURL, {
      headers: {
        cookie: `session=${process.env.AOC_SESSION}`,
      },
    });

    console.log(`Writing puzzle input to ${filePath}`);
    fs.writeFileSync(filePath, response.data);
  }

  console.log(`Reading puzzle input from ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
};
