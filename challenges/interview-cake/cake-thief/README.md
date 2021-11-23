# Cake Thief

From: https://www.interviewcake.com/question/javascript/cake-thief

You are a renowned thief who has recently switched from stealing precious metals to stealing cakes
because of the insane profit margins. You end up hitting the jackpot, breaking into the world's
largest privately owned stock of cakes—the vault of the Queen of England.

While Queen Elizabeth has a limited number of types of cake, she has an unlimited supply of each
type.

Each type of cake has a weight and a value, stored in an object with two properties:

**`weight`**: the weight of the cake in kilograms\
**`value`**: the monetary value of the cake in British shillings

You brought a duffel bag that can hold limited weight, and you want to make off with the most
valuable haul possible.

Write a function `maxDuffelBagValue()` that takes an array of cake type objects and a weight
capacity, and returns the maximum monetary value the duffel bag can hold.

**Weights and values may be any non-negative integer.** Yes, it's weird to think about cakes that
weigh nothing or duffel bags that can't hold anything. But we're not just super mastermind
criminals—we're also meticulous about keeping our algorithms flexible and comprehensive.

## My Approach

As always, trying all combinations is computationally expensive and not the solution. 

My next thought was to greedily select cakes with the highest value:weight ratio that can fit. Unfortunately, this sometimes breaks down when lower ratio cakes can fill the bag more completely.

For example, consider these inputs:
```
cake1 = { value: 20, weight: 2 }
cake2 = { value: 55, weight: 5 }
totalCapacity = 6
```
We would grab one `cake1` and end up with `55`. Meanwhile, the optimal solution is three of `cake2`,
valued at `60`.

Ok, what else can I use to build my output? What about the other argument? The `totalCapacity`?

Let's say I pack a bag to the airline weight limits (my fellow over-packers, you understand me) and
then the airline announces that they have raised the weight limit. I don't need to take everything
out and put it all back in to determine which additional items I can bring (this is a
theoretical space where we're safe from horrible-shaped objects). I can pack more things
up to the new weight limit, and I can even remove items to make room for something heavy that is
more valuable for my trip. Basically, I can work from my previous state instead of starting over.

So given a room full of big money cakes and a bag that breaks at a certain weight limit, how do we
get the most valuable haul?

Let's start with a bag that we already know is optimally packed, and incrementally increase the
capacity until we reach our target `totalCapacity` while memoizing the maximum value at each
increment.

At each step, we'll look at all the cakes. If a cake can fit, calculate the best possible value
if our bag contained the cake, by adding `cake.value` + `maxValues[capacity - cake.weight]` (we're
accounting for the cake plus the space around the cake). Choose the cake that gets us the maximum
value and memoize this value. By the end, we have built our final answer from all the previous ones.

### Example
As for the bag we're sure is optimally packed, it's the one with 0 capacity. Unless we have
a weightless cake, our max value is 0.

At `currentCapacity === 1`, we consider any cakes that weigh <= 1 kg. The case here is simple:
choose the most valuable 1 kg cake.

Later, at `currentCapacity === 4`, we consider cakes that weigh <= 4 kg.

Consider these inputs:

```
cake1 = { value: 10, weight: 1 }
cake2 = { value: 25, weight: 2 }
currentCapacity = 4
```

So far, we know:
| capacity | max value |
| --- | --- |
| 0 | 0 |
| 1 | 10 |
| 2 | 25 |
| 3 | 35 |

If we take `cake1`, our haul is `cake1.value` plus what we can fit in the space
around it. The capacity of the surrounding space is `(currentCapacity - cake1.weight) = (4 - 1) = 3`.
Conveniently, we've already calculated the max value at `capacity === 3`.
So we get `10 + 35 = 45` shillings with `cake1`.

If we take `cake2`, we get `25 + 25 = 50` shillings.

We'll continue until we can calculate the max value at `totalCapacity`.

### Complexity
We iterate through the range of `totalCapacity`, and look at all of the cakes at each step.

We also store an array that is the size of `totalCapacity + 1` to record the max possible value
at each capacity from 0 to `totalCapacity`.

Therefore, the time complexity is **`O(n + m)`** and the space complexity is **`O(n)`** where\
`n === totalCapacity`\
`m === cakeTypes.length`


