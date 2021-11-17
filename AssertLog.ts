export const AssertLog = (() => {
  const equals = (expected: any, actual: any, desc: string) => {
    if (expected === actual) {
      printPass(desc);
    } else {
      printFail(desc, expected, actual);
    }
  }
  
  const arrayEquals = (expected: any[], actual: any[], desc: string, inOrder:boolean = false) => {
    const normalizedArr2 = normalizeArrayForComparison(expected, inOrder);
    const normalizedArr1 = normalizeArrayForComparison(actual, inOrder);
    
    equals(normalizedArr1, normalizedArr2, desc);
  }
  
  const equalsTrue = (actual: boolean, desc: string) => {
    equals(actual, true, desc);
  }

  return { equals, arrayEquals, equalsTrue };
})();

const printPass = (desc: string) => {
  console.log(`PASS | ${ desc }\t`);
}

const printFail = (desc: string, expected: any, actual: any) => {
  const expectedAsString = JSON.stringify(expected);
  const actualAsString = JSON.stringify(actual);

  console.log(`FAIL | ${ desc }\nExpected: ${ expectedAsString }\nActual: ${ actualAsString }`);
}

const normalizeArrayForComparison = (arr: any[], sort:boolean = false): string => {
  const clone = deepClone(arr)
  
  if (sort) arr.sort();

  return JSON.stringify(clone);
}

const deepClone = (arr: any[]): any[] => {
  return JSON.parse(JSON.stringify(arr));
}
