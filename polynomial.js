const fs = require('fs');

// Step 1: Ensure file argument is provided
if (process.argv.length < 3) {
    console.error("Usage: node findC.js <inputfile.json>");
    process.exit(1);
}

// Step 2: Read and parse JSON file
const jsonData = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// Extract n and k
const n = jsonData.keys.n;
const k = jsonData.keys.k;
console.log(`Number of points (n): ${n}`);
console.log(`Minimum required points (k): ${k}`);

// Step 3: Decode points
let points = [];
for (let key in jsonData) {
    if (key === "keys") continue; // skip metadata

    const x = parseInt(key); // JSON key is x value
    const base = parseInt(jsonData[key].base);
    const valueStr = jsonData[key].value.toString();

    // Convert y from given base to decimal
    const y = parseInt(valueStr, base);

    points.push({ x, y });
}

console.log("Decoded Points:", points);

// Step 4: Use only the first k points for interpolation
points = points.slice(0, k);

// Step 5: Lagrange interpolation to find constant term c = P(0)
function findConstantTerm(pts) {
    let c = 0;

    for (let i = 0; i < pts.length; i++) {
        let term = pts[i].y;

        for (let j = 0; j < pts.length; j++) {
            if (i !== j) {
                term *= (0 - pts[j].x) / (pts[i].x - pts[j].x);
            }
        }

        c += term;
    }

    // Round to nearest integer for cleaner output
    return Math.round(c);
}

const c = findConstantTerm(points);
console.log(`\n🔑 Constant term (c) = ${c}`);
