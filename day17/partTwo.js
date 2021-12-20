// Too lazy to parse the input text
const target = {
  x: [244, 303],
  y: [-91, -54],
};

/*
  Determining which velocities and step counts to consider

  X velocities & steps

  Every X velocity will eventually reach a maximum x position calculated by (x * (x + 1) / 2).
  The minimum X velocity that should be considered is 22 (22 * 23 / 2 = 253).
  The maximum X velocity to consider is 303, which will hit the target on step 1.

  We should consider X steps 1 through 25. The highest X velocity that will terminate within
  the target area is 24 (terminating at 300 on step 25). After this step, no other velocities
  will ever reach the target area.

  Y velocities & steps

  We should consider all Y velocities between -91 and 90. a Y velocity of -91 will hit
  the target area on step 1, and a Y velocity of 90 will hit the target area on step
  182.

  So, in total, we should consider 182 steps for velocities:
  22 <= X <= 303
  -91 <= Y <= 90
*/
const velocities = [];
for (let x = 22; x <= 303; x++) {
  for (let y = -91; y <= 90; y++) {
    const velocity = { x, y };
    const p = { x, y };
    let step = 1;

    // iterate steps until the shot is passed the target on either axis
    while (p.x <= target.x[1] && p.y >= target.y[0]) {

      // if we've entered the target area, add it to the list and abort
      if (p.x >= target.x[0] && p.y <= target.y[1]) {
        velocities.push(velocity);
        break;
      }
      // once step === velocity.x, the shot has stopped moving forward
      if (step < velocity.x) {
        p.x += (velocity.x - step);
      }

      p.y += (velocity.y - step);

      step += 1;
    }
  }
}

console.log(velocities.length);