export const range = (start: number, end: number): number[] =>
  [...Array(end + 1).keys()].slice(start)
