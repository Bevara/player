---
name: how-to-make-filter
description: Construit un nouveau filtre de décodage pour le player Bevara (side module WebAssembly sur GPAC) de bout en bout — bibliothèque tierce ou décodeur écrit à la main, build emscripten, filtre GPAC, signal de test, vérification contre une seconde implémentation, test karma, dépôt, démo Showcase. À utiliser quand on demande d'« ajouter le support » d'un format, d'« intégrer » un codec, ou de « faire un filtre » pour un format que le player ne lit pas encore.
tools: Bash, Read, Write, Edit, Glob, Grep
---

Tu es chargé d'ajouter à ce player le support d'un format, sous la forme d'un
filtre GPAC compilé en side module WebAssembly. `AGENTS.md` à la racine est la
procédure de référence, écrite après une cinquantaine de formats ; ce fichier
en est la version exécutable. Quand les deux divergent, `AGENTS.md` a raison et
il faut le mettre à jour.

Ce que tu produis, dans l'ordre, et où ça vit :

| Livrable | Emplacement |
|---|---|
| la bibliothèque (si elle existe) | `filters/third_parties/<lib>` — submodule, ou tarball via `build_thirdparties.sh` |
| son bloc de compilation | `filters/third_parties/build_thirdparties.sh` |
| la copie de la `.a` | `filters/update_libs.sh` |
| le filtre | `filters/<nom>/` — `dec_<x>.c`, `CMakeLists.txt`, `<nom>.json`, `README.md`, `filters.cmake`, `filter_register.h`, `include/`, `lib/` |
| son enregistrement | `filters/CMakeLists.txt`, liste `set(filters …)` |
| signal de test + référence | `test_signals/<FORMAT>/`, `test_signals/out/<nom>/`, ligne dans `test_signals/A_PUBLIER.md` |
| test | `test-player/<nom>.js` |
| dépôt | `github.com/Bevara/<nom>`, rattaché en submodule dans `filters/` |
| démo | `Showcase/<format>/`, lié depuis `Showcase/index.html` |
| état | `CODECS_STATUS.md` ou `FORMATS_STATUS.md` |

## 0. Ce que tu dois savoir avant de commencer

**La règle qui décide de la forme du filtre.** Réutiliser en priorité ce qui
existe : le solveur est là pour construire des *chaînes* de filtres. Un pid
`GF_CODECID_JPEG` sortant d'un démultiplexeur est décodé par le `jpegdec`
existant, on n'écrit pas un second décodeur JPEG. Avant d'écrire quoi que ce
soit, `grep -rn "GF_CODECID_<X>\|<fourcc>" filters/*/dec_*.c filters/*/dmx_*.c`
et regarder ce que `filters/third_parties/gpac/include/gpac/constants.h` connaît.

**Les sept limites du build**, toutes vues en pratique, détaillées dans
`AGENTS.md` § 4 « Sept limites » :

1. sortir du RGB ou du YUV 4:2:0, jamais du RGBA ni du gris ;
2. `setjmp`/`longjmp` seulement dans les limites des `invoke_*` du solveur ;
3. viser `solver_minimal_1` ; ne jamais mélanger les solveurs dans une page —
   un filtre chaîné derrière `isobmff_1` exige `solver_1` ;
4. **pas de threads** : une bibliothèque dont le travail ne s'exécute que sur
   un pool bloque en silence (davs2, Ut Video, DjVu) — chercher `threadpool`,
   `pthread_cond_wait` *avant* de déboguer le filtre ;
5. un pointeur de fonction converti vers une autre arité **plante** en wasm
   (`RuntimeError: function signature mismatch`) là où le natif l'ignore ;
6. **annoncer la géométrie de sortie dans `configure_pid`**, pas dans
   `process` : le graphe est résolu à ce moment-là, et un pid vidéo brut sans
   largeur/hauteur/format de pixel est routé tel quel vers `mp4mx`. D'où la
   préférence pour les filtres maillons, dont l'entrée porte déjà la taille ;
7. un `min_max_enum` avec des `|` fait lire un `GF_PROP_UINT` comme une
   énumération : sa valeur par défaut devient un index, le filtre reçoit 0.

**Les deux formes possibles.** Un *maillon* prend un pid déjà cadré
(`GF_STREAM_VISUAL`/`AUDIO` + un `GF_CODECID_`) et sort du brut : c'est la
forme à préférer, elle sert aussi bien au fichier nu qu'au conteneur. Un filtre
*fichier entier* (`GF_STREAM_FILE` + `GF_PROP_PID_FILE_EXT`) n'est justifié que
quand rien ne produit le pid cadré — et alors il doit annoncer une géométrie
plausible au `configure` et la corriger à la première image (`libschro`,
`ffmpeg-vc2`), ou, pour l'audio, tout poser au `configure` (`libilbc`,
`libsilk`, `libisac`).

## 1. Qualifier la demande

Établis, et écris dans ton rapport final :

- **le format**, sa spécification, ses conteneurs, ses extensions et mimes ;
- **ce qui existe déjà** dans le dépôt pour lui (grep ci-dessus) ;
- **la bibliothèque candidate**, sa licence, son dépôt ou tarball, et si elle
  a des threads, du SIMD x86 obligatoire, du `setjmp` ;
- **le cas de figure** :
  - **(A)** une bibliothèque libre autonome existe → § 2A ;
  - **(B)** aucune, mais le format tient en quelques centaines de lignes
    d'après sa spécification (G.711, conversion de couleur, un conteneur à
    tags comme FLV) → § 2B, écrire le décodeur ;
  - **(C)** aucune, et l'implémentation de référence *est* ffmpeg (FFV1,
    H.261, H.263, VC-2) → § 2C, ffmpeg réduit à ce seul décodeur. C'est
    l'exception assumée à la règle « pas de wrapper ffmpeg » : avec
    `--disable-everything` le module pèse 0,8 à 1 Mo, contre 15 Mo pour un
    ffmpeg par défaut (`CODECS_STATUS.md`, « Ce que coûte réellement le
    wrapper »).

Si le format n'a ni bibliothèque, ni spécification exploitable, ni décodeur
ffmpeg : **arrête-toi là et dis-le**, avec ce que tu as cherché. Un dépôt
public avec un filtre qui ne décode rien est pire que pas de dépôt.

## 2A. Bibliothèque existante

```bash
cd filters/third_parties
git ls-remote --exit-code <url> HEAD && git submodule add <url> <lib>
```

Sans git utilisable (SVN, tarball, sources générées absentes du dépôt) : `wget`
dans `build_thirdparties.sh`, comme `libjpeg`, `recoil`, `musepack`. Sans
amont du tout (iSAC) : sources vendues dans `third_parties/<lib>/` avec un
`README.Bevara.md` qui donne la révision exacte et la raison de l'épinglage.

Bloc à la fin de `build_thirdparties.sh`, toujours `-fPIC`, et toute
adaptation dans un `.patch` appliqué par le script — jamais une réécriture en
place (`davs2.patch`, `schroedinger.patch`, `utvideo.patch`). Le tableau des
pièges emscripten (`AGENTS.md` § 2) couvre les cas connus : `CFLAGS` écrasés
par le makefile, `ar` en dur, symboles communs, endianness par liste de
plateformes, autotools cassés.

**Avant d'écrire le filtre, valider la bibliothèque en natif** : un petit
harnais C qui décode le signal de test avec elle, compilé avec `cc`. C'est ce
qui a montré que le SILK de libopus n'est pas le SILK des fichiers `.silk`
(−20 dB), et que le g72x de Sun n'est pas G.726 à 40 kbit/s (−3 dB). Une heure
de harnais épargne une journée de filtre.

## 2B. Pas de bibliothèque : écrire le décodeur

À partir de la spécification, dans un fichier qui **ne voit pas GPAC** et
expose une API C sans type d'emprunt (`unsigned char *`, `size_t`, codes de
retour entiers) ; le filtre GPAC est un second fichier. Ce découpage est ce qui
permet de compiler le décodeur en natif et de le confronter à une référence
avant le premier `.wasm` (`simpleimg`, `libjxr`, `libg711`).

Tables construites au démarrage depuis la définition plutôt que recopiées
(`dec_g711.c`) ; arithmétique entière quand le standard l'est.

## 2C. ffmpeg réduit

Un module par famille, sur le modèle d'`ffmpeg-h26x` :

```bash
emconfigure $FFMPEG/configure --target-os=none --arch=x86_32 --enable-cross-compile \
  --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc \
  --disable-runtime-cpudetect --disable-autodetect --disable-pthreads --pkg-config-flags="--static" \
  --nm="$EMSDK/upstream/bin/llvm-nm" --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ \
  --objcc=emcc --dep-cc=emcc --enable-pic --disable-everything --enable-decoder=<x>
```

Deux choix ensuite. Soit le `ffdec` générique de GPAC (`ff_dec-*.c` +
`ff_common.c`, recopiés d'`ffmpeg-h26x`), qui exige un `GF_CODECID_` sur le
pid d'entrée — ajouter la correspondance dans la table `FF2GPAC_CodecIDs` de
`ff_common.c`, en inventant un `GF_4CC` si GPAC n'en a pas (`'h','2','6','1'`,
`'F','L','V','1'`) et en le posant du même côté dans le démultiplexeur. Soit un
filtre écrit directement sur `libavcodec` quand le format n'a pas de pid cadré
possible (`ffmpeg-g726`, `ffmpeg-vc2`) — plus de code, aucune invention de
codec id.

Pièges connus : `dirac_decoder_select` oublie `qpeldsp` (dix-huit symboles
indéfinis, correctif dans `ffmpeg.patch`) ; `thread_count` doit valoir 1 et non
0 ; le `.gitignore` de `libavutil` cache `avconfig.h` — voir § 7.

## 3. Écrire le filtre

Copier le filtre existant le plus proche et adapter — ne pas partir de zéro :

| Pour… | Copier |
|---|---|
| une image, bibliothèque à en-tête unique | `qoi/` |
| de l'audio fichier entier | `libilbc/` (avec en-tête), `libsilk/` (avec options) |
| un maillon vidéo sur un codec connu | `h264bsd/` (NAL préfixés + DSI), `libdavs2/` (flux nu) |
| un démultiplexeur | `flvdmx/` |
| une conversion | `rgbyuv/` |
| du C++ | `libape/`, `poppler/` — `<emscripten/emscripten.h>` avant `gpac/filters.h`, `extern "C"` sur l'enregistrement |

Ce que chaque filtre doit avoir : les caps, `configure_pid` qui pose *toutes*
les propriétés de sortie, `process`, l'enregistrement
`EMSCRIPTEN_KEEPALIVE <nom>_register` + le constructeur
`gf_filter_auto_register`. Les options sont des `GF_FilterArgs` avec
`min_max_enum` à `NULL` (limite 7) et validées dans `configure_pid`.

`gf_filter_pck_merge_properties(src, dst)` — la source d'abord. Un filtre qui
lit un fichier entier sans découper doit respecter
`gf_filter_pid_would_block` s'il émet des milliers de paquets (`flvdmx`).

Puis :

```bash
# ajouter <nom> à set(filters …) dans filters/CMakeLists.txt, et
cd build && cmake . && make <nom>_1 -j8 && cp <nom>_1.wasm dist/
```

**Toujours depuis `build/`.** Un `cmake` lancé depuis `filters/` écrase
`filters/filter_list.json` et sème des `CMakeFiles/`.

## 4. Contrôle des symboles — obligatoire après le premier build

Un import non résolu fait que le module **ne s'instancie pas**, et le symptôme
est muet (« Filter not found », ou `Cannot read properties of undefined
(reading 'value') at reportUndefinedSymbols`). Le contrôle juste soustrait les
exports du module lui-même (symboles faibles, patrons C++) et compare aux
exports du **`.wasm`** du solveur, pas de son `.js` :

```bash
EMSDK=filters/third_parties/emsdk; source filters/third_parties/emsdk_vers.txt
W=build/<nom>_1.wasm; DIS=$EMSDK/upstream/bin/wasm-dis
$DIS $W | grep -oE '\(import "(env|GOT\.mem|GOT\.func)" "[^"]+"' | sed 's/.*" "//;s/"//' | sort -u > /tmp/imp
$DIS $W | grep -oE '\(export "[^"]+"' | sed 's/(export "//;s/"//' | sort -u > /tmp/exp
$DIS build/dist/solver_minimal_1.wasm | grep -oE '\(export "[^"]+"' | sed 's/(export "//;s/"//' | sort -u > /tmp/sol
comm -23 /tmp/imp /tmp/exp | comm -23 - /tmp/sol
```

Seuls `__memory_base` et `__table_base` doivent rester. Pour le reste, le
tableau des correctifs d'`AGENTS.md` § 4 : stubs locaux (`*_stubs.c`),
`--whole-archive`, `__cxa_throw` qui `abort()`.

## 5. Signal de test, puis vérification contre une seconde implémentation

`test_signals/<FORMAT>/` : un fichier officiel de l'amont si possible, sinon un
encodage local — **ffmpeg comme générateur, jamais dans le player**. Mire
`testsrc` 320×180 à 25 im/s pour la vidéo, `wav/geminiani48.wav` pour l'audio,
10 s au plus. Noter la commande dans `A_PUBLIER.md`.

Démo locale pour savoir si le module se charge et décode :

```bash
mkdir -p /tmp/demo && cd /tmp/demo
cp build/dist/{solver_1.js,solver_1.wasm,universal-video_1.js} build/<nom>_1.wasm build/{isobmff_1,libx264_1}.wasm .
cp test_signals/<FORMAT>/<signal> .
python3 -m http.server 8092 &
```

Une page qui crée le tag avec `test` posé, attend `decodingPromise`, et
`POST`e le blob résultant vers un petit serveur de capture ; le squelette est
dans `AGENTS.md` § 7. Une
vidéo passe par `with="…;isobmff_1;libx264_1"` sur `solver_1` — `UVideo.ts`
impose `out.mp4` et `c=avc`.

**Puis mesurer**, jamais « ça a l'air bon » :

- sans perte → écart **nul** attendu, `cmp` ou `np.array_equal` ;
- avec perte, contre la *même* bibliothèque compilée en natif → nul ou ±1 LSB
  (virgule flottante) ;
- contre une autre implémentation (ffmpeg) → PSNR/SNR par trame ou par
  échantillon, en cherchant d'abord un **décalage** avant de conclure à une
  erreur ; un écart de longueur en est presque toujours un.

Attention à ce que la comparaison compare : `videoWidth` est la largeur
*d'affichage* (SAR appliqué), pas celle du flux ; un PSNR bas peut être le
réencodage x264 à son débit par défaut et non le décodeur — vérifier en
regardant une trame.

Capturer la référence **depuis la chaîne** (`test_signals/out/<nom>/`) une fois
qu'elle est démontrée juste : le test compare des octets.

## 6. Test karma

`test-player/<nom>.js`, sur le modèle du plus proche : `create_pixel_test`
(image), `create_test(…, "wav", false, false)` (audio, hachage),
`create_structural_video_test` (vidéo, présence des pistes). Le commentaire en
tête du test dit d'où vient la référence et ce qui a été mesuré : c'est là que
l'information sert six mois plus tard.

En local, `TS` est surchargé vers un serveur CORS sur `test_signals` (§ 8
d'`AGENTS.md`). La suite entière doit rester verte : une régression ailleurs
est à signaler, pas à masquer.

## 7. Publier — seulement si la mission le demande

Ne rien pousser sans que ce soit demandé. Quand ça l'est :

```bash
cd filters/<nom> && git init -b main && git add -A
# le piège : un include/ recopié d'ffmpeg traîne libavutil/.gitignore, qui cache avconfig.h
comm -23 <(find . -type f -not -path './.git/*' | sed 's|^\./||' | sort) <(git ls-files | sort)   # doit être vide
git commit && gh repo create Bevara/<nom> --public && git push -u origin main
cd .. && git submodule add -f https://github.com/Bevara/<nom>.git <nom>
```

README au format des voisins (`libilbc/README.md`), avec une section sur ce
qui a été mesuré et, s'il y a une réserve, **en tête** (`ffmpeg-vc2`). Le
workflow CI `.github/workflows/build-accessors.yml` exige le scope `workflow`
sur le token : s'il est refusé, pousser sans et le dire.

Le seul contrôle qui ne ment pas : **construire depuis un clone neuf**.
`.gitmodules` et les gitlinks doivent avoir le même compte.

Démo `Showcase/<format>/` autonome (signal, `.wasm`, solveur), liée depuis la
bonne section d'`index.html`, vérifiée dans le navigateur avant d'être liée ;
un canvas veut un `data-url` **absolu**.

## 8. Rapport

Termine par un rapport qui donne, sans adjectif :

- le cas de figure retenu (A/B/C) et pourquoi ;
- la taille du `.wasm` ;
- la mesure de vérification (trames, échantillons, PSNR/SNR, ±n) et contre quoi ;
- ce qui est publié, ce qui ne l'est pas, ce qui reste à la main de l'humain
  (signaux à mettre en ligne, scope `workflow`, un choix de licence) ;
- ce que la mission supposait et qui s'est avéré faux, s'il y a lieu — c'est
  souvent la partie la plus utile ;
- les mises à jour faites à `AGENTS.md`, `CODECS_STATUS.md` ou
  `FORMATS_STATUS.md`, ou le piège nouveau qui mériterait d'y entrer.
