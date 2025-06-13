let trunkTimerStart;
let trunkCircleStates = [];
let trunkCycleDuration = 3000; // total animation cycle
let trunkGrowDelay = 400;

function setupTrunkBaseAnimation() {
  trunkTimerStart = millis();
  trunkCircleStates = [];

  for (let i = 0; i < 3; i++) {
    trunkCircleStates.push({
      yOffset: i,
      bornTime: trunkTimerStart + i * trunkGrowDelay,
    });
  }
}

function drawTrunk() {
  let now = millis();

  // reset cycle every 3 seconds
  if (now - trunkTimerStart > trunkCycleDuration) {
    setupTrunkBaseAnimation();
    return;
  }

  let x = width / 2;
  let offsetY = 60;
  let scale = 1.1;
  let baseTop = height - 160 * scale + offsetY;
  let r = 40 * scale;
  let spacing = r;

  for (let i = 0; i < trunkCircleStates.length; i++) {
    const circle = trunkCircleStates[i];
    const age = now - circle.bornTime;

    if (age < 0) continue;

    let t = constrain(age / 800, 0, 1);
    let bounce = sin(t * PI);
    let growProgress = constrain(t + 0.4 * bounce, 0, 1);
    let y = baseTop - spacing * circle.yOffset;

    push();
    translate(x, y);
    scale(growProgress);
    stroke(0);
    strokeWeight(1);

    fill('#5B3D2F');
    arc(0, 0, r, r, PI / 2, 3 * PI / 2, PIE);

    fill('#885138');
    arc(0, 0, r, r, 3 * PI / 2, PI / 2, PIE);
    pop();
  }
}
