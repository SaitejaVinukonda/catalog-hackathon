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
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2] || path.join(__dirname, 'input.json');

if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  console.error("Usage: node lagrange_c_steps.js <input.json>");
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
let json;
try {
  json = JSON.parse(raw);
} catch (e) {
  console.error("Invalid JSON:", e.message);
  process.exit(1);
}

if (!json.keys || typeof json.keys.k !== 'number') {
  console.error("JSON must include keys.k (number of points to use).");
  process.exit(1);
}

const k = json.keys.k;

// Collect points (x from key, y decoded from base)
// Keep order by numeric x (so "1","2","3","6" become 1,2,3,6)
let points = [];
for (const key of Object.keys(json)) {
  if (key === 'keys') continue;
  // skip non-numeric keys defensively
  if (!/^\d+$/.test(key)) continue;
  const x = Number(key);
  const record = json[key];
  if (!record || typeof record.base === 'undefined' || typeof record.value === 'undefined') {
    console.warn(`Skipping malformed entry for key ${key}`);
    continue;
  }
  const base = Number(record.base);
  const valueStr = String(record.value).toLowerCase();

  // decode using parseInt (handles 0-9 and a-z)
  const y = parseInt(valueStr, base);
  if (Number.isNaN(y)) {
    console.error(`Failed to parse value "${valueStr}" in base ${base} for x=${x}`);
    process.exit(1);
  }
  points.push({ x, y, base, valueStr });
}

// sort by x ascending
points.sort((a, b) => a.x - b.x);

console.log(`Loaded ${points.length} points; using first k=${k} points for interpolation.\n`);

// show decoded points
console.log("Decoded points (in decimal):");
points.forEach((p, i) => {
  console.log(`  ${i+1}. x=${p.x}, y (decoded) = ${p.y}  (original="${p.valueStr}" base=${p.base})`);
});
console.log();

if (points.length < k) {
  console.error(`Not enough points: have ${points.length}, but k=${k}`);
  process.exit(1);
}

// use first k points
points = points.slice(0, k);

// helper to format a rational factor nicely
function fmtRatio(num, den) {
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

// Compute Lagrange interpolation at x=0 exactly using rational arithmetic with JS Numbers.
// For these inputs it's fine; for extremely large inputs you'd want BigInt rationals.
// We'll compute each term as a floating number but print the exact fractional product of factors.
let c = 0;
console.log(`Computing c = P(0) using Lagrange from first ${k} points:\n`);

for (let i = 0; i < points.length; i++) {
  const xi = points[i].x;
  const yi = points[i].y;

  // We'll compute product of factors in rational form (numerator, denominator)
  let num = 1;
  let den = 1;
  let factorStrs = [];

  for (let j = 0; j < points.length; j++) {
    if (j === i) continue;
    const xj = points[j].x;
    // factor = (0 - xj) / (xi - xj)  => numerator = -xj , denominator = (xi - xj)
    const fn = -xj;
    const fd = xi - xj;
    num *= fn;
    den *= fd;
    factorStrs.push(`(0-${xj})/(${xi}-${xj})`);
  }

  // term = yi * (num/den)
  const termValue = yi * (num / den);
  c += termValue;

  // print breakdown
  console.log(`Term for point i=${i+1} (x=${xi}, y=${yi}):`);
  console.log(`  factors: ${factorStrs.join(' × ')}`);
  console.log(`  fractional product = (${num}) / (${den}) = ${num}/${den}`);
  console.log(`  numeric term = y_i × product = ${yi} × (${num}/${den}) = ${termValue}`);
  console.log();
}

const cRounded = Math.round(c * 1e12) / 1e12; // trim tiny FP noise
console.log(`Final sum (c) = ${c}  => rounded = ${cRounded}`);

        c += term;
    }

    // Round to nearest integer for cleaner output
    return Math.round(c);
}

const c = findConstantTerm(points);
console.log(`\n🔑 Constant term (c) = ${c}`);
