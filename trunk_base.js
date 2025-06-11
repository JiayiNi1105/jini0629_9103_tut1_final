let growthStartTime;
let trunkCircles = [];           // Store circles with position and born time
let trunkMax = 3;                // Max number of trunk circles
let trunkInterval = 1000;        // Delay between growth (ms)

// Draw the trunk, which consists of three half-green and half-dark green circles, arranged vertically against the base.
function drawTrunk() {
    let x = width / 2; // Trunk horizontal center
    let offsetY = 60; // Alignment offset
    let scaleFactor = 1.1;

    if (!growthStartTime) growthStartTime = millis();

    let baseTop = height - 160 * scaleFactor + offsetY;
    let r = 40 * scaleFactor;
    let spacing = r;

    // Add new circles based on time
    if (trunkCircles.length < trunkMax) {
        let now = millis();
        if (now - growthStartTime >= trunkCircles.length * trunkInterval) {
            let y = baseTop - spacing * trunkCircles.length;
            trunkCircles.push({ y: y, born: now });
        }
    }

    // Draw each circle with scaling animation
    for (let c of trunkCircles) {
        let age = millis() - c.born;
        let growProgress = constrain(age / 800, 0, 1); // Grow to full size in 800ms
        let currentR = r * growProgress;

        stroke(0);
        strokeWeight(1);

        // Left half - dark green
        fill('#2AA25E');
        arc(x, c.y, currentR, currentR, PI / 2, PI * 3 / 2, PIE);

        // Right half - light green
        fill('#A8DC80');
        arc(x, c.y, currentR, currentR, PI * 3 / 2, PI / 2, PIE);
    }
}

// Draw the base part, which consists of 9 rectangles, each with a red and green semicircle decoration inside (except for some)
function drawBase() {
    let offsetY = 76 + 5; // Base location
    let scale = 1.1; // Overall size

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
            fill('#2AA25E');
            arc(cx, cy, cellW, cellH, PI, 0, PIE);
            fill('#C3695D');
            arc(cx, cy, cellW, cellH, 0, PI, PIE);
        } else {
            fill('#2AA25E');
            arc(cx, cy, cellW, cellH, PI, 0, PIE);
        }
    }
}
