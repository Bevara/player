# Ajouter le support d'un nouveau format

Procédure suivie pour intégrer un décodeur, de la bibliothèque tierce jusqu'à la
démo publiée. Elle a servi à ajouter 17 formats (9 image, 6 audio, 2 animés) ; les
pièges listés ont tous été rencontrés au moins une fois.

Quatre dépôts sont concernés :

| Dépôt | Rôle |
|---|---|
| `player/filters/third_parties` | bibliothèques tierces (submodules ou tarballs) + `build_thirdparties.sh` |
| `player/filters/<nom>` | le filtre GPAC lui-même, un répertoire par filtre |
| `player/test-player` | les tests karma |
| `test_signals` | signaux de test **et** fichiers de référence décodés, publiés sur `bevara.ddns.net/test-signals/` |
| `Showcase` | une page de démo par format, groupées par section (Images, Documents, Audio, Video, Canvas) |

---

## 1. Choisir et ajouter la bibliothèque

Un décodeur autonome, jamais un wrapper ffmpeg (le dépôt ne construit que des
sous-ensembles ffmpeg ciblés, pour des formats précis).

```bash
cd player/filters/third_parties
git submodule add <url> <nom>
```

**Si l'amont n'a pas de dépôt git utilisable** — SVN seul, tarball seul, ou un
dépôt git dont il manque des sources générées — passer par `wget` dans
`build_thirdparties.sh`, comme `libjpeg`, `liba52`, `xvid`, `libmad`, `lame`,
`libmng`, `libpgf`, `libnsgif`, `recoil`, `musepack` et `libtta`.

Vérifier une URL avant de s'en servir :

```bash
git ls-remote --exit-code <url> HEAD     # dépôt
curl -s -o /dev/null -w '%{http_code}' <url>   # tarball
```

Cas déjà rencontré : le dépôt git de RECOIL ne contient que les sources Ć et
l'appel au transpileur ; seul le tarball livre le `recoil.c` généré.

## 2. Bloc de compilation dans `build_thirdparties.sh`

À la fin du script, sur le modèle des blocs existants. Toujours `-fPIC` : les
filtres sont des side modules wasm.

```bash
echo "Building <nom>"
mkdir -p $build_path/<nom>
cd $build_path/<nom>
emcmake cmake $source_path/<nom> -DCMAKE_C_FLAGS="-fPIC" -DBUILD_SHARED_LIBS=OFF $CMAKE_BUILD_TYPE
emmake make "${MAKEFLAGS}"
```

### Pièges emscripten, tous vus en pratique

| Symptôme | Cause | Correctif |
|---|---|---|
| `relocation R_WASM_MEMORY_ADDR_SLEB ... recompile with -fPIC` au lien du filtre | le makefile généré écrase les `CFLAGS` donnés à configure | répéter `CFLAGS="-fPIC -O2"` **sur la ligne `make`** (opencore-amr, libtta) |
| archive de 96 octets, filtre qui ne fait rien | le makefile appelle `ar`/`ranlib` en dur au lieu de `$(AR)` | `AR=emar RANLIB=emranlib` sur la ligne make, ou le shim `$build_path/emar-shim` (jbigkit, jxrlib) |
| `duplicate symbol` / `common symbols are not yet implemented for Wasm` | tables déclarées sans `extern` dans un en-tête | patch `extern` (`musepack.patch`), **pas** `-fcommon` : wasm ne connaît pas les symboles communs |
| `"SSE2 instruction set not enabled"` | la bibliothèque ne connaît que x86/ARM | `--host=i686-pc-linux-gnu` + `-msimd128 -msse2 -msse4.1` (émulation SSE d'emscripten, exige WebAssembly SIMD au runtime) |
| valeurs d'en-tête aux octets inversés, flux qui décode quand même mais de travers | la bibliothèque détecte l'endianness par liste de plateformes et ne connaît pas wasm32 | forcer la macro à la compilation. `EndianPortable.c` d'ALAC ne pose `TARGET_RT_LITTLE_ENDIAN` que pour `__i386__`, `__x86_64__` et Win32 : sans `-DTARGET_RT_LITTLE_ENDIAN=1`, tous ses `Swap*BtoN` deviennent des no-op et un fichier 44 100 Hz s'annonce à 1 152 122 880 Hz |
| `ISO C++17 does not allow 'register'` | sources C compilées en C++ | `--enable-compile-c` ou `-std=c++14` |
| `wasm-ld: unknown argument: -single_module` pendant configure | sondes libtool spécifiques à macOS | **bruit sans conséquence**, chercher l'erreur réelle plus bas dans le log |
| `config.status: cannot find input file: 'Makefile.in'` | autotools cassé chez l'amont | compiler les sources directement avec `emcc`/`em++` (libpgf, libnsgif, musepack, recoil) |
| une cible du projet exige une dépendance absente | outil annexe, pas la bibliothèque | ne construire que la cible utile (`libtta.a`, `lib`, `-C src/libiff`) |

Quand une adaptation locale est nécessaire, la mettre dans un fichier `.patch`
appliqué par le script (idiome `poppler.patch`, `vvdec.patch`, `musepack.patch`),
jamais une réécriture en place : le script doit rester ré-exécutable.

## 3. Recopier la bibliothèque : `update_libs.sh`

```bash
echo "Updating lib for filter <nom>"
copy_lib $build_path/third_parties/<dir-de-build> <lib>.a $source_path/<nom>/lib/
```

`copy_lib` cherche récursivement et avertit sans échouer si la lib manque.

## 4. Écrire le filtre

Un répertoire `player/filters/<nom>/` contenant :

```
CMakeLists.txt   <nom>.json   dec_<x>.c   README.md
filters.cmake    filter_register.h        include/gpac/…   include/<lib>/…   lib/<lib>.a
```

Le plus simple est de copier `qoi/` (image, en-tête unique) ou `libwavpack/`
(audio, bibliothèque statique) et d'adapter. `filters.cmake`, `filter_register.h`
et `include/gpac` se recopient tels quels.

### Forme du filtre

Les décodeurs ajoutés prennent **le fichier entier** en entrée et produisent une
seule sortie brute :

```c
CAP_UINT(GF_CAPS_INPUT, GF_PROP_PID_STREAM_TYPE, GF_STREAM_FILE),
CAP_STRING(GF_CAPS_INPUT, GF_PROP_PID_FILE_EXT, "ext1|ext2"),
CAP_STRING(GF_CAPS_INPUT, GF_PROP_PID_MIME, "…"),
CAP_UINT(GF_CAPS_OUTPUT, GF_PROP_PID_STREAM_TYPE, GF_STREAM_VISUAL /* ou AUDIO */),
CAP_UINT(GF_CAPS_OUTPUT, GF_PROP_PID_CODECID, GF_CODECID_RAW),
```

C'est plus direct que le couple reframer + décodeur de `libaif`/`libflac`, qui
n'est utile que si GPAC connaît déjà un `GF_CODECID_` pour le format.

**Toutes les propriétés de sortie doivent être posées dans `configure_pid`**, pas
seulement dans `process` : GPAC résout le graphe à partir d'elles avant que la
moindre donnée circule. Une valeur plausible suffit, `process` la corrige.

- image : `STREAM_TYPE`, `CODECID=RAW`, `PIXFMT`, puis `WIDTH`/`HEIGHT`/`STRIDE`
- audio : `STREAM_TYPE`, `CODECID=RAW`, `AUDIO_FORMAT=S16`, `SAMPLE_RATE`,
  `TIMESCALE`, `NUM_CHANNELS`, `CHANNEL_LAYOUT`

### Cas de la vidéo

Un décodeur qui sort plusieurs images (animation, séquence) émet **un paquet par
image** sur le même pid, avec `gf_filter_pck_set_cts()` et
`gf_filter_pck_set_duration()` exprimés dans le `GF_PROP_PID_TIMESCALE` posé au
`configure_pid` — 100 pour le GIF (délais en 1/100 s), 1000 pour le MNG (ms).
Poser aussi `GF_PROP_PID_NB_FRAMES` quand le nombre d'images est connu.

Deux conséquences pratiques :

- **Le chemin vidéo se termine toujours par un encodeur.** `UVideo.ts` fixe en
  dur la destination `out.mp4` et le transcodage `["c=avc"]` : tout test vidéo
  doit donc inclure `libx264_1` dans le graphe, quel que soit le décodeur
  testé. C'est documenté depuis `libde265.js` et `libmpeg2.js`.
- **Les tests vidéo sont fonctionnels**, sans référence : ce qui est vérifié,
  c'est que les images traversent le graphe jusqu'à l'encodeur. Passer `null`
  en référence à `create_test` (voir `libgif.js`, `libmng.js`).

Un même filtre peut servir les deux chemins : `libgif` sort une image pour un
GIF fixe et la séquence complète pour un GIF animé, et son test image
(comparaison pixel sur la première image) coexiste avec son test vidéo.

Pour une animation dont chaque image est partielle (GIF, MNG), c'est au filtre
de tenir le canevas et d'appliquer la méthode de disposition — sinon seules les
zones modifiées sortent.

Quand la bibliothèque pilote le décodage par callbacks plutôt que de rendre les
images (libmng), l'animation se déroule sur une **horloge virtuelle** : répondre
au `settimer` en mémorisant le délai, avancer soi-même le compteur de
millisecondes et reprendre (`mng_display_resume`) au lieu d'attendre. Prévoir un
garde-fou : un fichier qui boucle indéfiniment ne s'arrête jamais tout seul.

### Huit limites de ce build, à respecter

1. **Sortir du RGB, jamais du RGBA ni du GREYSCALE.** Un pid RGBA ou gris n'a pas
   de chemin d'adaptation vers `writegen` (« No suitable filter to adapt caps »).
   L'alpha se laisse tomber, le gris se réplique sur 3 canaux. Voir la note dans
   `test-player/libpng.js`.
2. **`setjmp`/`longjmp` n'est utilisable que dans les limites du solveur.**
   Une bibliothèque qui s'en sert (libpng, libjpeg, et surtout MuPDF avec son
   `fz_try`) fait importer par le module soit des trampolines `invoke_*` en
   SjLj JavaScript, soit le tag d'exception `__c_longjmp` en SjLj WebAssembly
   (`-sSUPPORT_LONGJMP=wasm`). Le solveur pré-construit n'exporte qu'un
   sous-ensemble des signatures `invoke_*` — celles dont libpng et libjpeg ont
   besoin — et aucun tag. Au-delà, le navigateur refuse d'instancier le module
   (`LinkError: tag import requires a WebAssembly.Tag`). Vérifier tôt :

   ```bash
   wasm-dis <nom>_1.wasm | grep -c 'import "env" "invoke_'
   ```

   Attention, les `invoke_*` ne sont **pas** des exports du `.wasm` du solveur :
   ce sont des fonctions de son glue JS. Les chercher avec `wasm-dis` sur le
   solveur ne donne rien et fait croire à tort qu'il en manque. La bonne
   commande est :

   ```bash
   grep -ao 'function invoke_[a-z]*' build/dist/solver_minimal_1.js | sort -u
   ```

   Et contre l'intuition, c'est `solver_minimal_1` qui en a le jeu le plus
   riche — une vingtaine de signatures — quand `solver_1` n'en définit que
   trois. `libtta` s'appuie sur quatre d'entre elles et fonctionne donc avec le
   solveur minimal, pas avec le complet.

   Le contourner demande de reconstruire le solveur, pas le filtre.
3. **Viser `solver_minimal_1`.** Mélanger les solveurs dans une même page ne
   marche pas : le loader réutilise le premier chargé, et un filtre qui exige
   `solver_1` échoue silencieusement quand il n'est pas premier. Si des symboles
   manquent, les définir dans le filtre plutôt que de changer de solveur (voir
   `libape/dec_ape.cpp` pour `wcslen`, `setlocale`, `mbstowcs`, `wcscasecmp`).
4. **Pas de threads.** Un module côté side n'a pas de pool ; `pthread_create`
   ne démarre rien. Passer `threads = 1` à la bibliothèque ne suffit pas si son
   travail ne se fait *que* depuis un worker : le travail est mis en file et la
   file n'est jamais vidée. `davs2` est le cas type — `davs2_threadpool_run`
   empile et rend la main, puis `task_get_free_task` tourne indéfiniment sur la
   deuxième image. Le symptôme est muet : aucun message, aucun plantage, la
   chaîne s'arrête. Chercher `threadpool`, `_run`, `_wait` et
   `pthread_cond_wait` dans la bibliothèque **avant** de déboguer le filtre, et
   patcher le pool pour exécuter le travail sur place (voir `davs2.patch`).
   Ut Video tend exactement le même piège avec `CThreadManager` — deux fois sur
   trois bibliothèques à pool, donc le réflexe vaut d'être pris. À l'inverse
   `xevd` dégrade proprement : il ne lance des workers que sous
   `if (ctx->tc.max_task_cnt > 1)`. Ce qui distingue les deux cas se lit à
   l'endroit où le travail est soumis, pas dans la documentation.
5. **Un pointeur de fonction converti vers une autre arité plante.**
   WebAssembly vérifie la signature à *chaque* appel indirect ; un appel natif,
   lui, ignore l'argument excédentaire. Une conversion que le C tolère devient
   donc un `RuntimeError: function signature mismatch` à l'exécution — le
   module se charge, le graphe se construit, et ça casse au premier appel.
   schroedinger en donne cinq exemples d'un coup :

   ```c
   domain->free = (void *) free;                 /* declare void(void*,int) */
   schro_queue_new (4, (SchroQueueFreeFunc) schro_frame_unref);  /* 1 -> 2 params */
   ```

   Le symptôme ne ressemble à rien de connu et ne nomme pas le coupable ;
   attraper la pile (`window.addEventListener('error', …)` puis
   `e.error.stack`) donne l'index de fonction wasm, ce qui suffit à localiser
   le module. Le correctif est un adaptateur à l'arité déclarée, pas un cast
   plus large. Chercher `= (void *)` et les `(XxxFunc)` devant un nom de
   fonction dans la bibliothèque.

6. **Annoncer la géométrie de sortie dans `configure_pid`, pas dans `process`.**
   Le graphe est résolu au moment du `configure_pid`. Un décodeur qui crée son
   pid de sortie sans largeur, hauteur ni format de pixel présente au résolveur
   une vidéo brute de format inconnu : Dijkstra ne trouve aucune route vers
   l'encodeur, `mp4mx` accepte le pid tel quel et l'écrit en vidéo non
   compressée. Le symptôme est un MP4 valide, de la bonne durée, en `uncv`,
   avec dans le journal :

   ```
   [Filters] Dijkstra: no results found!
   Filters not connected: encx264 (c=avc)
   ```

   D'où la préférence pour les filtres maillons : ce qui produit le pid
   d'entrée — un reframer, un démultiplexeur — a déjà lu les en-têtes, et la
   taille se recopie depuis les propriétés du pid. Un filtre fichier entier
   (`GF_STREAM_FILE` + `GF_PROP_PID_FILE_EXT`) n'a pas cette information avant
   d'avoir lu les données, donc après la résolution. C'est ce qui bloque encore
   Motion JPEG 2000 en MOV, et c'est ce qui a fait réécrire `h264bsd` en
   maillon sur un pid AVC.

7. **Un `min_max_enum` avec des `|` transforme un `GF_PROP_UINT` en énumération.**
   La valeur par défaut est alors résolue comme un *index* dans la liste, pas
   comme un nombre :

   ```c
   {OFFS(srate), "...", GF_PROP_UINT, "16000", "16000|32000", 0},  /* srate == 0 */
   ```

   Le filtre reçoit 0 et refuse de se connecter, avec un message qui accuse
   l'appelant plutôt que la déclaration. Laisser `NULL` et valider dans
   `configure_pid` (voir `libisac/dec_isac.c`).

8. **La page ne sait pas passer d'argument de filtre.** `with=` ne porte que
   des noms de modules, `using=` le solveur ; rien dans `UAudio.ts`,
   `UVideo.ts` ni `loader.js` ne transmet un `filtre:opt=valeur` à la session
   GPAC. Un filtre qui a besoin d'une information absente du fichier — le
   débit d'un G.726 nu, la fréquence de sortie d'un `.silk`, celle d'un iSAC —
   ne peut donc être exercé que sur sa valeur par défaut. La choisir est une
   décision de conception, pas un détail : prendre ce qu'écrit l'outil le plus
   répandu du format.

### Quand les en-têtes de la bibliothèque et ceux de GPAC se disputent

Plusieurs bibliothèques définissent des noms que GPAC définit aussi, de façon
incompatible : jxrlib fait `typedef int Bool;` là où `gpac/setup.h` déclare un
`enum Bool`, et xcftools amène son propre `config.h`. Les inclure dans la même
unité de compilation ne se répare pas à coups de `#define`.

La réponse est de scinder le filtre en deux fichiers : l'un ne voit que la
bibliothèque et expose une petite API C sans aucun type d'emprunt (`unsigned
char *`, `size_t`, des codes de retour entiers), l'autre ne voit que GPAC.
`libjxr`, `libpgf`, `libpsd` et `libxcf` suivent tous ce découpage — voir
`libjxr/jxr_decode.h`. Bénéfice secondaire : le fichier de décodage se compile
aussi en natif, ce qui permet de le confronter à un décodeur de référence avant
même de produire un `.wasm` (`filters/simpleimg/simpleimg.c` a été validé
comme ça).

### Filtre en C++

Trois adaptations, toutes documentées dans `poppler/dec_pdf.cpp` et
`libape/dec_ape.cpp` :

```cpp
#include <emscripten/emscripten.h>   // AVANT gpac/filters.h, sinon les templates
#include <gpac/filters.h>            // d'em_asm.h se retrouvent dans un extern "C"
```

- `PROP_UINT()` et consorts reposent sur les littéraux composés C99 : écrire de
  petits helpers qui donnent un vrai stockage au `GF_PropertyValue`.
- `apedec_register` / `register_apedec` doivent être dans un bloc `extern "C"`.

### Symboles qui font échouer le chargement du module

Un side module dont un import n'est pas résolu **ne s'instancie pas** : le filtre
ne s'enregistre jamais, et la session finit sur « Filter not found for the desired
type » sans autre indice. Vérifier systématiquement après le premier build :

```bash
EMSDK=filters/third_parties/emsdk
$EMSDK/upstream/bin/wasm-dis build/<nom>_1.wasm | grep '(import "env"' \
  | sed 's/.*"env" "\([^"]*\)".*/\1/' | grep -vE '^gf_|memory|__indirect|__stack_pointer|__memory_base|__table_base'
```

Puis comparer aux exports du solveur :

```bash
$EMSDK/upstream/bin/wasm-dis build/dist/solver_minimal_1.wasm \
  | grep -oE '\(export "[^"]+"' | sed 's/(export "//;s/"//' | sort -u > /tmp/exports.txt
```

Un symbole que le module exporte **et** importe (`GOT.mem`/`GOT.func`) est normal
en PIC : c'est le loader qui le résout. Seuls comptent ceux qui ne sont ni
exportés par le module ni par le solveur.

### Le symptôme le plus trompeur : `reportUndefinedSymbols`

```
TypeError: Cannot read properties of undefined (reading 'value')
    at reportUndefinedSymbols (solver_minimal_1.js)
    at loadDylibs (solver_minimal_1.js)
```

C'est le code d'emscripten qui **plante en essayant de signaler** un symbole non
résolu : il ne nomme donc rien. Vu depuis la page, le tag échoue sans un mot de
GPAC — pas de « Filter not found », pas de log de worker.

Deux leçons. D'abord, ce message veut dire « il manque un symbole », rien
d'autre. Ensuite, la vérification du § précédent est **incomplète si elle ne
regarde que les imports `env`** : il faut y ajouter `GOT.mem` et `GOT.func`.

```bash
wasm-dis build/dist/<nom>_1.wasm \
  | grep -oE '\(import "(env|GOT\.mem|GOT\.func)" "[^"]+"' \
  | sed 's/.*" "//;s/"//' | sort -u
```

C'est ainsi qu'on découvre qu'`isobmff` importe une cinquantaine de symboles
GPAC absents de `solver_minimal_1` (`gf_m2ts_mux_*`, `gf_isom_*text*`,
`gf_sei_*`, `gf_sha1_*`, `oggpack_read`…) et **exige `solver_1`**. Les tests
vidéo qui s'en servent le font déjà ; tout filtre chaîné derrière lui doit
suivre, `libalac` compris.

Troisième leçon, apprise sur `libutvideo` : **un import n'est pas forcément un
symbole manquant.** Les symboles faibles — et les instanciations de patrons C++
en sont — sont émis par un side module à la fois comme import *et* comme
export, pour que le module principal puisse les remplacer ; le loader les
résout depuis le module lui-même. Sur `libutvideo`, 43 des 94 imports `env`
étaient dans ce cas. Il faut donc soustraire les exports du module avant de
conclure :

```bash
W=build/dist/<nom>_1.wasm
wasm-dis $W | grep -oE '\(import "(env|GOT\.mem|GOT\.func)" "[^"]+"' \
  | sed 's/.*" "//;s/"//' | sort -u > /tmp/imp.txt
wasm-dis $W | grep -oE '^\s*\(export "[^"]+"' | sed 's/.*"\(.*\)"/\1/' | sort -u > /tmp/exp.txt
wasm-dis build/dist/solver_1.wasm | grep -oE '^\s*\(export "[^"]+"' \
  | sed 's/.*"\(.*\)"/\1/' | sort -u > /tmp/sol.txt
comm -23 /tmp/imp.txt /tmp/exp.txt | comm -23 - /tmp/sol.txt
```

Et comparer aux **exports du `.wasm` du solveur**, pas au texte de son `.js` :
le glue en mentionne beaucoup moins, ce qui fait croire à des absences qui n'en
sont pas (`operator new`, `__cxa_allocate_exception`… y sont bien).

| Import manquant | Correctif |
|---|---|
| `__cxa_throw` | aucun solveur ne l'exporte : définir un stub local qui `abort()`, et le documenter (une exception tue le module au lieu de remonter une erreur) — `libcharls`, `libape` |
| une fonction libc absente de `solver_minimal_1` | la définir dans le filtre (`libape`) |
| `png_get_io_ptr` & co. | dépendance optionnelle réellement utilisée : lier la lib (`libicns` + `libpng16.a` + `-s USE_ZLIB=1 -lz`) |
| des symboles de données de la bibliothèque (`gme_nsf_type`…) | le lien n'extrait pas les membres d'archive pour des données ; les nommer explicitement dans le filtre, `--whole-archive` ne suffit pas |
| un destructeur faible (`_ZN13APE_FILE_INFOD2Ev`) | instancier le type dans le filtre pour l'émettre localement |
| `div`, `feof`, `puts`, `rand`, `tmpnam`, `wcslen`, `strerror`, `iconv*`, `zError` | même cas : les définir dans le filtre. Beaucoup viennent de chemins qu'on n'emprunte pas (l'encodeur de jxrlib, la couche fichier de xcftools) mais que l'éditeur de liens conserve — voir `libjxr/jxr_stubs.c` et `libxcf/xcf_stubs.c` |
| `_ZnamRKSt9nothrow_t` (`operator new[](nothrow)`) | le redéfinir dans le filtre : c'est une fonction d'allocation globale remplaçable (`libpgf/pgf_stubs.cpp`) |

## 5. Déclarer le filtre

Ajouter le nom dans la liste `set(filters …)` de `player/filters/CMakeLists.txt`,
puis :

```bash
cd player/build
emcmake cmake ..            # ⚠ TOUJOURS depuis build/, jamais depuis filters/
emmake make <nom>_1
cp <nom>_1.wasm dist/
```

> Lancer `emcmake cmake ..` depuis `filters/` configure le projet racine dans ce
> répertoire : cela **écrase `filters/filter_list.json`** et sème des
> `CMakeCache.txt`, `CMakeFiles/`, `solver/`, `favicon.ico`… Si ça arrive :
> `git checkout -- filter_list.json` et supprimer les intrus.

## 6. Signal de test

Dans `test_signals/<FORMAT>/`. Par ordre de préférence :

1. un fichier de test officiel de l'amont (CharLS, jbig2dec, bcdec, libicns,
   libxmp, game-music-emu en fournissent) — noter la provenance ;
2. un encodage produit localement (ffmpeg, `cwebp`, `mac`, `mpcenc`, `flif`,
   `pbmtojbg`, `JxrEncApp`… — ffmpeg **comme générateur**, jamais dans le player) ;
3. en dernier recours un fichier synthétisé, avec un générateur versionné :
   voir `test_signals/tools/gen_image_samples.py`.

Garder les signaux courts (~10 s pour l'audio) : la référence décodée est du PCM
non compressé, elle pèse vite plusieurs Mo.

## 7. Vérifier, dans cet ordre

**a. Une démo locale d'abord**, c'est le moyen le plus rapide de savoir si le
module se charge :

```bash
mkdir Showcase/<format> && cd Showcase/<format>
cp player/build/dist/<nom>_1.wasm player/build/dist/solver_minimal_1.{js,wasm} .
cp test_signals/<FORMAT>/<fichier> .
# index.html : copier Showcase/qoi (image) ou Showcase/flac (audio) et adapter
python3 -m http.server 8099 --directory Showcase
```

Puis dans le navigateur, sur la page :

```js
const el = document.querySelector('img');    // ou 'audio'
({w: el.naturalWidth, h: el.naturalHeight})  // image
({dur: el.duration, ready: el.readyState, err: el.error && el.error.code})  // audio
```

`err: 4` ou une promesse qui n'aboutit pas = le module ne s'est pas chargé →
retour au § 4, contrôle des imports.

**b. Vérifier le décodage contre une seconde implémentation.** C'est ce qui
distingue « ça produit des octets » de « ça décode ». Pour les formats sans
perte, l'écart doit être **nul** :

| Format | Comparé à | Résultat obtenu |
|---|---|---|
| WavPack, DTS | décodeurs ffmpeg | identique échantillon par échantillon |
| Monkey's Audio | le WAV source encodé | identique octet pour octet |
| ILBM, Degas | `recoil2png` | identique pixel par pixel |
| XCF, PSD | `xcf2png`, Pillow | identique pixel par pixel |
| AMR, Musepack | ffmpeg | écart faible attendu entre implémentations — le mesurer et le noter |
| DDS BC1 | ffmpeg | ±1 (interpolation des extrémités) : référence prise sur bcdec |

Un écart de longueur est presque toujours un **décalage**, pas une erreur :
chercher le meilleur alignement avant de conclure. C'est ce qui a évité de
« corriger » un délai de 481 trames côté Musepack qui venait en fait de ffmpeg.

**c. Capturer la référence depuis le pipeline lui-même.** Le test compare des
octets : la référence doit être exactement ce que produit la chaîne.

```js
const b = await (await fetch(el.src)).blob();
await fetch('http://localhost:8100/<nom>.wav', {method: 'POST', body: b});
```

(petit serveur de capture en POST côté machine ; voir aussi
`test_signals/IMAGE_FORMATS.md` pour les images, où la référence vient d'un
décodeur indépendant et la comparaison est faite pixel à pixel)

Ranger le résultat dans `test_signals/out/<nom>/`.

## 8. Test karma

`player/test-player/<nom>.js`, en reprenant un test existant :

- **image** → `create_pixel_test(...)`, référence PNG, comparaison pixel (le PNG
  n'est pas reproductible octet à octet) ;
- **audio** → `create_test(..., "wav", false, false)`, référence WAV, comparaison
  de hachage SHA-256.

Commenter dans le fichier de test d'où vient la référence et ce qui a été
vérifié : c'est là que l'information est utile six mois plus tard.

Exécution locale avant publication (`TS` pointe sur le serveur distant, donc il
faut le contourner) :

```bash
# servir test_signals AVEC CORS, sinon les fetch échouent et les tests expirent
python3 - <<'PY' &
import http.server, functools
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin','*'); super().end_headers()
http.server.ThreadingHTTPServer(('127.0.0.1',8101),
    functools.partial(H, directory='/Users/jeromegorin/project/test_signals')).serve_forever()
PY
echo "window.TS = 'http://localhost:8101/';" > /tmp/ts_override.js
# config karma : test.js, puis ts_override.js, puis les fichiers de test
node_modules/karma/bin/karma start /tmp/karma.conf.js --single-run --browsers ChromeHeadless
```

## 9. Publier et rejouer

Mettre en ligne sur `bevara.ddns.net/test-signals/` le signal **et** la référence,
puis rejouer la suite sans surcharge de `TS`. Contrôler que le publié correspond
au local :

```bash
curl -s https://bevara.ddns.net/test-signals/<chemin> | shasum -a 256
shasum -a 256 test_signals/<chemin>
```

## 10. Publier le filtre comme dépôt

Chaque filtre est un dépôt à part sous `github.com/Bevara`, rattaché en
submodule. Une fois le filtre vert :

```bash
cd player/filters/<nom>
git init -b main . && git add -A && git commit -m "<nom>: <description>"
gh repo create Bevara/<nom> --public --source=. --remote=origin --push \
  --description "<description> for the Bevara player"
cd .. && git submodule add -f https://github.com/Bevara/<nom>.git <nom>
```

Le dépôt contient les sources, `CMakeLists.txt`, `<nom>.json`, `README.md`,
`filters.cmake`, `filter_register.h`, `include/` (en-têtes gpac compris) **et**
`lib/*.a` — c'est ce que suivent les filtres existants. Le README reprend le
modèle de `qoi/README.md` : titre `# <nom>`, puis la ligne `help` du JSON, puis
le corps commun.

Ne publier qu'un filtre vérifié : un dépôt public avec un filtre qui ne se
charge pas ou fige la page est pire que pas de dépôt.

**Le `.gitignore` que traîne l'arbre d'en-têtes recopié.** `git add -A` respecte
les `.gitignore` présents *dans* ce qu'on ajoute. Un `include/` recopié depuis
ffmpeg embarque `include/libavutil/.gitignore`, qui exclut `avconfig.h` et
`ffversion.h` — des en-têtes générés par `configure` que toute la bibliothèque
inclut. Le fichier reste dans l'arbre de travail local, donc la compilation
passe sur la machine et échoue au premier `#include` sur toute machine qui
part d'un clone :

```
include/libavutil/macros.h:28:10: fatal error: 'libavutil/avconfig.h' file not found
```

Le contrôle qui l'attrape, avant de pousser :

```bash
cd <nom> && comm -23 <(find . -type f -not -path './.git/*' | sed 's|^\./||' | sort) \
                     <(git ls-files | sort)
```

Tout ce qui sort de là et n'est pas volontairement absent se force au
`git add -f`. Et le seul contrôle qui ne ment pas est de construire depuis un
clone neuf, pas depuis l'arbre de travail.

## 11. Démo Showcase

Finaliser le répertoire créé au § 7a et l'ajouter à la grille du bon groupe dans
`Showcase/index.html`. Chaque démo est autonome (son signal, son `.wasm`, son
solveur) — c'est la convention du dépôt, au prix de la duplication du solveur.

---

## Checklist

- [ ] bibliothèque en submodule (ou tarball si l'amont n'a pas de git utilisable)
- [ ] bloc dans `build_thirdparties.sh`, adaptations locales en `.patch`
- [ ] entrée dans `update_libs.sh`
- [ ] filtre : `dec_*.c`, `CMakeLists.txt`, `<nom>.json`, `README.md`, `include/`, `lib/`
- [ ] nom ajouté à `filters/CMakeLists.txt`, build lancé **depuis `build/`**
- [ ] imports du `.wasm` tous résolus (solveur ou module lui-même)
- [ ] signal de test dans `test_signals/<FORMAT>/`, provenance notée
- [ ] démo locale : le module se charge et décode
- [ ] décodage confronté à une seconde implémentation, écart mesuré
- [ ] référence dans `test_signals/out/<nom>/`, capturée depuis le pipeline
- [ ] test dans `test-player/<nom>.js`, vert en local (vidéo : `libx264_1` dans le graphe, référence `null`)
- [ ] signal + référence publiés, suite rejouée contre le serveur
- [ ] dépôt `Bevara/<nom>` créé, poussé, rattaché en submodule
- [ ] démo Showcase créée et liée depuis la bonne section d'`index.html`
- [ ] rien de committé sans demande explicite

## Ce qui n'a pas été réglé

- `libgme` (NSF, SPC, VGM) : le module est lié mais ne s'enregistre jamais dans le
  navigateur. Piste restante : un constructeur statique C++ de game-music-emu qui
  échoue avant la chaîne d'enregistrement.
- `svt-jpeg-xs`, `nitro`, `vtflib` : non portables en l'état (SIMD x86, hypothèse
  64 bits, dépendance absente).
- WMA et RealAudio : hors ffmpeg, seuls les codecs de Rockbox existent, et ils
  s'appuient sur l'API codec de Rockbox — c'est un portage, pas un simple lien.
- DjVu : le filtre `libdjvu` existe et se lie, mais **fige la page**. DjVuLibre
  décode dans un thread de fond (`GThreads.h` : « Libdjvu requires thread
  support », aucun mode sans thread), or les side modules sont mono-thread ici :
  `ddjvu_document_decoding_done()` n'est jamais vrai et la boucle d'attente ne
  rend jamais la main. Il faudrait soit passer le player à `-pthread` (avec les
  en-têtes COOP/COEP côté serveur), soit attaquer les classes C++ de bas niveau
  en contournant `ddjvuapi`. Non publié, pas de démo.
- Documents : hors PDF (déjà couvert par poppler), la liste Wikipédia ne
  contient que des formats sans décodeur raster autonome — DOC/DOCX/ODT/RTF/WPD
  demandent une suite bureautique, EPUB/MOBI/FB2 sont du HTML empaqueté,
  PostScript demanderait Ghostscript. Les deux seules pistes crédibles ont été
  tentées et butent toutes deux sur le runtime du solveur, pas sur le format :
  `libdjvu` (threads) et `libmupdf` (setjmp/longjmp, voir la limite 2 plus
  haut). Les signaux de test `XPS/testcard.xps` et `CBZ/testcard.cbz` sont
  générés et prêts pour le jour où l'un des deux se débloque.
- Vidéo : la liste Wikipédia est surtout faite de conteneurs (AVI, MKV, MOV,
  MP4, ASF, OGG, WebM…), déjà couverts par `avidmx`, `isobmff`, `webmdmx` et
  `oggdmx`. Les codecs qui restent — Bink, Smacker, RealVideo, WMV/VC-1, NSV,
  Indeo, Cinepak — n'ont aucune implémentation libre en dehors de ffmpeg. Les
  seuls formats vidéo de la liste réellement adressables en autonome étaient
  GIF animé et MNG, tous deux faits. Pour aller plus loin il faudrait sortir de
  cette page : AVS2 (davs2), AVS3 (uavs3d) et MPEG-5 EVC (xevd) ont des
  décodeurs autonomes propres.
