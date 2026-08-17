/* Exercise the Worker's throttle in isolation — same logic, no network. */
const WINDOW_MS = 60_000;
const PER_IP_PER_MIN = 6;
const DAILY_BUDGET = 400;

let NOW = Date.now();
const hits = new Map();
let day = "";
let dayCount = 0;

function throttle(ip) {
  const today = new Date(NOW).toISOString().slice(0, 10);
  if (today !== day) { day = today; dayCount = 0; hits.clear(); }
  if (dayCount >= DAILY_BUDGET) return "budget";
  const now = NOW;
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP_PER_MIN) { hits.set(ip, recent); return "rate"; }
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;
  if (hits.size > 5000) hits.clear();
  return null;
}

const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
  if (!ok) process.exitCode = 1;
};

// 1. a normal visitor is never blocked
let out = [];
for (let i = 0; i < 6; i++) out.push(throttle("1.1.1.1"));
eq("6 requests allowed", out, [null, null, null, null, null, null]);

// 2. the 7th in the same minute is throttled
eq("7th throttled", throttle("1.1.1.1"), "rate");

// 3. a different visitor is unaffected by the first one's throttling
eq("other IP unaffected", throttle("2.2.2.2"), null);

// 4. the window slides — a minute later the first IP is served again
NOW += 61_000;
eq("allowed after window", throttle("1.1.1.1"), null);

// 5. the daily budget stops a distributed flood that per-IP limits miss
dayCount = DAILY_BUDGET;
eq("budget exhausted", throttle("9.9.9.9"), "budget");

// 6. a new day resets it
NOW += 24 * 60 * 60 * 1000;
eq("resets next day", throttle("9.9.9.9"), null);

console.log(process.exitCode ? "\nSOME CHECKS FAILED" : "\nall checks passed");
