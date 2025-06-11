let img;
let palette = [];
let borderColor;
let columnWidths = [];
let balls = [];

function preload() {
  img = loadImage('Assets/Anwar Jalal Shemza Apple Tree.jpeg'); 
}

function setup() {
  createCanvas(img.width, img.height);
  extractBackgroundPalette();

  borderColor = color(152, 182, 180); // Light gray blue border
  generateColumnWidths();
}

function draw() {
  background(borderColor);
  drawMosaicBackground();
  drawBase();
  drawTrunk();

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
