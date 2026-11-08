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

Four karma tests, all failing only on the agent:

| test | state |
|---|---|
| `#libutvideo`, `#mjpeg`, `#libvpx` | one cause: `avidmx`/`webmdmx` cannot open the downloaded file because its gmem blob is flagged `GF_BLOB_CORRUPTED` although it holds the whole file |
| `#libheif` | a 60 s timeout with a different signature - a `TypeError` in `reportUndefinedSymbols`, the same crash the Showcase `avif` and `midi` demos hit |

What has been ruled out for the first three, by measurement: the network (the
files download in 15 ms with `curl` from a pod in that cluster), `/dev/shm`
(`--disable-dev-shm-usage` changed nothing), compression (no
`content-encoding`, `Content-Length` correct), a slow, truncated or stalled
transfer (none reproduces it locally), and an aborted session (no abort is
logged). `GF_EOS` is only ever concluded from `total_size == bytes_done` in
`downloader_emscripten.c`, so a download the fetcher finished without a usable
`total_size` lands in the error branch and the complete blob is declared
corrupted. An instrument printing `fetch_err`, `bytes_done` and `total_size` is
written and waiting.

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
