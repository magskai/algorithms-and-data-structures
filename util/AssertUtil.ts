const deepClone = (arr: any[]): any[] => JSON.parse(JSON.stringify(arr));

const normalizeArrayForComparison = (arr: any[], sort:boolean = false): string => {
  const clone = deepClone(arr);

  if (sort) arr.sort();

  return JSON.stringify(clone);
};

export const assertEquals = (expected: any, actual: any, desc: string) => {
  const logPass = () => console.log(`PASS | ${desc}\t`);
  const logFail = () => {
    const expectedAsString = JSON.stringify(expected);
    const actualAsString = JSON.stringify(actual);

    console.log(`FAIL | ${desc}\nExpected: ${expectedAsString}\nActual: ${actualAsString}`);
  };

  if (expected === actual) {
    logPass();
  } else {
    logFail();
  }
};

export const assertEqualsTrue = (actual: boolean, desc: string) => assertEquals(actual, true, desc);

// eslint-disable-next-line max-len
export const assertArrayEquals = (expected: any[], actual: any[], desc: string, inOrder:boolean = false) => {
  const normalizedArr2 = normalizeArrayForComparison(expected, inOrder);
  const normalizedArr1 = normalizeArrayForComparison(actual, inOrder);

  assertEquals(normalizedArr1, normalizedArr2, desc);
};
