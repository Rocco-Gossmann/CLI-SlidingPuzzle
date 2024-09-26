# CLI - Sliding Puzzle

A 3x3 Sliding-Puzzle that can be played right in your Terminal.

## Why does this exist?

I wanted to play around with Deno 2.0  (Liking it so far).

Instead of building yet another web based Todo-App, I wanted to try to build a quick CLI-Tool instead.
(Well, "tool" may be a bit exaggerated, but building it from scratch was quick).

Deno 2.0 comes with a built in LSP, Prettier/Formater, Typescript-Support etc. No need to load or install extra node modules at all. 


## How to run the Game.

1. First make sure you have installed Deno 2.0 (at this point in time it is only in the release candidate stage)
2. Clone this Repo and enter it
3. Run 
```bash
deno run game
```
or
```bash
deno run main.ts
```

## How to play the Game.

The Terminal shows you a playfield that looks like this.  
```
   1 2 3
 ---------
a| 3 5 8 |
b| 4 7 6 |
c|   2 1 |
 ---------
```
> [!note]
> The numbers sequence inside the field are randomized each start.

You then enter the coordinates of the tile you wish to move,  
Followed by the Enter/Return Key.  
The chosen tile, then moves to the next adjacent empty slot.

For example entering "c2[ENTER]" will move the tile at "c2" to position "c1", since that is the empty slot.

```
   1 2 3
 ---------
a| 3 5 8 |
b| 4 7 6 |
c| 2   1 |
 ---------
```

you do this until the field looks like this.
```
   1 2 3
 ---------
a| 1 2 3 |
b| 4 5 6 |
c| 7 8   |
 ---------
You solved it. It tock you  xx  turn(s)
```

> [!note]   
> Keep in mind that moving a tile, that has no empty spot next to it, will not work.
> It will however still cost you a turn.

