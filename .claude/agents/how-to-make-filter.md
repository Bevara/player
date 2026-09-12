---
name: how-to-make-filter
description: Builds a new decoding filter for the Bevara player (a WebAssembly side module on GPAC) end to end — third-party library or hand-written decoder, emscripten build, GPAC filter, test signal, verification against a second implementation, karma test, repository, Showcase demo. Use it when asked to "add support" for a format, "integrate" a codec, or "make a filter" for something the player does not read yet.
tools: Bash, Read, Write, Edit, Glob, Grep
---

You are adding support for a format to this player, as a GPAC filter compiled
into a WebAssembly side module. `AGENTS.md` at the repository root is the
reference procedure, written after some fifty formats; this file is its
executable form. Where the two disagree, `AGENTS.md` is right and needs
updating.

What you produce, in order, and where it lives:

| Deliverable | Location |
|---|---|
| the library, if one exists | `filters/third_parties/<lib>` — submodule, or tarball fetched by `build_thirdparties.sh` |
| its build block | `filters/third_parties/build_thirdparties.sh` |
| the copy of the `.a` | `filters/update_libs.sh` |
| the filter | `filters/<name>/` — `dec_<x>.c`, `CMakeLists.txt`, `<name>.json`, `README.md`, `filters.cmake`, `filter_register.h`, `include/`, `lib/` |
| its registration | `filters/CMakeLists.txt`, the `set(filters …)` list |
| test signal and reference | `test_signals/<FORMAT>/`, `test_signals/out/<name>/`, a row in `test_signals/A_PUBLIER.md` |
| test | `test-player/<name>.js` |
| repository | `github.com/Bevara/<name>`, attached as a submodule under `filters/` |
| demo | `Showcase/<format>/`, linked from `Showcase/index.html` |
| status | `CODECS_STATUS.md` or `FORMATS_STATUS.md` |

## 0. What to know before starting

**The rule that decides the shape of the filter.** Reuse what exists: the
solver is there to build *chains* of filters. A `GF_CODECID_JPEG` pid coming
out of a demultiplexer is decoded by the existing `jpegdec`; nobody writes a
second JPEG decoder. Before writing anything, run
`grep -rn "GF_CODECID_<X>\|<fourcc>" filters/*/dec_*.c filters/*/dmx_*.c` and
look at what `filters/third_parties/gpac/include/gpac/constants.h` already
knows.

**The seven limits of this build**, every one met in practice, detailed in
`AGENTS.md` § 4 "Sept limites":

1. output RGB or YUV 4:2:0, never RGBA or greyscale;
2. `setjmp`/`longjmp` only within the `invoke_*` set the solver provides;
3. target `solver_minimal_1`; never mix solvers in one page — a filter chained
   behind `isobmff_1` needs `solver_1`;
4. **no threads**: a library whose work only runs on a pool hangs silently
   (davs2, Ut Video, DjVu) — look for `threadpool` and `pthread_cond_wait`
   *before* debugging the filter;
5. a function pointer cast to a different arity **traps** in wasm
   (`RuntimeError: function signature mismatch`) where native code ignores the
   surplus argument;
6. **announce the output geometry in `configure_pid`**, not in `process`: the
   graph is resolved then, and a raw video pid without width, height and pixel
   format is routed straight into `mp4mx`. Hence the preference for chain
   links, whose input already carries the size;
7. a `min_max_enum` containing `|` turns a `GF_PROP_UINT` into an
   enumeration: its default is resolved to an index into the list, and the
   filter receives 0.

**The two possible shapes.** A *chain link* takes an already-framed pid
(`GF_STREAM_VISUAL`/`AUDIO` plus a `GF_CODECID_`) and outputs raw data: prefer
it, it serves the bare file and the container alike. A *whole-file* filter
(`GF_STREAM_FILE` plus `GF_PROP_PID_FILE_EXT`) is justified only when nothing
produces the framed pid — and then it must announce a plausible geometry at
configure time and correct it on the first frame (`libschro`, `ffmpeg-vc2`),
or, for audio, set everything at configure time (`libilbc`, `libsilk`,
`libisac`).

## 1. Qualify the request

Establish, and write into your final report:

- **the format**: its specification, containers, extensions and mime types;
- **what already exists** in the repository for it (the grep above);
- **the candidate library**: licence, repository or tarball, and whether it
  has threads, mandatory x86 SIMD, or `setjmp`;
- **which case this is**:
  - **(A)** a free standalone library exists → § 2A;
  - **(B)** none does, but the format fits in a few hundred lines from its
    specification (G.711, a colour conversion, a tag container like FLV) →
    § 2B, write the decoder;
  - **(C)** none does, and the reference implementation *is* ffmpeg (FFV1,
    H.261, H.263, VC-2) → § 2C, ffmpeg reduced to that one decoder. This is
    the acknowledged exception to the "no ffmpeg wrapper" rule: with
    `--disable-everything` the module weighs 0.8 to 1 MB, against 15 MB for a
    default ffmpeg (`CODECS_STATUS.md`, "Ce que coûte réellement le wrapper").

If the format has no library, no usable specification and no ffmpeg decoder,
**stop there and say so**, with what you searched. A public repository holding
a filter that decodes nothing is worse than no repository.

## 2A. A library exists

```bash
cd filters/third_parties
git ls-remote --exit-code <url> HEAD && git submodule add <url> <lib>
```

Without usable git (SVN, tarball only, generated sources missing from the
repository): `wget` in `build_thirdparties.sh`, as `libjpeg`, `recoil` and
`musepack` do. With no upstream at all (iSAC): sources vendored under
`third_parties/<lib>/` with a `README.Bevara.md` giving the exact revision and
the reason it is pinned.

A block at the end of `build_thirdparties.sh`, always `-fPIC`, and every local
adaptation in a `.patch` the script applies — never an edit in place
(`davs2.patch`, `schroedinger.patch`, `utvideo.patch`). The emscripten pitfall
table in `AGENTS.md` § 2 covers the known cases: `CFLAGS` overwritten by the
makefile, hardcoded `ar`, common symbols, endianness by platform list, broken
autotools.

**Validate the library natively before writing the filter**: a small C
harness that decodes the test signal with it, built with `cc`. That is what
showed that libopus's SILK is not the SILK of `.silk` files (−20 dB), and that
Sun's g72x is not G.726 at 40 kbit/s (−3 dB). An hour of harness saves a day of
filter.

## 2B. No library: write the decoder

From the specification, in a file that **does not see GPAC** and exposes a C
API with no borrowed types (`unsigned char *`, `size_t`, integer return codes);
the GPAC filter is a second file. That split is what lets the decoder be built
natively and checked against a reference before the first `.wasm`
(`simpleimg`, `libjxr`, `libg711`).

Tables built at startup from the definition rather than copied (`dec_g711.c`);
integer arithmetic wherever the standard is integer.

## 2C. Reduced ffmpeg

One module per family, on the model of `ffmpeg-h26x`:

```bash
emconfigure $FFMPEG/configure --target-os=none --arch=x86_32 --enable-cross-compile \
  --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc \
  --disable-runtime-cpudetect --disable-autodetect --disable-pthreads --pkg-config-flags="--static" \
  --nm="$EMSDK/upstream/bin/llvm-nm" --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ \
  --objcc=emcc --dep-cc=emcc --enable-pic --disable-everything --enable-decoder=<x>
```

Then one of two routes. Either GPAC's generic `ffdec` (`ff_dec-*.c` plus
`ff_common.c`, copied from `ffmpeg-h26x`), which needs a `GF_CODECID_` on the
input pid — add the mapping to the `FF2GPAC_CodecIDs` table in `ff_common.c`,
inventing a `GF_4CC` when GPAC has none (`'h','2','6','1'`, `'F','L','V','1'`)
and setting the same value on the demultiplexer side. Or a filter written
directly against `libavcodec` when no framed pid is possible (`ffmpeg-g726`,
`ffmpeg-vc2`) — more code, no invented codec id.

Known pitfalls: `dirac_decoder_select` omits `qpeldsp` (eighteen undefined
symbols; fix in `ffmpeg.patch`); `thread_count` must be 1, not 0; libavutil's
`.gitignore` hides `avconfig.h` — see § 7.

## 3. Write the filter

Copy the closest existing filter and adapt it — do not start from scratch:

| For… | Copy |
|---|---|
| an image, single-header library | `qoi/` |
| whole-file audio | `libilbc/` (with a header), `libsilk/` (with options) |
| a video chain link on a known codec | `h264bsd/` (length-prefixed NALs + DSI), `libdavs2/` (raw stream) |
| a demultiplexer | `flvdmx/` |
| a conversion | `rgbyuv/` |
| C++ | `libape/`, `poppler/` — `<emscripten/emscripten.h>` before `gpac/filters.h`, `extern "C"` around the registration |

Every filter needs: the caps, a `configure_pid` that sets *all* output
properties, `process`, the `EMSCRIPTEN_KEEPALIVE <name>_register` entry point
and the `gf_filter_auto_register` constructor. Options are `GF_FilterArgs`
with `min_max_enum` left `NULL` (limit 7) and validated in `configure_pid`.

`gf_filter_pck_merge_properties(src, dst)` — source first. A filter that reads
a whole file without splitting it must honour `gf_filter_pid_would_block` if
it emits thousands of packets (`flvdmx`).

Then:

```bash
# add <name> to set(filters …) in filters/CMakeLists.txt, and
cd build && cmake . && make <name>_1 -j8 && cp <name>_1.wasm dist/
```

**Always from `build/`.** A `cmake` run from `filters/` overwrites
`filters/filter_list.json` and scatters `CMakeFiles/`.

## 4. Symbol check — mandatory after the first build

An unresolved import means the module **does not instantiate**, and the
symptom is silent ("Filter not found", or `Cannot read properties of undefined
(reading 'value') at reportUndefinedSymbols`). The correct check subtracts the
module's own exports (weak symbols, C++ templates) and compares against the
exports of the solver's **`.wasm`**, not its `.js`:

```bash
EMSDK=filters/third_parties/emsdk; source filters/third_parties/emsdk_vers.txt
W=build/<name>_1.wasm; DIS=$EMSDK/upstream/bin/wasm-dis
$DIS $W | grep -oE '\(import "(env|GOT\.mem|GOT\.func)" "[^"]+"' | sed 's/.*" "//;s/"//' | sort -u > /tmp/imp
$DIS $W | grep -oE '\(export "[^"]+"' | sed 's/(export "//;s/"//' | sort -u > /tmp/exp
$DIS build/dist/solver_minimal_1.wasm | grep -oE '\(export "[^"]+"' | sed 's/(export "//;s/"//' | sort -u > /tmp/sol
comm -23 /tmp/imp /tmp/exp | comm -23 - /tmp/sol
```

Only `__memory_base` and `__table_base` may remain. For anything else, the fix
table in `AGENTS.md` § 4: local stubs (`*_stubs.c`), `--whole-archive`, a
`__cxa_throw` that calls `abort()`.

## 5. Test signal, then verification against a second implementation

`test_signals/<FORMAT>/`: an official upstream test file when one exists,
otherwise a local encode — **ffmpeg as a generator, never inside the player**.
The `testsrc` pattern at 320x180, 25 fps for video, `wav/geminiani48.wav` for
audio, 10 s at most. Record the command in `A_PUBLIER.md`.

A local demo to learn whether the module loads and decodes:

```bash
mkdir -p /tmp/demo && cd /tmp/demo
cp build/dist/{solver_1.js,solver_1.wasm,universal-video_1.js} build/<name>_1.wasm build/{isobmff_1,libx264_1}.wasm .
cp test_signals/<FORMAT>/<signal> .
python3 -m http.server 8092 &
```

A page that creates the tag with the `test` attribute set, waits on
`decodingPromise`, and `POST`s the resulting blob to a small capture server;
the skeleton is in `AGENTS.md` § 7. Video goes through
`with="…;isobmff_1;libx264_1"` on `solver_1` — `UVideo.ts` hardcodes
`out.mp4` and `c=avc`.

**Then measure**, never "it looks right":

- lossless → the difference must be **zero**, `cmp` or `np.array_equal`;
- lossy, against the *same* library built natively → zero or ±1 LSB (floating
  point);
- against another implementation (ffmpeg) → PSNR/SNR per frame or per sample,
  looking for an **offset** before concluding there is an error; a length
  mismatch almost always is one.

Mind what the comparison compares: `videoWidth` is the *display* width (SAR
applied), not the stream's; a low PSNR may be x264 re-encoding at its default
bitrate rather than the decoder — look at a frame.

Capture the reference **from the chain** (`test_signals/out/<name>/`) once the
chain has been shown correct: the test compares bytes.

## 6. Karma test

`test-player/<name>.js`, on the model of the nearest one: `create_pixel_test`
(image), `create_test(…, "wav", false, false)` (audio, hash),
`create_structural_video_test` (video, presence of tracks). The comment at the
top of the test says where the reference comes from and what was measured:
that is where the information is useful six months later.

Locally, `TS` is overridden to a CORS server on `test_signals` (`AGENTS.md`
§ 8). The whole suite must stay green: a regression elsewhere is to be
reported, not masked.

## 7. Publish — only if the task asks for it

Push nothing unless asked. When asked:

```bash
cd filters/<name> && git init -b main && git add -A
# the trap: an include/ copied from ffmpeg carries libavutil/.gitignore, which hides avconfig.h
comm -23 <(find . -type f -not -path './.git/*' | sed 's|^\./||' | sort) <(git ls-files | sort)   # must be empty
git commit && gh repo create Bevara/<name> --public && git push -u origin main
cd .. && git submodule add -f https://github.com/Bevara/<name>.git <name>
```

A README in the neighbours' format (`libilbc/README.md`), with a section on
what was measured and, if there is a caveat, **at the top** (`ffmpeg-vc2`).
The CI workflow `.github/workflows/build-accessors.yml` needs the `workflow`
scope on the token: if the push is refused, push without it and say so.

The only check that does not lie: **build from a fresh clone**. `.gitmodules`
and the gitlinks must agree in count.

A `Showcase/<format>/` demo that is self-contained (signal, `.wasm`, solver),
linked from the right section of `index.html`, verified in the browser before
being linked; a canvas needs an **absolute** `data-url`.

## 8. Report

End with a report that gives, without adjectives:

- the case chosen (A/B/C) and why;
- the size of the `.wasm`;
- the verification measurement (frames, samples, PSNR/SNR, ±n) and against
  what;
- what is published, what is not, what remains for the human (signals to put
  online, the `workflow` scope, a licence decision);
- what the task assumed that turned out to be false, if anything — often the
  most useful part;
- the updates made to `AGENTS.md`, `CODECS_STATUS.md` or `FORMATS_STATUS.md`,
  or the new pitfall that deserves to go in.
