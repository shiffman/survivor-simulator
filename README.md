# Survivor Simulator

Can Survivor be quantified and simulated?

http://shiffman.net/s-31-simulator/

## Current status:

* Tribal immunity
    * Probability of a tribe winning immunity is tied to the sum of each player's "premerge" challenge rating.
* Individual immunity
    * Probability of an individual winning immunity is tied to each player's "postmerge" challenge rating. 
* Being voted out (pre-merge)
    * Your challenge skill makes you less likely.  Your likeability makes you less likely.
* Being voted out (post-merge)
    * Your challenge skill makes you more likely.  Your likeability makes you less likely until there are 6 left, then you are more likely.
* 2 tribes.
* Merge at 12.
* Jury of 9, final 3.

## Planned features
* Implement probabilities based on traits.
   * [Initial traits](https://github.com/shiffman/s-31-simulator/blob/gh-pages/players.json) - need feature for storing, reloading, linking to a cast.
* Swaps.
* Hidden Immunity idols.
* Simulated alliances.
* [More here](https://github.com/shiffman/s-31-simulator/issues).

## Overall algorithm
1. Randomly make two tribes, 5 men and 5 women.
2. While there are greater than 12 players.
    * Pick a tribe to win immunity.
    * Pick a player to be voted out of losing tribe.
3. Merge to 1 tribe.
4. While there are greater than 3 players.
    * Pick a player to win immunity.
    * Pick a player to be voted out (cannot be immune player).
    * Each player voted out moves to jury.
5. Each jury member votes for a player in the final three.
6. Player in final 3 with most votes wins.

## Traits
1. Pre-merge challenge ability: you are less likely to be voted out pre-merge.
2. Post-merge challenge ability: you are more likely to be voted out post-merge.  Also when the game approaches the merge, your likelihood of being voted out increases.
3. Likeability: this generally makes you less likely to be voted out when the game begins and more likely to be voted out as the final three approaches.  You are more likely to get jury votes.
4. more to come. .  .?
