import { assertEquals } from '../../util/AssertUtil';

interface CakeType {
  value: number;
  weight: number;
}

/**
 * Return the maximum value of cakes that can fit inside a duffel bag, given a limited weight
 * capacity and CakeTypes with varying weight and value.
 *
 * @param {CakeType}  cakeTypes       valuable, tasty, moneyful cakes
 * @param {number}    weightCapacity  weight limit that can be carried
 * @returns {number}                  maximum value of cakes
 */
function maxDuffelBagValue(cakeTypes: CakeType[], weightCapacity: number): number {
  // initialize array to store the max value at each weight capacity by index
  const maxValues = new Array(weightCapacity + 1).fill(0);

  for (let capacity = 1; capacity <= weightCapacity; capacity++) {
    // reuse the max value computed for -1 capacity
    maxValues[weightCapacity] = maxValues[weightCapacity - 1];

    cakeTypes.forEach((cake) => {
      const valueWithCake = maxValueWithCake(cake, capacity, maxValues);

      maxValues[capacity] = Math.max(maxValues[capacity], valueWithCake);
    });
  }

  return maxValues[weightCapacity];
}

function maxValueWithCake(cake: CakeType, weightCapacity: number, maxValues: number[]) {
  const cakeWeight = cake.weight;
  const cakeValue = cake.value;

  // if a cake is weightless and has a positive value, we get infinity moneys hooray
  if (cakeWeight === 0 && cakeValue > 0) {
    return Infinity;
  }

  // if the cake fits, calculate the max value if we take this cake
  if (cakeWeight <= weightCapacity) {
    const remainingCapacityWithCake = weightCapacity - cakeWeight;

    return maxValues[remainingCapacityWithCake] + cakeValue;
  }

  // cake does not fit, so there is no valid value with the cake
  return -1;
}

// TESTS
let desc = 'one cake';
let actual = maxDuffelBagValue([{ weight: 2, value: 1 }], 9);
let expected = 4;
assertEquals(actual, expected, desc);

desc = 'two cakes';
actual = maxDuffelBagValue([
  { weight: 4, value: 4 },
  { weight: 5, value: 5 }], 9);
expected = 9;
assertEquals(actual, expected, desc);

desc = 'only take less valuable cake';
actual = maxDuffelBagValue([
  { weight: 4, value: 4 },
  { weight: 5, value: 5 }], 12);
expected = 12;
assertEquals(actual, expected, desc);

desc = 'lots of cakes';
actual = maxDuffelBagValue([
  { weight: 2, value: 3 },
  { weight: 3, value: 6 },
  { weight: 5, value: 1 },
  { weight: 6, value: 1 },
  { weight: 7, value: 1 },
  { weight: 8, value: 1 }], 7);
expected = 12;
assertEquals(actual, expected, desc);

desc = 'value to weight ratio is not optimal';
actual = maxDuffelBagValue([
  { weight: 51, value: 52 },
  { weight: 50, value: 50 }], 100);
expected = 100;
assertEquals(actual, expected, desc);

desc = 'zero capacity';
actual = maxDuffelBagValue([{ weight: 1, value: 2 }], 0);
expected = 0;
assertEquals(actual, expected, desc);

desc = 'cake with zero value and weight';
actual = maxDuffelBagValue([
  { weight: 0, value: 0 },
  { weight: 2, value: 1 }], 7);
expected = 3;
assertEquals(actual, expected, desc);

desc = 'cake with non-zero value and zero weight';
actual = maxDuffelBagValue([{ weight: 0, value: 5 }], 5);
assertEquals(Number.isFinite(actual), false, desc);
