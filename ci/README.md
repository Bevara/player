# The failure baseline

`baseline.mjs` applies `known-failures.json` to the JUnit report karma writes,
so the Jenkins job reports a **new** failure instead of the backlog it
inherited. A job that is always red protects nothing: nobody reads the fifth
consecutive red build, and a genuine regression then arrives unnoticed.

A known failure becomes `<skipped>` carrying its reason, and keeps its
`<system-out>` - the diagnosis of these four lives in the build log and has to
stay readable.

## Two guards

- **The list cannot rot.** A listed test that passes is reported as a failure
  naming itself, which is the signal to delete its entry. Outside CI that is a
  note rather than a failure, because the baseline describes the Jenkins agent:
  all four pass on a laptop.
- **It cannot mask everything.** If nothing passed at all, the run fails
  whatever the list says.

## What is on the list today

One karma test, failing only on the agent:

| test | state |
|---|---|
| `#libheif` | a 60 s timeout with a `TypeError` in `reportUndefinedSymbols` - the crash an accessor causes when it wants a symbol the solver does not export, and the function meant to name that symbol fails on it. Not yet diagnosed. |

Three others were here until build #143 and are the reason this mechanism
earned its keep: `#libutvideo`, `#mjpeg` and `#libvpx`. On the agent the
emscripten download manager never learns a response's length (`total_size`
stays 0), and it took the fetcher's final EOS-with-no-bytes for an error,
flagging a complete blob corrupted so that `avidmx` and `webmdmx` refused their
input. The fix is one condition in `downloader_emscripten.c` - an EOS is not an
error. Build #143 passed all three and this script failed the build on purpose,
asking for their entries to be removed.

## Running it

```sh
node ci/baseline.mjs            # reads TESTS-*.xml next to the repository root
node ci/baseline.mjs PREFIX-    # another report prefix
```

In the Jenkins job it runs after the tests, which are allowed to fail:

```sh
make test || true
cd .. && node ci/baseline.mjs
```

The JUnit archiver then publishes the rewritten report, so Jenkins shows the
four as skipped with their reason rather than as failures.
