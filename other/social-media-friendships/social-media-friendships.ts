/*
You work on a social media platform.
You have CSV log files containing data about friend transactions between users.
Find all active friendships.

The log files are:
  - request.csv
  - remove.csv
  - accept.csv
  - reject.csv

Each log file contains 3 columns:
  - user1
  - user2
  - timestamp

Expected output:
An array of arrays of user pairs: i.e. [[user1, user2]]

Example:
  - dankboi and dankgoat are friends
  - pancake and blarp are friends
  Result: [['dankboi', 'dankgoat'], ['pancake', 'blarp']]

Considerations:
  - The logs are not guaranteed to be in order
  - Result cannot contain duplicates
  - The data is clean: every field is populated with valid values, no logs are missing
*/

/*
THOUGHTS
  An active friendship can be defined:
    - There exists a request between 2 users that was accepted.
    - There does not exist a remove transaction more recent than the latest accept transaction.

    Therefore, we only need to care about accept.csv and remove.csv

  One approach would be to sort both log files and step through, but we can easily assume that
  these files can be very large. We do not want to load them from disk into memory unless we
  want a great sadness to fall upon our machine.

  We can instead read the logs line by line and do something with each row.

  1. From remove.csv, create an object that maps the unique user pair to their most recent
    "remove" transaction.

  2. From accept.csv, create an array of unique user pairs who do not have a more recent
    "remove" transaction.

  Where
    n is the number of rows in accept.csv
    m is the number of rows in remove.csv
    Time complexity:  O(n + m)
    Space complexity: O(n)
*/

import { createReadStream } from 'fs';
import { parse } from 'csv';
import { resolve as resolvePath } from 'path';
import { assertArrayEquals } from '../../util/AssertUtil';
import { concatTokens } from '../../util/KeyGenerationUtil';

// options for the CSV parser
const CSV_PARSER_OPTS = {
  columns: true,
  delimiter: ',',
};

// log file paths
const LOGS_ACCEPT = './other/social-media-friendships/accept.csv';
const LOGS_REMOVE = './other/social-media-friendships/remove.csv';

// CSV column keys
const COLUMN_USER1 = 'user1';
const COLUMN_USER2 = 'user2';
const COLUMN_TIMESTAMP = 'timestamp';

// illegal username character for concatenating 2 usernames into a lookup key
const RELATIONSHIP_KEY_DELIMITER = '^';

/**
 * Stream a file and apply a function to each row.
 *
 * @param {string}  relFilePath relative file path
 * @param {string}  rowFunction function to apply to rows of file
 * @returns {Promise}           promise that resolves when the stream ends successfully
 */
const csvStream = async (relFilePath: string, rowFunction: (row: {}) => void): Promise<void> => {
  const absFilePath: string = resolvePath('./', relFilePath);
  const stream = createReadStream(absFilePath);
  const parser = parse(CSV_PARSER_OPTS);

  return new Promise((resolve, reject) => {
    stream.pipe(parser)
      .on('data', rowFunction)
      .on('end', resolve)
      .on('error', reject);
  });
};

/**
 * Generate a key from the usernames in the log row.
 *
 * @param {Object}  logRow  row from log file
 * @returns {string}        key
 */
const generateRelationshipKey = (logRow: {}): string => {
  const user1 = logRow[COLUMN_USER1];
  const user2 = logRow[COLUMN_USER2];

  return concatTokens(RELATIONSHIP_KEY_DELIMITER, user1, user2);
};

/**
 * Generate a map of timestamps of the most recent "remove" log between each unique pair of users.
 *
 * @returns {Promise<{}>} resolves to map of user pairs to timestamps
 */
const generateFriendshipRemoveMap = async (): Promise<{ [k: string]: number }> => {
  const friendshipToLatestRemove = {};

  const collectLatestRemoveRequests = (logRow: {}) => {
    const key = generateRelationshipKey(logRow);
    const timestamp = logRow[COLUMN_TIMESTAMP];

    // Set the value to the most recent timestamp seen for this pair of users
    if (friendshipToLatestRemove[key]) {
      friendshipToLatestRemove[key] = Math.max(friendshipToLatestRemove[key], timestamp);
    } else {
      friendshipToLatestRemove[key] = parseInt(timestamp, 10);
    }
  };

  await csvStream(LOGS_REMOVE, collectLatestRemoveRequests);

  return friendshipToLatestRemove;
};

/**
 * Return whether a friendship was removed since the date in the provided log
 *
 * @param {string}  logRow              row in a log file
 * @param {Object}  friendshipRemoveMap map of latest "remove" transactions between users
 * @returns {boolean}                   whether friendship was removed since log date
 */
const removedSinceLog = (logRow: {}, friendshipRemoveMap: {}): boolean => {
  const timestamp = logRow[COLUMN_TIMESTAMP];
  const key = generateRelationshipKey(logRow);
  const removalTimestamp = friendshipRemoveMap[key];

  return !removalTimestamp || removalTimestamp < timestamp;
};

/**
 * Format and log the friendships to the console
 *
 * @param {Array} friendships array of friendships
 */
const prettyPrintFriends = (friendships: string[][]) => {
  const prettifyReducer = (prettified: string, friends: string[]): string => `${prettified}${friends[0]} and ${friends[1]}\n`;

  const prettifiedFriendships: string = friendships.reduce(prettifyReducer, 'Friends:\n');

  console.log(prettifiedFriendships);
};

/**
 * Return all active friendships.
 *
 * @returns {Promise<string[][]>} array of user pairs
 */
async function getAllActiveFriendships(): Promise<string[][]> {
  const friendshipRemoveMap: {} = await generateFriendshipRemoveMap();
  const friendships: string[][] = [];

  const collectFriendships = (row: {}) => {
    if (removedSinceLog(row, friendshipRemoveMap)) {
      const user1: string = row[COLUMN_USER1];
      const user2: string = row[COLUMN_USER2];

      friendships.push([user1, user2]);
    }
  };

  await csvStream(LOGS_ACCEPT, collectFriendships);

  return friendships;
}

// TESTS
(async function test() {
  const actual = await getAllActiveFriendships();
  const expected = [['kai', 'fai'], ['fluh', 'bluh'], ['gloo', 'bloo']];

  prettyPrintFriends(actual);
  assertArrayEquals(expected, actual, 'get all active friendships');
}());
