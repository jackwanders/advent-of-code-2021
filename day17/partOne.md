# Trick Shot - Max Height

My first observation is that horizontal velocity is irrelevant, as it has no effect on the vertical trajectory of the shot.

The second observation is that every shot, if fired with a positive y velocity, will, after some number of steps, hit zero again.
For example, if y = 2, the heights reached will be:

| step | y velocity | height |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 1 | 3 |
| 3 | 0 | 3 |
| 4 | -1 | 2 |
| 5 | -2 | **0** |
| 6 | -3 | -3 |

From this, we know that the first negative height achieved by the shot will be -(y + 1) where y is the initial Y velocity.

To achieve maximum height, you need to fire a shot with the
highest initial Y velocity such that the shot still touches the target area at some step. My target area's lowest y position is -91, so the initial Y velocity that will hit this spot in its first step with negative height is 90. This is the highest initial Y velocity we can achieve while still hitting the target. If the initial Y velocity is any higher, it will miss the target area on its first step with negative height.

In Day 7 we used the simplification of `n + (n-1) + (n-2) + ...` to `n * (n+1) / 2`, and we can reuse that here to determine the maximum height of our shot.

`90 * (90 + 1) / 2 = 4095`