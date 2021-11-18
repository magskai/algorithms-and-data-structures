/* eslint-disable no-bitwise */
export const concatTokens = (delimiter: string, ...tokens: string[]): string => {
  const concatReducer = (t1: string, t2: string): string => t1 + delimiter + t2;

  return tokens.sort().reduce(concatReducer, '');
};

export const hashString = (s: string): number => {
  const hashReducer = (result: number, char: string): number => {
    const charCode = char.charCodeAt(0);
    const intermediateHash = ((result << 5) - result) + charCode;

    return intermediateHash & intermediateHash;
  };

  return s.split('').reduce(hashReducer, 0);
};
