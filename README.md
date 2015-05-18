# Survivor Simulator

Can Survivor be quantified and simulated?

http://shiffman.net/s-31-simulator/

## Current status:

* As of now, every single choice is random.
* Select 20 players.
* 2 tribes.
* Merge at 12.
* Jury of 9, final 3.

## Planned features
* Implement probabilities based on traits.
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
