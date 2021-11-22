import { assertEquals } from '../../../util/AssertUtil';

/**
 * Return the length of the longest substring in s without repeating characters.
 *
 * @param {string}  s input string
 * @return {number}   length of longest substring
 */
function lengthOfLongestSubstring(s: string): number {
  // characters mapped to their last seen index
  const charToLastSeenIdx = {};
  let maxLength = 0;
  let startIdx = 0;

  for (let i = 0; i < s.length; i++) {
    const currentChar = s[i];

    // if we have seen this char since startIdx, start counting a new substring after it
    if (charToLastSeenIdx[currentChar]) {
      startIdx = Math.max(startIdx, charToLastSeenIdx[currentChar] + 1);
    }

    // set last seen index of this char
    charToLastSeenIdx[currentChar] = i;

    // length of current substring is the start index to current index, inclusive
    const currLength = i + 1 - startIdx;

    // set the max substring length so far
    maxLength = Math.max(maxLength, currLength);
  }

  return maxLength;
}

// TESTS
let expected = lengthOfLongestSubstring('');
let actual = 0;
assertEquals(expected, actual, 'empty string');

expected = lengthOfLongestSubstring('bbbbb');
actual = 1;
assertEquals(expected, actual, 'single repeating character');

expected = lengthOfLongestSubstring('abcabcbb');
actual = 3;
assertEquals(expected, actual, 'repeating substring');

expected = lengthOfLongestSubstring('abcade');
actual = 5;
assertEquals(expected, actual, 'longer substring using next occurrence of character');

expected = lengthOfLongestSubstring('pwwkew');
actual = 3;
assertEquals(expected, actual, 'count substring but not subsequence');
