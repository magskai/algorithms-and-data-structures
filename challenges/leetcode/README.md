# Longest Substring Without Repeating Characters

From: https://leetcode.com/problems/longest-substring-without-repeating-characters/

Given a string `s`, find the length of the **longest substring** without repeating characters.

## My Approach

Iterate through the characters of the string, keeping track of

* `charToLastSeenIdx`: A map of the characters seen so far, and the index of their last occurrence
* `maxLength`: The length of the longest substring seen so far
* `startIdx`: The start index of the substring that we are currently counting

If we see a character that already occurred in the substring that we're currently counting,
start a new substring after the last occurrence of that character.

The length of the current substring is the range from the start index to the current index,
inclusive. This is calculated at the end of each loop, and used to calculate the `maxLength`.

After visiting all the characters, return `maxLength`.

### Example
#### For input `abcad`

At `i === 3`:

1. We encounter `a` again
2. Update `a`'s last seen index to the current index `3`
3. `startIdx` was `0` so now we set it to `1`
4. Calculate the current substring (`bca`) to length `3`
5. `maxLength` was `3` (for substring `abc`) and now it's set to the same value (for substring `bca`)

At `i === 4`:

1. Current character is `d`
2. Update `d`'s last seen index to the current index `4`
3. We haven't seen `d` before so `startIdx` stays at `1`
4. Calculate the current substring (`bcad`) to length `4`
5. `maxLength` was `3` (for substring `bca`) and now we set it to `4` (for substring `bcad`)

### Complexity
We visit every character in the input string `s`.

In the worst case, every character is unique, so we store every one in the table of seen characters.

Therefore, both the time and space complexity are **`O(n)`** where `n` is equal to the length of `s`.****