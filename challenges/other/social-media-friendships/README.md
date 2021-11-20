# Social Media Friendships

This was a challenge that a friend of mine was given while interviewing at a social media company.

I like it because it's not very tricky, and leans more on practical thinking.

## Challenge
You work on a social media platform. You have CSV log files containing data about friendship transactions between users.

Find all active friendships.

The log files are:\
  `request.csv`\
  `remove.csv`\
  `accept.csv`\
  `reject.csv`

Each log file contains 3 columns:\
  `user1`
  `user2`
  `timestamp`

#### Expected output

An array of arrays of user pairs\
`[[user1, user2]]`


#### Example

`appa` and `momo` are friends.\
`hiphopapotamus` and `rhymenocerous` are friends.

Output:\
`[['appa', 'momo'], ['hiphopapotamus', 'rhymenocerous']]`

#### Considerations

  * The logs are not guaranteed to be in order.
  * Result cannot contain duplicates.
  * The data is clean: every field is populated with valid values, no logs are missing.

## My Approach

##### An active friendship can be defined:

* There exists a request between 2 users that was accepted.
* There does not exist a remove transaction more recent than the latest accept transaction.

Therefore, we only need to care about `accept.csv` and `remove.csv`.

One approach could involve sorting both log files, but we can easily assume that
the files can be very large. We should avoid loading them into memory from disk unless we
want a great sadness to fall upon our machine.

We can instead read the logs line by line, and do something with each row.

1. From `remove.csv`, create an object that maps the unique user pair to their most recent
  *"remove"* transaction.

2. From `accept.csv`, create an array of unique user pairs who not have a more recent timestamp in our friendship removal lookup table.

I generated the key by joining the usernames with a non-username delimiter character. The
delimiter guards against the edge case where two unique user pairs concatenate to the same result
(e.g. `['aaa', 'bb']` and `['aa', 'abb']` both create `aaabb`).

To ensure constant key length, we can add a hashing step after the join. I omitted it for
simplicity. We can also assume that usernames have a relatively modest character limit, so the
keys have an upper bound of how long they can become.

#### Complexity

We read every row in `accept.csv` and `remove.csv` in all cases.

In the worst case, every user pair is unique in each file. As in, every pair has accepted 1 friend request and has removed the friendship at most *once*.

We would store every row in `remove.csv`, and every row in `accept.csv` *minus* the ones in `remove.csv`.

Therefore, the time complexiy is **O(n + m)** and the space complexity is **O(n)**, where

  `n` is the number of rows in `accept.csv`\
  `m` is the number of rows in `remove.csv`