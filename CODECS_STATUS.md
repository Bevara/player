# Couverture des codecs de List_of_codecs et Lossy_compression

État au 7 septembre 2026. Périmètre : les deux pages
[List of codecs](https://en.wikipedia.org/wiki/List_of_codecs) et
[Lossy compression](https://en.wikipedia.org/wiki/Lossy_compression). La
seconde n'ajoute presque rien à la première : ses codecs concrets y figurent
déjà, à trois exceptions près (ICER, CPC, compression fractale), toutes trois
sans implémentation libre utilisable.

`FORMATS_STATUS.md` traite des **formats de fichier** ; ce document traite des
**codecs**, ce qui n'est pas la même liste : un même conteneur peut porter
plusieurs codecs, et beaucoup de codecs n'ont pas de format de fichier propre.

Un codec compte comme *supporté* quand un filtre du dépôt le décode et qu'un
test le vérifie.

---

## Règle qui décide de presque tout : pas de wrapper ffmpeg

La colonne « open source » de la page Wikipédia est trompeuse pour ce dépôt.
Elle marque « partial open source (FFmpeg decoder) » pour une écrasante
majorité des entrées — c'est-à-dire que le seul décodeur libre existant est
*à l'intérieur de ffmpeg*. Or ce player ne construit que des sous-ensembles
ffmpeg ciblés et n'en fait pas sa couche de décodage générale.

Sur les ~330 codecs nommés par la page, cette seule règle en écarte environ
200. Ce qui reste réellement adressable est petit, et c'est ce que ce document
cherche à isoler.

### Ce que coûte réellement le wrapper

La règle est de principe, mais le coût est mesurable, et il est plus faible
qu'on ne le croit. `libx264` et `ffmpeg-x264` pilotent le même encodeur, bâti
depuis la même source avec les mêmes options, et sont liés depuis le même
arbre ; la seule différence est l'appel direct ou via `ffenc` et libavcodec :

| Accesseur | Filtres | Taille |
|---|---|---|
| `libx264_1.wasm` | `encx264` | 1 372 776 |
| `ffmpeg-x264_1.wasm` | `ffenc` | 1 704 786 |

**332 010 octets, 24 %.** C'est toute la dépense du wrapper une fois ffmpeg
réduit au seul encodeur utilisé : la tuyauterie d'encodage de libavcodec, ce
qu'elle entraîne de libavutil, et les tables de correspondance codec / format
de pixel / options de `ff_common.c` qui font passer un `AVCodec` pour un filtre
GPAC.

Le même module construit contre un ffmpeg `--enable-gpl --enable-libx264` par
défaut — tous les décodeurs, encodeurs, multiplexeurs et démultiplexeurs que
ffmpeg connaît — pesait 14 779 621 octets, presque onze fois l'accesseur
direct. Ce facteur onze n'est donc pas le wrapper : c'est le reste de ffmpeg
qui voyage avec. `--disable-everything` est ce qui sépare les deux, et c'est
aussi ce qui rend `ffmpeg-h26x` viable à 946 Ko.

Autrement dit, la règle ne tient pas à la taille du wrapper mais à ce qu'elle
protège : la maîtrise de ce qui entre dans le binaire, et l'existence d'un
décodeur autonome auditable derrière chaque format.

---

## 1. Supporté aujourd'hui

**Audio** — PCM, MP1/MP2/MP3, AAC (LC et HE), Vorbis, Opus, **Speex**, **ALAC**,
**GSM 06.10**, **SBC**, **LC3**, **TTA**, **Codec 2**, **iLBC**,
**G.711 / G.721 / G.723**, **G.726**, **SILK**, **iSAC**, AC-3 et E-AC-3, DTS
Coherent Acoustics, AMR-NB et AMR-WB, Musepack, WavPack, FLAC, Monkey's Audio,
ADPCM (via les conteneurs), MIDI, et les formats tracker (MOD, XM, S3M, IT et
une centaine d'autres via libxmp).

Les cinq derniers sont des décodeurs de fichier entier — aucun de ces formats
n'a de conteneur — et chacun est confronté à une seconde implémentation :

| Codec | Filtre | Vérification |
|---|---|---|
| GSM 06.10 | `libgsm` | **0 échantillon différent sur 80 160** face à ffmpeg |
| SBC | `libsbc` (BlueZ) | **0 sur 881 920** face à ffmpeg |
| TTA | `libtta` | sans perte : **0 sur 882 000** face à l'audio encodé |
| LC3 | `liblc3` (Google) | 97 sur 960 000, écart max **1**, face au `dlc3` amont — arrondi flottant du build wasm |
| Codec 2 | `libcodec2` | 4 026 sur 80 000, écart max 40 (moyenne 0,17 LSB) face au `c2dec` amont |

**La famille G.711 / G.721 / G.723** (`libg711`, filtre `audec`) est faite, mais
par une autre porte que celle qu'on avait essayée d'abord. Aucun de ces codecs
n'a de conteneur propre, et un flux nu ne dit pas lequel de la famille on tient :
G.723 à 24 kbit/s empaquette 3 bits par échantillon, G.721 4, G.723 à 40 kbit/s
5, et rien dans les octets ne les distingue. La première tentative passait par le
WAV — indicatifs de format 6 et 7 — via `rfpcm` ; ce chemin reste bloqué (voir
plus bas). Le format **`.au` de Sun**, celui qui accompagnait ce code et dans
lequel arrive le matériel de référence, le dit en un mot d'en-tête. Le filtre lit
donc le conteneur au lieu de deviner, et couvre les cinq encodages d'un coup :

| encodage `.au` | codec | bits/échantillon |
|---|---|---|
| 1 | G.711 mu-law | 8 |
| 27 | G.711 A-law | 8 |
| 23 | G.721 ADPCM 32 kbit/s | 4 |
| 25 | G.723 ADPCM 24 kbit/s | 3 |
| 26 | G.723 ADPCM 40 kbit/s | 5 |

Les deux lois de compression sont développées dans le filtre depuis leur
définition dans la norme ; les trois débits ADPCM passent par l'implémentation
de référence de Sun, telle que libsndfile la porte dans `src/G72x` avec
l'enveloppe par blocs qui gère l'empaquetage propre à chaque débit — la seule
partie réellement difficile du travail.

Vérification, et elle a servi. **mu-law et A-law contre les décodeurs
indépendants d'ffmpeg : 0 échantillon différent sur 80 000, pour les deux
lois.** Mais A-law est d'abord sorti **exactement inversé** : en A-law le bit de
signe vaut 1 pour le *positif*, l'inverse de mu-law, et l'expansion niait chaque
échantillon. Un son nié s'entend à l'identique — seule une comparaison au niveau
de l'échantillon le trouve. Le correctif vaut aussi pour `dec_g711.c`, qui
portait le même défaut et était déjà publié.

Les trois débits ADPCM contre **le même code Sun construit en natif : 0
échantillon différent sur 79 920**, pour les trois. Face à l'implémentation G.726
distincte d'ffmpeg ils sont proches sans être identiques, et c'est cette chaîne
qui est la plus fidèle au signal encodé dans les trois cas (SNR 23,4 contre 21,1
dB à 32 kbit/s ; 17,6 contre 17,0 à 24 ; 28,6 contre 8,0 à 40) — attendu,
puisqu'une seule des deux implémentations correspond à l'encodeur qui a produit
le fichier.

**iLBC** (`libilbc`) est le dernier arrivé, et le plus simple de la série : la
bibliothèque de TimothyGu empaquette l'implémentation en virgule fixe de WebRTC
en une bibliothèque CMake autonome, qui se croise-compile telle quelle. Un seul
drapeau compte — `CMAKE_POSITION_INDEPENDENT_CODE` : passer `-fPIC` par
`CMAKE_C_FLAGS` ne suffit pas, les drapeaux par configuration arrivent après et
les objets sortent non-PIC ; `wasm-ld` les refuse alors sur chaque table de
constantes.

Le format de fichier est celui qu'écrit l'implémentation de référence : neuf
octets d'en-tête, `#!iLBC20\n` ou `#!iLBC30\n`, puis les trames empaquetées.
Le mode vient donc de l'en-tête, et un fichier qui n'en porte pas est refusé —
38 et 50 octets divisent trop de longueurs de flux pour qu'une supposition soit
sûre.

Vérification. Le codec étant en virgule fixe, le contrôle décisif est contre la
**même bibliothèque construite en natif** : **0 échantillon différent sur
80 160**. Le décodeur d'ffmpeg a servi de seconde implémentation, et il
corrobore le contenu sans être comparable échantillon par échantillon : il
corrèle au signal source à 0,775 là où cette chaîne corrèle à 0,773, mais il
s'aligne **40 échantillons (5 ms) plus tôt** — l'anticipation de l'enhancer de
WebRTC, qu'ffmpeg compense et que libilbc ne compense pas — et il place 113
pics à pleine échelle dans un signal qui n'en approche jamais. Deux
implémentations indépendantes d'un codec avec perte : c'est une corroboration,
pas une référence au niveau de l'échantillon.

L'écart de Codec 2 est plus large que les autres et s'explique : c'est un codeur
sinusoïdal en virgule flottante, où les arrondis s'accumulent à travers le LPC
et la synthèse. Une part vient de ce build lui-même — `solver_minimal_1`
n'exporte aucune fonction mathématique simple précision, donc `codec2_stubs.c`
fait passer `cosf`/`sinf`/`expf` par leurs versions double, ce qui est *plus*
précis que le chemin natif, pas moins.

Deux points notés en chemin. **TTA lève un point qu'`AGENTS.md` listait comme
non résolu** : son API C est bien un singleton, et le filtre refuse une seconde
instance simultanée plutôt que de laisser corrompre la première. Et **libtta
utilise `setjmp`** : le module importe quatre trampolines `invoke_*`, tous
définis par le glue de `solver_minimal_1` — dont le jeu est bien plus riche que
celui de `solver_1`, qui n'en a que trois.

**ALAC** est le deuxième maillon de chaîne du dépôt : `isobmff` démuxe le
MP4/M4A et émet un pid `GF_CODECID_ALAC`, que `alacdec` consomme. Vérification
la plus forte possible, le codec étant sans perte : **0 échantillon différent
sur 882 000** face à l'audio qui a été encodé.

Deux obstacles ont dû être levés, aucun des deux dans le filtre lui-même :

1. `isobmff` importe une cinquantaine de symboles GPAC que `solver_minimal_1`
   n'exporte pas, donc **il exige `solver_1`** — ce que font déjà les tests
   vidéo qui s'en servent. Le symptôme était opaque : emscripten plante dans son
   propre `reportUndefinedSymbols`, lequel ne nomme aucun symbole.
2. `EndianPortable.c` d'Apple ne reconnaît pas wasm32 et laissait tous ses
   `Swap*BtoN` inertes : le fichier 44 100 Hz s'annonçait à 1 152 122 880 Hz.
   Corrigé par `-DTARGET_RT_LITTLE_ENDIAN=1` à la compilation.

**Speex** vient d'être ajouté (`libspeex`), et c'est le premier filtre du dépôt
qui est un pur maillon de chaîne : `oggdmx` démuxe le `.spx` et émet un pid
`GF_CODECID_SPEEX`, que `speexdec` consomme — le filtre ne voit jamais le
conteneur. Deux corrections ont été nécessaires dans `oggdmx` lui-même, et la
seconde était invisible sans comparaison à un décodeur de référence :

1. Speex manquait dans le `switch` qui collecte les en-têtes d'initialisation,
   si bien que le pid était déclaré sans configuration de décodeur ;
2. il annonçait **1** en-tête là où un flux Speex en compte **2 + extra_headers**
   — l'en-tête *et* le paquet de commentaires Vorbis. Avec 1, le paquet de
   commentaires arrivait au décodeur comme de l'audio ; Speex étant prédictif,
   l'état corrompu faisait diverger toutes les trames suivantes : 159 390
   échantillons faux sur 160 000.

Vérification : décodage du même fichier par le `speexdec` amont compilé en
natif. Une fois alignés, **aucun échantillon d'un décodage de 10 s ne diffère
de plus de 1** (moyenne 0,016) — l'arrondi flottant du build wasm.

**Vidéo** — MPEG-1 Part 2, **H.261**, H.262/MPEG-2, **H.263**, MPEG-4 Part 2
(Xvid), H.264/AVC, H.265/HEVC, H.266/VVC, AV1, VP8, VP9, Theora,
**Motion JPEG**, **Motion JPEG 2000**, **AVS2**, **AVS3**, **MPEG-5 EVC**,
**Ut Video**, **Dirac** et **FFV1**.

**Motion JPEG** et **Motion JPEG 2000** n'ont demandé aucun décodeur : chaque
trame est une image complète, donc `libjpeg` et `openjpeg` conviennent tels
quels. Ce qui manquait était en amont — `avidmx` ne reconnaissait pas le fourcc
`MJPG` et laissait passer les JPEG non décodés, et `dec_j2k` ne savait pas
qu'un échantillon `mjp2` est un fichier JP2 complet et non un flux de code nu.
`rgbyuv` a été écrit pour la suite de la chaîne : tout décodeur d'image de ce
build rend du RGB entrelacé, x264 veut du YUV planaire.

**H.261** et **H.263** sont les deux seuls formats de cette liste pour lesquels
il n'existe aucun décodeur libre autonome — l'exception assumée à la règle en
tête de document. `ffmpeg-h26x` est ffmpeg configuré avec
`--disable-everything` et ces deux décodeurs seuls : 946 Ko de WebAssembly, là
où le même source construit pour MPEG-1 en pèse 5,5 Mo. Les deux signaux
voyagent en AVI, pour des raisons différentes : H.261 n'a pas d'autre choix, il
est antérieur à tous les conteneurs que GPAC multiplexe et n'a d'ailleurs pas
d'identifiant de codec dans GPAC — `avidmx` étiquette le pid avec le fourcc
lui-même. H.263 a bien un reframer, `rfh263`, livré dans le module, mais le
flux nu ne porte pas la cadence : H.263 numérote ses images par référence
temporelle sans jamais dire combien il y en a par seconde, donc un `.263` brut
retombe sur les 15 im/s de la recommandation.

**H.264** avait un filtre dans l'arbre, `h264bsd`, qui n'avait jamais produit
d'image : son pid de sortie était commenté. Réécrit en maillon sur un pid AVC
déjà cadré — c'est la sixième limite de `AGENTS.md`, le graphe se résout au
`configure_pid` et un décodeur qui n'annonce sa géométrie qu'après est
court-circuité par `mp4mx`. Profil Constrained Baseline uniquement, ce qui est
le périmètre de h264bsd et non une limite du portage.

**SILK**, **iSAC** et **FFV1** étaient les trois dernières entrées du §2, et
chacune a demandé une réponse différente de celle que ce document annonçait.

**SILK** n'était pas « déjà dans libopus, simplement pas exposé ». libopus
porte bien un décodeur SILK, mais pas ce flux : en entrant dans Opus, SILK a vu
son en-tête de trame passer dans l'octet TOC d'Opus, si bien que le
`silk_Decode` de libopus attend de l'appelant la fréquence interne et le nombre
de trames du paquet et ne les lit plus du flux. Un fichier `.silk` autonome les
porte toujours dans la trame, là où le SDK les avait laissés. Mesuré plutôt que
supposé : décoder un vrai `.silk` avec le SILK de libopus donne **−20 dB de
SNR** face au décodage du SDK sur le même fichier. Ce n'est pas un écart
d'arrondi, c'est un autre format. `libsilk` s'appuie donc sur le SDK de Skype,
sous licence BSD, et le résultat est **exact au bit près** — 240 000
échantillons, aucun ne diffère.

**iSAC** n'a ni bibliothèque ni format de fichier. Il a été retiré de WebRTC en
2022 et aucune distribution ne l'empaquette, donc les sources sont un instantané
figé de la dernière révision où le codec et les routines de traitement du signal
qu'il appelle concordaient encore (`m93_release`, commit `9ea05f1`). C'est ce
qui justifie d'épingler : `WebRtcSpl_AnalysisQMF` est passé plus tard de int16 à
float alors qu'`isac/main` continue d'appeler la forme int16 — un arbre qui
mélange les deux compile avec des avertissements et décode du bruit. Et comme
iSAC n'a jamais circulé qu'en RTP, le seul conteneur qui existe est le vidage de
flux du programme de test de WebRTC : par trame, une longueur 16 bits gros-boutien
puis la charge utile, sans magie ni fréquence d'échantillonnage — d'où `srate` en
option. Face aux mêmes sources compilées nativement : sur 159 840 échantillons,
1 230 diffèrent et aucun de plus de 1, l'écart arithmétique entre un build x86-64
et un build wasm sur un codec en virgule flottante.

**FFV1** est le seul codec vidéo dont l'implémentation de référence *est*
ffmpeg : il a été conçu dedans et il n'existe pas de second décodeur. C'est donc
l'exception assumée, comme H.261 et H.263 : ffmpeg réduit à ce seul décodeur,
**774 Ko** là où le même source avec les réglages par défaut d'ffmpeg en produit
14,8 Mo. GPAC porte `GF_CODECID_FFV1` depuis toujours, mais `ff_common.c` amont
n'a aucune entrée pour lui — rien ne pouvait donc router un pid FFV1 vers
`ffdec`. FFV1 étant sans perte, la seule perte de la chaîne est le réencodage
x264 : 63,4 dB.

**G.726** a démenti l'entrée qui l'annonçait. Le dépôt porte déjà le code g72x
de Sun via `libg711`, et G.726 est la fusion de 1988-1990 de G.721 et G.723 :
il ne devait donc rester qu'à ajouter un débit. Mesuré sur les mêmes flux, face
à la source :

| débit | g72x de Sun | ffmpeg |
|---|---|---|
| 16 kbit/s | 11,6 dB | 11,8 dB |
| 24 kbit/s | 17,1 dB | 17,7 dB |
| 32 kbit/s | 21,4 dB | 23,4 dB |
| 40 kbit/s | **−3,4 dB** | 28,5 dB |

Et la réciproque tient : sur un `.au` de Sun codé à 40 kbit/s, le code de Sun
donne 28,6 dB et ffmpeg 8,0 dB. Au-delà de 24 kbit/s ce ne sont **pas les mêmes
flux**. `audec` reste donc ce qu'il est — un lecteur de `.au` — et G.726 est
`ffmpeg-g726`, 264 Ko. Exact au bit près face à un décodage natif à 32 kbit/s.
Un flux G.726 nu ne porte aucun en-tête, donc la taille du mot de code, la
fréquence et l'ordre des bits sont des options ; la page ne sait pas encore en
passer (rien dans les balises universelles ne transmet un argument de filtre),
donc seul le défaut — 4 bits, 8 kHz, MSB d'abord, ce qu'écrit le multiplexeur
`.g726` d'ffmpeg — est exercé par le test.

Mesures, chacune contre un décodage natif du même fichier, à travers toute la
chaîne y compris le réencodage x264 : H.261 59,4 dB, H.262 61,5 dB, H.263
59,5 dB, H.264 61,7 dB, Motion JPEG 48,8 dB, FFV1 63,4 dB — 50 trames sur 50
dans les six Le décodage MPEG-2 en rendait 48 sur 50 avant ce travail : libmpeg2 garde
les dernières images tant qu'il n'a pas vu ce qui suit, et un flux qui se
termine sans code de fin de séquence les emportait avec lui.

**AVS2** (`libdavs2`) et **AVS3** (`libuavs3d`) sont les deux normes chinoises,
et toutes deux se présentent en flux élémentaire nu : le filtre prend le
fichier entier, le découpe sur les codes de départ image et séquence et émet
une trame YUV par image. Le test est fonctionnel — `UVideo.ts` impose
`out.mp4` et `["c=avc"]`, donc un décodeur vidéo brut a toujours `isobmff_1`
et `libx264_1` derrière lui, et `solver_1` pour les mêmes symboles GPAC que
réclame ALAC.

Chacun a demandé une correction en amont :

1. **uavs3d** — emscripten annonce `CMAKE_SYSTEM_PROCESSOR` à `x86`, donc le
   `CMakeLists` amont choisit `decore/sse` et `decore/avx2` ; ces sources
   utilisent `__m64`, que l'émulation SSE d'emscripten ne couvre pas.
   `uavs3d.patch` route EMSCRIPTEN vers le chemin C générique.
2. **davs2** — plus profond : davs2 ne décode une image *que* depuis un thread
   du pool. `davs2_threadpool_run` met le travail en file et rend la main ;
   sans thread, la file n'est jamais vidée et `task_get_free_task` tourne
   indéfiniment sur la deuxième image. Le symptôme dans le player était muet :
   x264 s'initialisait — il tient sa résolution des propriétés du pid — puis
   plus rien. `davs2.patch` ajoute `DAVS2_SINGLE_THREAD`, actif sous
   `__EMSCRIPTEN__`, qui exécute chaque travail sur place.

Vérification. Pour AVS2, le mp4 produit par la chaîne a été comparé image par
image au même fichier décodé par un `davs2` construit en natif : **50 trames
sur 50**, ~58 dB de PSNR — l'écart que le ré-encodage x264 explique à lui
seul. Pour AVS3, le signal `SFTI_640x360.avs3` porte 600 codes de départ image
mais ne rend que 10 trames ; ce n'est pas le filtre : le `uavs3dec` amont,
construit en natif depuis les mêmes sources, décode exactement les mêmes 10
trames puis s'arrête sur « Failed: -6 ». Le test contrôle donc ce qu'il peut,
qu'une piste vidéo atteigne le mp4 de sortie.

**MPEG-5 EVC** (`libxevd`, sur xevd) est arrivé juste après, et n'a demandé
aucun contournement dans le filtre lui-même. Deux choses le distinguent des
deux AVS :

1. **Le format n'est pas délimité par des codes de départ.** Un flux EVC est
   une suite d'unités NAL, chacune précédée de sa propre longueur sur 4 octets.
   Plutôt que de lire cette longueur à la main et d'en deviner l'ordre des
   octets, le filtre passe par `xevd_info()`, qui fait partie de l'API publique
   et que l'application de xevd utilise elle-même.
2. **xevd décode en interne sur 10 bits**, même pour un flux 8 bits : ce qui
   sort de `xevd_pull` peut faire 16 bits par échantillon. La réduction vers
   les 8 bits que porte le pid reprend exactement ce que fait l'application de
   xevd — arrondi au plus proche puis écrêtage — parce que tout autre choix
   décalerait l'image d'un demi-niveau.

Contrairement à davs2, xevd dégrade proprement en mono-thread : `xevd_create`
ne lance des workers que sous `if (ctx->tc.max_task_cnt > 1)` et chaque boucle
par tâche est bornée par leur nombre. `evc_stubs.c` ne fournit la famille
`pthread_*` que pour satisfaire l'éditeur de liens, et ces stubs échouent
bruyamment plutôt que de faire croire à un pool qui n'existe pas.

Le côté build a demandé `xevd.patch` : emscripten annonce `x86` comme
processeur, ce qui sélectionnerait les sources `sse/` et `avx/`, et la branche
Clang du `CMakeLists` ajoute `-pthread` sans condition — ce qui ferait émettre
des atomiques et de la mémoire partagée qu'un side module ne peut pas lier.

Vérification : signal de 50 trames 320×180 encodé avec un `xeve` construit en
natif, puis le mp4 de la chaîne comparé image par image au même fichier décodé
par un `xevd` natif — **50 trames sur 50**, ~61 dB de PSNR.

**Ut Video** (`libutvideo`) est le premier maillon de chaîne *vidéo* du dépôt,
et il applique la règle « réutiliser un filtre existant » : Ut Video n'a pas de
conteneur propre, il vit dans de l'AVI, et le dépôt lit déjà l'AVI. Le graphe
est donc `avidmx_1;libutvideo_1;isobmff_1;libx264_1`. Ce qui rend cela possible
est une ligne d'`avidmx` : pour un fourcc de compresseur qu'il ne reconnaît
pas, il émet un pid dont l'identifiant de codec **est** le fourcc
(`gf_4cc_parse`), avec le BITMAPINFOHEADER en configuration de décodeur. Le
filtre déclare donc `ULY0`, `ULY2`, `ULY4`, leurs jumeaux BT.709 `ULH0`, `ULH2`,
`ULH4`, et `ULRG` comme identifiants d'entrée.

C'est aussi le portage le plus lourd de la série, parce qu'Ut Video ne publie
plus qu'une solution Visual Studio : il n'y a pas de système de construction à
piloter, la moitié portable d'`utv_core` est compilée à la main. Cinq points,
tous dans `utvideo.patch` :

1. `auto& [a, b, c] = f()` où `f` rend par valeur — MSVC laisse une référence
   lvalue non const se lier à un temporaire, clang non. Passé à `auto&&`, qui
   se lie aux deux et déduit `T&` pour une lvalue : rien d'autre ne bouge.
   92 occurrences.
2. Un type dépendant sans `typename` dans `BandParallelCodec.cpp`, plus deux
   instanciations explicites manquantes de `CalcBandPosition`.
3. `CDummyCodec::m_utvfCodec` est un `static const`, pas un `static constexpr`,
   donc C++17 ne le rend pas implicitement inline — et son adresse est prise.
4. `<endian.h>` est un en-tête glibc.
5. `UTVIDEO_SINGLE_THREAD` — **le même piège que davs2** : un travail soumis à
   `CThreadManager` ne s'exécute que sur un thread du pool. Sans thread, la
   file n'est jamais vidée et `WaitForJobCompletion` bloque indéfiniment. Sous
   `__EMSCRIPTEN__` le gestionnaire ne garde aucun thread et exécute chaque
   travail là où il est soumis ; les bandes sont indépendantes et
   `WaitForJobCompletion` est le seul point de synchronisation, donc le
   résultat est inchangé.

Deux détails de liaison méritent d'être notés parce qu'ils ne se voyaient pas
avec le contrôle habituel des symboles `env` : `_ZN11CDummyCodec11m_utvfCodecE`
et `fdLogSock` manquaient en **`GOT.mem`**, et seul le contrôle élargi aux
imports `GOT.mem`/`GOT.func` les fait apparaître — ce qu'`AGENTS.md` §4 dit
déjà, et qui reste facile à oublier. Par ailleurs, la majorité des symboles
d'Ut Video sont des instanciations de patrons, donc **faibles** : le module les
importe *et* les exporte, et le loader les résout depuis le module lui-même.
Les compter comme manquants donne une cinquantaine de fausses alertes.

Ut Video sort le YUV en ordre YV12/YV16/YV24 — Y puis V puis U — là où
`GF_PIXEL_YUV` attend Y puis U puis V ; le filtre échange les deux plans de
chrominance. `GF_PIXEL_YVU` existe et éviterait l'échange, mais seulement en
4:2:0 : il n'y a pas de YVU422 ni de YVU444, et une seule règle pour les trois
sous-échantillonnages vaut une copie de plan.

Vérification : le codec étant sans perte, le décodeur d'ffmpeg reproduit le YUV
source **octet pour octet** — c'est la référence. Le mp4 de la chaîne s'y
compare à **~64 dB de PSNR** sur les 50 trames, ce qui est la perte de
ré-encodage x264 et rien d'autre ; en particulier les plans de chrominance ne
sont pas intervertis, ce qui effondrerait le PSNR de U et V au lieu de le
laisser à 62.

**Dirac** (`libschro`, sur schroedinger) ferme la §2, mais avec une limite qu'il
faut énoncer d'abord : **il décode Dirac, pas VC-2 HQ.** schroedinger 1.0.11
est antérieur à la normalisation du profil « high quality » de VC-2, et sa
macro `SCHRO_PARSE_CODE_IS_LOW_DELAY` ne teste que `(code & 0x88) == 0x88` — si
bien qu'une image HQ (code de parse `0xE8`) est lue avec la syntaxe de tranches
*low delay* : tous les coefficients ressortent nuls et l'image est un gris
uniforme. C'est exactement ce que produit l'encodeur `vc2` d'ffmpeg, qui n'a
aucune option de profil. Le filtre **refuse** un tel flux plutôt que de le
décoder en gris.

Le portage tient à deux choses. La première est **orc** : le `configure` de
schroedinger l'exige, et orc est un JIT — il émet des instructions natives dans
un tampon et y saute, ce que WebAssembly ne peut pas faire. Mais `orcc` laisse
dans `schroorc-dist.c` une branche `DISABLE_ORC` en C pur pour chaque fonction,
et il ne reste alors que quatre noms à fournir : deux typedefs entiers,
`orc_memcpy` et `orc_memset`. Le seul fichier réellement perdu est
`schromotion8.c`, qui *génère* son code de compensation de mouvement ;
schroedinger embarque justement un rendu de référence complet en C
(`schromotionref.c`), que le patch sélectionne d'office.

La seconde est plus instructive. **WebAssembly vérifie la signature à chaque
appel indirect**, donc un pointeur de fonction converti vers un type qui n'a pas
le même nombre de paramètres provoque un `RuntimeError: function signature
mismatch` à l'exécution — là où un appel natif ignore simplement l'argument
excédentaire. schroedinger fait cela à cinq endroits :

```c
domain->free = (void *) free;              /* declare void(void*,int), appele a 2 args */
schro_queue_new (4, (SchroQueueFreeFunc) schro_frame_unref);   /* 1 param -> 2 */
schro_list_new_full ((SchroListFreeFunc) schro_buffer_unref, NULL);
```

Rien de tout cela ne se voit au contrôle des symboles : le module se charge, le
graphe se construit, et ça casse au premier appel. Le patch ajoute des
adaptateurs à l'arité déclarée.

Vérification, en trois temps. (1) Signal produit par l'encodeur de schroedinger
construit en natif — 50 trames 320×180, inter-codées (48 des 50 codes de parse
sont `0x0E`, une référence), donc le rendu de mouvement de référence est bien
exercé. (2) Ce flux se trouve être **sans perte** : le décodeur Dirac d'ffmpeg
en ressort les trames source octet pour octet, et un schroedinger natif est
d'accord avec ffmpeg **sans un seul échantillon d'écart** sur les 50 trames.
(3) Le mp4 de la chaîne se compare à cette référence à **~64 dB de PSNR** — la
perte de ré-encodage x264, et rien d'autre.

**Image** — voir `FORMATS_STATUS.md` : JPEG, JPEG 2000, JPEG XL, JPEG-LS,
JPEG XR, PGF, WebP, AVIF, HEIF, BPG, PNG, GIF, TIFF, QOI, FLIF, JBIG, JBIG2,
S3TC/BCn (DDS), MNG/JNG, et une vingtaine de formats bitmap et documents.

---

## 2. Non supporté mais réellement adressable

Le critère est strict : il existe une **bibliothèque autonome, libre et
portable**, en dehors de ffmpeg. C'est la seule section sur laquelle il vaut la
peine de travailler.

| Codec | Bibliothèque autonome | État |
|---|---|---|
| **G.727** | aucune | G.726 est fait (`ffmpeg-g726`), mais G.727 est de l'ADPCM *emboîté* — bits de cœur et bits d'enrichissement — que ni le code de Sun ni ffmpeg n'implémentent. La seule référence est le module G.727 de la STL de l'UIT-T (G.191), dont la licence n'est pas une licence libre |
| **VC-2 profil HQ** | `vc2-reference` (BBC), peut-être ffmpeg | Voir ci-dessous : l'entrée précédente était inexacte sur deux points, et le blocage réel n'est pas celui qu'elle décrivait |
| **Draco**, **meshopt** | `libdraco`, `meshoptimizer` | maillages 3D : hors du domaine d'un player audio/vidéo/image |

### VC-2 profil HQ : ce qui bloque vraiment

L'entrée du tableau disait que le seul décodeur libre couvrant le profil HQ
était `vc2-reference`, et que son obstacle était un sous-ensemble d'en-têtes
boost à embarquer. Les deux points sont faux.

ffmpeg **a** un décodeur Dirac qui annonce VC-2, et il décode correctement le
`.drc` Dirac de `test_signals` (min 14, max 237 sur la luminance de la première
trame). Mais **ffmpeg ne décode pas la sortie de son propre encodeur `vc2`** :
la trame décodée est un gris uniforme, 128 sur toute la luminance — la valeur
qu'on obtient quand la transformée en ondelettes n'a rien écrit et que
`put_signed_rect_clamped` ajoute son décalage. Reproduit avec ffmpeg 8.x du
système et avec le 6.1.2 du dépôt. Impossible donc de dire, sans troisième
implémentation, si c'est l'encodeur `vc2` qui n'est pas conforme ou le chemin
HQ du décodeur qui ne fonctionne pas — et impossible de se servir d'ffmpeg
comme référence.

Et `vc2-reference` embarque déjà son sous-ensemble de boost, dans `src/boost` :
ce qui lui manque ici, ce sont les bibliothèques boost **compilées**
(`program_options`, `thread`, `system`) que réclame son `configure.ac`, plus un
test d'architecture qui refuse tout ce qui n'est pas x86_64 (contourné, une
ligne).

Le filtre est écrit et publié — [`ffmpeg-vc2`](https://github.com/Bevara/ffmpeg-vc2),
800 Ko : découpage des unités `BBCD`, lecture de la taille dans l'en-tête de
séquence en Golomb exponentiel entrelacé, conversion en 4:2:0 par swscale. Il
fait traverser 50 trames à la chaîne. Il reste **non vérifié**, et c'est la
première chose que dit son README : son seul signal de test décode en gris chez
tout le monde. Il est laissé hors de la liste de construction par défaut, comme
les autres modules ffmpeg, et pour une raison de plus qu'eux — `vc2dec`
revendique l'extension `.vc2`, que le `diracdec` de `libschro` revendique aussi
sans pouvoir la servir. Il manque un flux de conformité VC-2 HQ, ou boost pour
construire l'encodeur de référence.

Au passage, le `configure` d'ffmpeg oublie `qpeldsp` dans
`dirac_decoder_select` alors que `diracdsp` en tire ses
`ff_put_dirac_pixels*` : avec `--disable-everything`, le module ne se lie pas.
Corrigé dans `third_parties/ffmpeg.patch`.

## 3. Non supporté : décodeur libre uniquement dans ffmpeg

Écarté par la règle en tête de document. La liste est longue ; voici ce qu'elle
recouvre, par familles.

- **Audio sans perte** : ALS, SLS, DST, OSQ, Shorten, RKAU, WMA Lossless,
  Dolby TrueHD / MLP, DTS-HD MA, ATRAC Advanced Lossless, RealAudio Lossless.
- **Audio avec perte** : WMA, RealAudio (Cook, VSELP, LD-CELP), ATRAC 1/3/9,
  TwinVQ, QDesign, Voxware, Truespeech, Nellymoser, Siren 7, Dolby E,
  SMPTE 302M, MS-ADPCM, G.722.x, G.723.1, G.728, G.729x, EVRC, QCELP,
  Bink Audio, Smacker Audio, XMA, ADX, HCA, VAG, ATRAC9, FADPCM.
- **Vidéo avec perte** : VC-1, WMV, RealVideo 1 à 11, Indeo 2/3/4/5, Cinepak,
  Sorenson, MS Video 1, On2 VP3 à VP7, Bink, Smacker, Mobiclip, MotionPixels,
  CDXL, DXA, Photo CD, Apple RPZA, ProRes, ProRes RAW, DNxHD/VC-3, CineForm,
  Grass Valley HQ, SpeedHQ, Pixlet, Apple Intermediate, AVC-Intra, NotchLC,
  Cintel RAW, GoToMeeting, VMnc, TSCC, ScreenPressor, IMM4/5/6, AVS1-P2, LCEVC.
- **Vidéo sans perte** : Huffyuv, Lagarith, MagicYUV, FFV1, Snow, ZMBV, MSRLE,
  QuickTime RLE, CorePNG, Dxtory, Fraps, SheerVideo, VBLE, ZeroCodec, LOCO,
  AASC, Flash Screen Video, CamStudio, innoHeim, ScreenPresso.

Chacun redeviendrait adressable si le projet acceptait un jour de construire un
sous-ensemble ffmpeg ciblé, comme il le fait déjà pour quelques cas précis.

## 4. Non supporté : aucune implémentation libre

Rien à intégrer, quelle que soit la politique sur ffmpeg.

- **Bluetooth propriétaire** : aptX et ses variantes, LDAC, LHDC, LLAC, UAT,
  MQair, SBC XQ, FastStream, les codecs Samsung.
- **Neuronaux** : Lyra et Lyra V2, Satin, EnCodec, WavTokenizer, AIVC,
  Deep Render, MPAI-EVC, MPAI-EEV.
- **Voix militaire et radio professionnelle** : MELPe (STANAG-4591), MELP,
  NVOC, RALCWI, TWELP, AMBE et AMBE+2 (seul `mbelib` existe, à la légalité
  discutée), TETRA ACELP, TETRAPOL RPCELP.
- **Téléphonie mobile 2G/3G** : GSM Half Rate, EFR, IS-96A, IS-127, IS-733,
  IS-85, IS-641, PDC-FR/HR/EFR, AMR-WB+, EVS, SMV, VMR-WB.
- **Diffusion et cinéma** : Dolby AC-4, MPEG-H 3D Audio, XAVC, AVC-Ultra,
  VC-5, VC-6, JPEG XS, ArriRaw, Blackmagic RAW, Sony X-OCN, CinemaDNG,
  TICO RAW, Hap, DXV, RemoteFX, DSC et VDC-M.
- **Anciens ou abandonnés** : OptimFROG, TAK, LA, LPAC, LTAC, mp3HD, BFDLAC,
  L2HC, PASC, NICAM, HILN, BSAC, Perceptual Audio Coder, ICER, CPC,
  compression fractale.

## 5. Hors périmètre par nature

- **Nuages de points et maillages** : V-PCC, G-PCC, 3DMC, FAMC, SC3DMC,
  PB3DMC, Draco, meshopt — de la géométrie, pas un flux audiovisuel.
- **Texte et métadonnées** : BiM, CMML, MPEG-4 Part 17, ttyrec.
- **Codecs de conteneur ou de transport** : ZRLE, NSCodec, CU-SeeMe, nv —
  liés à un protocole d'écran distant, sans fichier à décoder.

---

## Résumé chiffré

| | Codecs |
|---|---|
| Supportés | ~61 |
| Adressables, bibliothèque autonome existante | ~2 (§2) |
| Libres mais seulement dans ffmpeg | ~200 (§3) |
| Sans implémentation libre | ~90 (§4) |
| Hors périmètre | ~15 (§5) |

Faits depuis : **Speex**, **ALAC**, **GSM 06.10**, **SBC**, **LC3**,
**Codec 2**, **AVS3**, **AVS2**, **MPEG-5 EVC**, **Ut Video**, **Dirac**,
**iLBC**, **G.711 / G.721 / G.723**, **Motion JPEG**, **Motion JPEG 2000**,
**H.261**, **H.263** et **H.264** (le filtre existait mais ne décodait rien),
**SILK**, **iSAC**, **FFV1** et **G.726**. Il ne reste du §2 que **VC-2 profil
HQ**, faute de flux de conformité pour le vérifier, et **G.727**, faute de
toute implémentation libre.

**Le chemin WAV de `rfpcm` reste cassé**, et c'est ce qui a fait passer G.711
par le `.au`. L'état exact, après diagnostic :

- `rfpcm` **fonctionne** sur son premier faisceau de caps : un fichier dont
  l'extension est un nom court de format audio (`pcm`, `pc8`, `s24`…) se décode
  normalement. Le filtre est donc bien enregistré.
- il ne se connecte **jamais** au second faisceau, celui du WAV — ni sur un WAV
  G.711, ni sur un WAV PCM linéaire ordinaire. L'erreur est
  `No filter chain found for PID … in filter fin to any loaded filters`.

Deux hypothèses ont été testées et écartées. La mutation de caps que fait
`rfpcm_register` (`PCMReframeCaps[1].val.value.string =
gf_audio_fmt_all_shortnames()`) est correcte — instrumentée, elle produit bien
`pc8|pcm|pcmb|s24|…`. Et donner au faisceau WAV ses propres caps de sortie, sur
le modèle du second faisceau de `reframe_flac.c`, ne change rien. C'est un
défaut du filtre amont, non résolu, et il bloquerait aussi G.726 et G.722 par
cette voie.
