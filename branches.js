let balls = [];
let trunkGrowthStart;
let trunkFinishedTime = 0;
let trunkDuration = 1200; // wait time until all trunk balls finish
let branchGrowDelay = 100; // delay between each apple/ball
let cycleDuration = 3000; // full cycle duration

// Circles class storing information of each ball
class Circles {
  constructor(starterXPos, starterYPos, starterDiameter, colorTop, colorBottom, bornTime) {
    this.ballXPos = starterXPos;
    this.ballYPos = starterYPos;
    this.ballDiameter = starterDiameter;
    this.born = bornTime ?? millis();

    // stored random colors with min/max of browns for trunk
    this.colorTop = colorTop ?? color(random(80, 100), random(50, 70), random(40, 50));
    this.colorBottom = colorBottom ?? color(random(120, 150), random(80, 100), random(50, 80));
  }

  generateTrunk() {
    trunkGrowthStart = millis();
    const segments = 3;
    let y = this.ballYPos;
    let x = this.ballXPos;
    let prevD = this.ballDiameter;

    balls.length = 0; // clear existing
    balls.push(new Circles(x, y, prevD, this.colorTop, this.colorBottom, trunkGrowthStart));

    for (let i = 0; i < segments; i++) {
      let newD = Math.round(random(10, 80));
      y -= (prevD / 2 + newD / 2);
      // Keep trunk within screen bounds
      y = constrain(y, newD / 2, height - newD / 2);
      let bornTime = trunkGrowthStart + (i + 1) * branchGrowDelay;
      balls.push(new Circles(x, y, newD, null, null, bornTime));
      prevD = newD;
    }

    trunkFinishedTime = trunkGrowthStart + (segments + 1) * branchGrowDelay;
  }

  generateBranches() {
    const start = balls[balls.length - 1];
    const numBranches = 4;
    const angleOffsets = [-PI/6, -PI/3, -TWO_PI/3, -(5*PI)/6];

    const seasonColors = [
      [color(120, 255, 120), color(80, 200, 80)],
      [color(255, 230, 100), color(255, 180, 60)],
      [color(255, 100, 0), color(150, 30, 0)],
      [color(120, 180, 255), color(60, 120, 200)]
    ];

    for (let i = 0; i < numBranches; i++) {
      this.growBranch(start.ballXPos, start.ballYPos, 6, angleOffsets[i], seasonColors[i], trunkFinishedTime + i * 2 * branchGrowDelay);
    }
  }

  growBranch(x, y, segments, angle, colorPair, startDelay) {
    let prevD = random(10, 60);
    let baseTop = color(random(80, 100), random(50, 70), random(40, 50));
    let baseBottom = color(random(120, 150), random(80, 100), random(50, 80));

    for (let i = 0; i < segments; i++) {
      let newD = random(10, 60);
      let lerpAmt = sqrt(i / segments);
      let interpolatedTop = lerpColor(baseTop, colorPair[0], lerpAmt);
      let interpolatedBottom = lerpColor(baseBottom, colorPair[1], lerpAmt);

      let newX = x + cos(angle) * (prevD / 2 + newD / 2);
      let newY = y + sin(angle) * (prevD / 2 + newD / 2);
      
      // Keep circles within screen bounds
      newX = constrain(newX, newD / 2, width - newD / 2);
      newY = constrain(newY, newD / 2, height - newD / 2);
      
      x = newX;
      y = newY;

      let jitter = random(-PI / 10, PI / 10);
      angle += jitter;

      let born = startDelay + i * branchGrowDelay;
      balls.push(new Circles(x, y, newD, interpolatedTop, interpolatedBottom, born));
      prevD = newD;
    }
  }

  display() {
    let now = millis();
    if (now - trunkGrowthStart > cycleDuration) {
      this.resetCycle();
      return;
    }

    let age = now - this.born;
    if (age < 0) return;
    let t = constrain(age / 800, 0, 1);
    let scaleAmt = sin(t * PI);

    push();
    translate(this.ballXPos, this.ballYPos);
    scale(scaleAmt);
    noStroke();

    fill(this.colorTop);
    arc(0, 0, this.ballDiameter, this.ballDiameter, PI / 2, 3 * PI / 2, PIE);

    fill(this.colorBottom);
    arc(0, 0, this.ballDiameter, this.ballDiameter, 3 * PI / 2, PI / 2);

    pop();
  }

  resetCycle() {
    this.generateTrunk();
    this.generateBranches();
  }
}