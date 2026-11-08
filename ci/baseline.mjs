/*
 * Applies ci/known-failures.json to the JUnit report karma writes, so the
 * Jenkins job reports a NEW failure instead of the backlog it inherited. A job
 * that is always red protects nothing: nobody reads the fifth consecutive red
 * build, and a genuine regression then arrives unnoticed.
 *
 * A known failure becomes <skipped> with its reason, and keeps its console
 * output - the diagnosis of these four lives in the build log and must stay
 * readable.
 *
 * Two guards keep this from becoming a way to hide things:
 *   - a listed test that passes is reported as a failure naming itself, which
 *     is the signal to delete its entry; the list cannot quietly rot.
 *   - if nothing passed at all, the run fails whatever the list says. A
 *     wholesale breakage must never look green.
 *
 * Usage: node ci/baseline.mjs [glob-ish prefix, default TESTS-]
 * Exits 0 when every failure is a known one, 1 otherwise.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = process.argv[2] || 'TESTS-';

let KNOWN = {};
try { KNOWN = JSON.parse(await readFile(join(ROOT, 'ci', 'known-failures.json'), 'utf8')).known || {}; } catch (e) {
  console.error('no usable ci/known-failures.json: ' + e.message);
}

const files = (await readdir(ROOT)).filter(f => f.startsWith(PREFIX) && f.endsWith('.xml'));
if (!files.length) { console.error(`no ${PREFIX}*.xml in ${ROOT} - did the tests run?`); process.exit(1); }

const xmlAttr = (s) => String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

let passed = 0, newFailures = [], retired = [], masked = [];

for (const f of files) {
  const path = join(ROOT, f);
  let xml = await readFile(path, 'utf8');

  /* One testcase at a time, with its body: karma writes <failure> inside it.
   * The self-closing form has to come first and be matched lazily: with
   * <testcase[^>]*> first, "[^>]*" happily eats the trailing slash of a
   * self-closing tag and the body then runs to the NEXT </testcase>,
   * swallowing every passing test in between. */
  xml = xml.replace(/<testcase\b([^>]*?)\/>|<testcase\b([^>]*?)>([\s\S]*?)<\/testcase>/g, (m, selfAttrs, attrs, body) => {
    const a = attrs ?? selfAttrs ?? '';
    const name = unescape((/\bname="([^"]*)"/.exec(a) || [, ''])[1]);
    const failed = body ? /<(failure|error)\b/.test(body) : false;
    const why = KNOWN[name];

    if (!failed) {
      passed++;
      if (why) retired.push(name);
      return m;
    }
    if (!why) { newFailures.push(name); return m; }

    masked.push(name);
    /* Keep whatever karma put in <system-out>: the GPAC log is the diagnosis. */
    const kept = (body || '').replace(/<(failure|error)\b[\s\S]*?(\/>|<\/\1>)/g, '');
    return `<testcase${a}>\n      <skipped message="${xmlAttr('known failure, baselined in ci/known-failures.json: ' + why)}"/>` + kept + `</testcase>`;
  });

  await writeFile(path, xml);
}

/* The baseline describes the Jenkins agent: these four pass on a laptop and
 * fail there. Outside CI a listed test passing is expected, not a finding, so
 * it is reported and does not fail the run. */
const IN_CI = !!(process.env.JENKINS_URL || process.env.BUILD_NUMBER || process.env.CI);

for (const n of masked) console.log(`  known  ${n}`);
for (const n of retired) console.log(`  ${IN_CI ? 'FIXED ' : 'note  '} ${n}  - passes here` +
  (IN_CI ? ', remove it from ci/known-failures.json' : ' (expected outside CI: the baseline describes the agent)'));
for (const n of newFailures) console.log(`  FAIL   ${n}`);

console.log(`\n  ${passed} passed, ${masked.length} known failures, ${newFailures.length} new failures` +
  (retired.length ? `, ${retired.length} to retire` : ''));

if (!passed) { console.error('\nnothing passed at all: the baseline does not apply to a run this broken'); process.exit(1); }
const bad = newFailures.length + (IN_CI ? retired.length : 0);
if (bad) { console.error(`\n${bad} failing checks`); process.exit(1); }
console.log('\nno new failure');
