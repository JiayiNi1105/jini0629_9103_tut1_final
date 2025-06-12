
let appleMax = 12;
let appleInterval = 500; // Delay between apples

function setupApples(baseX, baseY) {
  balls = [];
  for (let i = 0; i < branchLines.length && i < appleMax; i++) {
    let b = branchLines[i];
    let delay = trunkMax * trunkInterval + i * appleInterval;
    let x = baseX + cos(b.angle) * b.len;
    let y = baseY + sin(b.angle) * b.len;
    balls.push({ x, y, born: growthStartTime + delay });
  }
}

function drawApples() {
  for (let b of balls) {
    let age = millis() - b.born;
    let t = constrain(age / 800, 0, 1);
    let grow = sin(t * PI);

    push();
    translate(b.x, b.y);
    scale(grow);
    stroke(0);
    strokeWeight(1);

    fill('#C3695D');
    arc(0, 0, 20, 20, PI / 2, PI * 3 / 2, PIE);

    fill('#2AA25E');
    arc(0, 0, 20, 20, PI * 3 / 2, PI / 2, PIE);
    pop();
  }
}

// Integration hook inside drawBranches()
function drawBranches() {
  let x = width / 2;
  let offsetY = 60;
  let scaleFactor = 1.1;
  let baseTop = height - 160 * scaleFactor + offsetY;
  let topY = baseTop - (trunkMax - 1) * 40 * scaleFactor;
  let branchLength = 80;

  if (branchLines.length < branchMax) {
    let now = millis();
    if (now - growthStartTime >= branchLines.length * branchInterval) {
      let angle = map(branchLines.length, 0, branchMax - 1, -PI / 2.5, PI / 2.5);
      let length = branchLength + random(-20, 20);
      branchLines.push({ angle: angle, len: length, born: now });
    }
  }

  push();
  translate(x, topY);
  stroke(50);
  strokeWeight(2);
  for (let b of branchLines) {
    let age = millis() - b.born;
    let t = constrain(age / 800, 0, 1);
    let ease = sin(t * PI);
    let len = b.len * ease;
    let x2 = cos(b.angle) * len;
    let y2 = sin(b.angle) * len;
    line(0, 0, x2, y2);
  }
  pop();

  // Setup apples once when all branches are drawn
  if (branchLines.length === branchMax && balls.length === 0) {
    setupApples(x, topY);
  }

  drawApples();
}
