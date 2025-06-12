// Draw the trunk, which consists of three half-green and half-dark green circles, arranged vertically against the base.
function drawTrunk() {
  let x = width / 2; // Trunk horizontal center
  let offsetY = 60; // Vertical offset to match base
  let scaleFactor = 1.1;

  let baseTop = height - 160 * scaleFactor + offsetY;
  let r = 40 * scaleFactor;
  let spacing = r;

  // Add new circles based on time (one per second)
  if (trunkCircles.length < trunkMax) {
    let now = millis();
    if (now - growthStartTime >= trunkCircles.length * trunkInterval) {
      let y = baseTop - spacing * trunkCircles.length;
      trunkCircles.push({ y: y, born: now });
    }
  }

  // Draw each trunk segment with scale-based animation
  for (let c of trunkCircles) {
    let age = millis() - c.born;
    let t = constrain(age / 800, 0, 1);
    let bounce = sin(t * PI);
    let growProgress = constrain(t + 0.4 * bounce, 0, 1);

    push();
    translate(x, c.y);
    scale(growProgress);
    stroke(0);
    strokeWeight(1);

    // Left half - dark green
    fill('#2AA25E');
    arc(0, 0, r, r, PI / 2, PI * 3 / 2, PIE);

    // Right half - light green
    fill('#A8DC80');
    arc(0, 0, r, r, PI * 3 / 2, PI / 2, PIE);
    pop();
  }
}

// Draw the base part, which consists of 9 rectangles, each with a red and green semicircle decoration inside (except for some)
function drawBase() {
  let offsetY = 76 + 5;
  let scale = 1.1;
  let baseTop = height - 160 * scale + offsetY;
  let cellW = (50 + 1) * scale;
  let cellH = (50 + 1) * scale;
  let xStart = width / 2 - (cellW * 4.5);

  for (let i = 0; i < 9; i++) {
    let x = xStart + i * cellW;

    if (i === 0 || i === 8) fill('#A8DC80');
    else if (i === 1 || i === 7) fill('#2AA25E');
    else if (i % 2 === 0) fill('#A8DC80');
    else fill('#2AA25E');

    stroke(0);
    strokeWeight(1);
    rect(x, baseTop, cellW, cellH);

    let cx = x + cellW / 2;
    let cy = baseTop + cellH / 2;

    noStroke();

    if (i >= 2 && i <= 6) {
      fill('#2AA25E'); // Top green
      arc(cx, cy, cellW, cellH, PI, 0, PIE);
      fill('#C3695D'); // Bottom red
      arc(cx, cy, cellW, cellH, 0, PI, PIE);
    } else {
      fill('#2AA25E'); // Outer caps green
      arc(cx, cy, cellW, cellH, PI, 0, PIE);
    }
  }
}
