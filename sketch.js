let trunk; // Circles 
let img;
let palette = [];
let borderColor;
let columnWidths = [];
let trunkCircles = [];           // Store circles with position and born time
let trunkMax = 3;                // Max number of trunk circles
let trunkInterval = 1000;        // Delay between growth (ms)

let branchLines = [];
let branchMax = 12;               // Total branches
let branchInterval = 500;         // Delay between each branch (ms)

function preload() {
  img = loadImage('Assets/Anwar Jalal Shemza Apple Tree.jpeg'); 
}

function setup() {
  createCanvas(img.width, img.height);
  extractBackgroundPalette();
  growthStartTime = millis();
  borderColor = color(152, 182, 180); // Light gray blue border
  generateColumnWidths();
  trunk = new Circles(width / 2, height - height / 3, 50);
  trunk.generateTrunk();
  trunk.generateBranches();

}

function draw() {
  background(borderColor);
  drawMosaicBackground();
  drawBase();
  drawTrunk();
  drawBranches();
for (let ball of balls) {
  ball.display();
}

  }

// ============ BELOW: BACKGROUND + BASE RELATED FUNCTIONS ============

function extractBackgroundPalette() {
  let maxSamples = 50;
  for (let i = 0; i < maxSamples; i++) {
    let x = floor(random(img.width));
    let y = floor(random(img.height));
    let c = img.get(x, y);
    let sat = saturation(color(c));
    let bright = brightness(color(c));
    if (sat < 40 && bright > 10 && bright < 90) {
      palette.push(color(c));
    }
  }
  if (palette.length < 30) {
    palette = [color(120, 140, 160), color(100, 130, 150), color(80, 110, 130)];
  }
}

function getBackgroundColor(x, y) {
  let attempt = 0;
  let maxAttempts = 5;
  while (attempt < maxAttempts) {
    let c = color(img.get(x, y));
    let s = saturation(c);
    let b = brightness(c);
    if (s < 40 && b > 10 && b < 90) return c;
    x = constrain(x + floor(random(-15, 15)), 0, img.width - 1);
    y = constrain(y + floor(random(-15, 15)), 0, img.height - 1);
    attempt++;
  }
  return random(palette);
}

function generateColumnWidths() {
  let margin = 25;
  let minWidth = 20;
  let maxWidth = 40;
  let x = margin;
  let remaining = width - 2 * margin;
  columnWidths = [];
  while (remaining >= minWidth) {
    let maxW = min(maxWidth, remaining);
    let w = floor(random(minWidth, maxW + 1));
    if (remaining - w < minWidth) w = remaining;
    columnWidths.push(w);
    x += w;
    remaining -= w;
  }
}

function drawMosaicBackground() {
  let margin = 25;
  let segmentHeight = 25;
  let prevRowColors = [];
  for (let y = margin; y < height - margin; y += segmentHeight) {
    let x = margin;
    let thisRowColors = [];
    for (let i = 0; i < columnWidths.length; i++) {
      let segmentWidth = columnWidths[i];
      let cx = constrain(floor(x + segmentWidth / 2), 0, img.width - 1);
      let cy = constrain(floor(y + segmentHeight / 2), 0, img.height - 1);
      let baseColor = getBackgroundColor(cx, cy);
      if (prevRowColors.length === columnWidths.length) {
        let upperColor = prevRowColors[i];
        baseColor = lerpColor(upperColor, baseColor, random(0.3, 0.7));
      }
      fill(baseColor);
      rect(x, y, segmentWidth, segmentHeight);
      thisRowColors.push(baseColor);
      x += segmentWidth;
    }
    prevRowColors = thisRowColors;
  }
}

function drawTrunk() {
  let x = width / 2;
  let offsetY = 60;
  let scaleFactor = 1.1;
  let baseTop = height - 160 * scaleFactor + offsetY;
  let r = 40 * scaleFactor;
  let spacing = r;

  if (trunkCircles.length < trunkMax) {
    let now = millis();
    if (now - growthStartTime >= trunkCircles.length * trunkInterval) {
      let y = baseTop - spacing * trunkCircles.length;
      trunkCircles.push({ y: y, born: now });
    }
  }

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

    fill('#5B3D2F');
    arc(0, 0, r, r, PI / 2, PI * 3 / 2, PIE);

    fill('#885138');
    arc(0, 0, r, r, PI * 3 / 2, PI / 2, PIE);
    pop();
  }
}

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
 

  for (let b of branchLines) {
    let age = millis() - b.born;
    let t = constrain(age / 800, 0, 1);
    let ease = sin(t * PI);
    let len = b.len * ease;

    let x2 = cos(b.angle) * len;
    let y2 = sin(b.angle) * len;
   
  }
  pop();
}

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

    let now = millis();
    let arcDelay = 500;
    let arcDuration = 600;
    let arcIndex = i - 2;
    let arcAppearTime = growthStartTime + trunkMax * trunkInterval + arcIndex * arcDelay;
    let age = now - arcAppearTime;
    let t = constrain(age / arcDuration, 0, 1);
    let grow = sin(t * PI);

    if (i >= 2 && i <= 6) {
      push();
      translate(cx, cy);
     let grow = sin(t * PI); 
      fill('#2AA25E');
      arc(0, 0, cellW, cellH, PI, 0, PIE);
      fill('#C3695D');
      arc(0, 0, cellW, cellH, 0, PI, PIE);
      pop();
    } else {
      fill('#2AA25E');
      arc(cx, cy, cellW, cellH, PI, 0, PIE);
    }
  }
}
