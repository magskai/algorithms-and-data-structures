import { createReadStream } from 'fs';
import { parse } from 'csv';
import { resolve as resolvePath } from 'path';
import { assertArrayEquals } from '../../../util/AssertUtil';
import { concatTokens } from '../../../util/KeyGenerationUtil';

// options for the CSV parser
const CSV_PARSER_OPTS = {
  columns: true,
  delimiter: ',',
};

// log file paths
const LOGS_ACCEPT = './challenges/other/social-media-friendships/accept.csv';
const LOGS_REMOVE = './challenges/other/social-media-friendships/remove.csv';

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
