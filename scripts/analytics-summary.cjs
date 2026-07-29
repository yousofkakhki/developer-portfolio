#!/usr/bin/env node

const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');

const file = process.argv[2] || process.env.ANALYTICS_FILE || path.join(process.cwd(), 'data/analytics/events.jsonl');

function increment(map, key) {
  map.set(key || '(none)', (map.get(key || '(none)') || 0) + 1);
}

function sortedObject(map) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

async function main() {
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ file, total: 0, message: 'No conversion events recorded yet.' }, null, 2));
    return;
  }

  const events = new Map();
  const sources = new Map();
  const locales = new Map();
  const days = new Map();
  let total = 0;
  let invalid = 0;

  const lines = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      total += 1;
      increment(events, record.event);
      increment(sources, record.source);
      increment(locales, record.locale);
      increment(days, typeof record.timestamp === 'string' ? record.timestamp.slice(0, 10) : '(unknown)');
    } catch {
      invalid += 1;
    }
  }

  console.log(JSON.stringify({
    file,
    total,
    invalid,
    byEvent: sortedObject(events),
    bySource: sortedObject(sources),
    byLocale: sortedObject(locales),
    byDay: sortedObject(days),
  }, null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
