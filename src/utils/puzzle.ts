import axios from 'axios';

export const fetchPuzzle = async (year: string, day: string): Promise<string> => {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION}`,
    },
  });

  return response.data;
};
