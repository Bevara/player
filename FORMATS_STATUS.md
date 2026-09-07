# TODO : explorer les liens suivants : https://en.wikipedia.org/wiki/List_of_codecs et https://en.wikipedia.org/wiki/Lossy_compression
# Couverture des formats de https://en.wikipedia.org/wiki/List_of_file_formats

État au 5 septembre 2026 (révisé le même jour après l'ajout de JPEG XR, PGF, PSD, XCF, MSP, PCX, TGA, SGI, PNM et XBM). Périmètre : les quatre sections médias de la page —
**Raster graphics** (102 entrées), **Sound and music** (92), **Video** (45) et
**Document** (87), soit 326 entrées. Le reste de la page (archives, bases de
données, polices, exécutables, CAO, SIG, code source…) sort du domaine d'un
player multimédia.

Un format compte comme *supporté* quand un filtre du dépôt le décode et qu'un
test le vérifie.

---

## 1. Supporté aujourd'hui

**Image** — PNG, JPEG, JPEG 2000, JPEG XL, BMP/DIB, TIFF, GIF (image et
animation), WebP, AVIF, HEIF/HEIC, BPG, QOI, JPEG-LS, **JPEG XR**, **PGF**,
FLIF, JBIG, JBIG2, ICNS, DDS (BC1→BC7), MNG/JNG, **PSD/PSB/PDD**, **XCF**,
IFF/ILBM, Degas PI1/PC1, **MSP** (plus ~500 formats rétro via RECOIL),
**PCX**, **TGA**, **SGI/RGB**, **PNM (PBM/PGM/PPM)**, **XBM**,
RAW appareils (NEF, CR2/CR3, ARW, DNG, ORF, RAF, RW2, PEF, SRF…), PDF.

Les dix formats en gras ont été ajoutés en dernier. Chacun est vérifié contre
une seconde implémentation, et l'écart mesuré est nul partout où le format le
permet :

| Format | Filtre | Vérification |
|---|---|---|
| JPEG XR | `libjxr` (jxrlib) | fichier sans perte : **0 octet d'écart** sur 196 608 face à l'image encodée ; q=0,6 : écart max 21 |
| PGF | `libpgf` (libpgf) | sans perte : **0 octet d'écart** ; qualité 4 : écart max 17, soit exactement le chiffre déjà relevé pour un aller-retour libpgf |
| PSD/PSB | `libpsd` (psd_sdk) | RLE et brut : **0 octet d'écart**, Pillow d'accord sur les deux |
| XCF | `libxcf` (cœur de xcftools) | RLE et non compressé : **0 octet d'écart** |
| MSP | `librecoil` (RECOIL) | **0 octet d'écart** face à Pillow |
| PCX, TGA, SGI, PNM, XBM | `simpleimg` (décodeurs écrits dans le dépôt) | 10 fichiers, **0 octet d'écart** face à Pillow — deux fois : en natif puis à travers le pipeline |

**JPEG XT** est un cas à part : ses fichiers sont déjà lus par `libjpeg`, parce
que le format pose ses extensions dans des marqueurs APP11 au-dessus d'une
couche de base JPEG compatible. Les deux fichiers de test décodent à l'octet
près comme Pillow. Ce qui n'est **pas** décodé, ce sont les couches
d'extension : sur le fichier profil C, qui est du HDR, la couche de base est
une version tone-mappée (écart max 203 avec l'original) ; sur le fichier à
résiduel sans perte, la base est un JPEG avec perte ordinaire (écart max 18).
Décoder les couches XT demanderait `libjpeg-xt` lui-même (voir §3).

**Audio** — WAV/PCM, AIFF, FLAC, MP1/MP2/MP3, AC-3, AAC, Vorbis, Opus, MIDI,
MOD/XM/S3M/IT (plus ~90 formats tracker via libxmp), WavPack, AMR-NB/WB,
Musepack, DTS, Monkey's Audio.

**Vidéo** — MPEG-1/2, H.264, HEVC, VVC, AV1, VP8/VP9, Theora, MPEG-4 ASP/Xvid,
et les conteneurs MP4/3GP/M4V, AVI, WebM/MKV, OGG.

---

## 2. Non supporté : bloqué par le runtime du player

Trois filtres sont écrits, compilés et liés, mais **ne se chargent pas dans le
navigateur**. Le blocage vient du solveur pré-construit, pas du format ni de la
bibliothèque. Ce sont les cas les plus proches d'aboutir.

| Formats | Filtre | Cause exacte |
|---|---|---|
| DjVu | `libdjvu` (DjVuLibre) | DjVuLibre décode dans un thread de fond et n'a pas de mode sans thread (`GThreads.h` : « Libdjvu requires thread support »). Les side modules sont mono-thread : `ddjvu_document_decoding_done()` n'est jamais vrai, la page se fige. |
| XPS, OpenXPS, CBZ, EPUB, FB2, MOBI | `libmupdf` (MuPDF) | `fz_try`/`fz_catch` repose sur `setjmp`/`longjmp`. En SjLj JavaScript le module importe des trampolines `invoke_*` que le solveur n'exporte pas ; en SjLj WebAssembly il importe le tag `__c_longjmp`, absent lui aussi → `LinkError: tag import requires a WebAssembly.Tag`. |
| NSF, GBS, SPC, VGM, AY, GYM, HES, KSS, SAP | `libgme` (game-music-emu) | Le `.wasm` est bien téléchargé mais `gmedec` ne s'enregistre jamais dans le graphe. Piste : un constructeur statique C++ qui échoue avant la chaîne d'enregistrement. |

**Débloquer les deux premiers relève du solveur** : le reconstruire avec
l'ensemble des signatures `invoke_*` (ou en SjLj WebAssembly), et avec
`-pthread` pour DjVu. Cela ouvrirait d'un coup 7 formats.

---

## 3. Non supporté : bibliothèque déjà construite, filtre à écrire

`build_thirdparties.sh` construit déjà ces bibliothèques ; il ne manque que le
filtre. C'est le travail le plus rentable de la liste.

| Format | Bibliothèque prête | Remarque |
|---|---|---|
| Speex | `speex` | **le plus proche d'aboutir** : `oggdmx` démuxe déjà les `.spx` et sort un pid `GF_CODECID_SPEEX`, il ne manque donc que le décodeur en bout de chaîne, pas la couche Ogg. Il faut en revanche produire un signal de test : `test_signals/SPX/` n'existe pas encore |
| TTA | `libtta` | API C à callbacks portée par un contexte unique, à faire correspondre à une instance de filtre par pid ; pas de signal de test non plus |
| JPEG XT (couches d'extension) | `libjpeg-xt` | la couche de base est déjà lue par `libjpeg` (voir §1) ; décoder les couches HDR/résiduelles demande la bibliothèque, qui utilise `setjmp` — voir la limite 2 d'AGENTS.md |

Les six autres lignes de ce tableau ont été traitées : JPEG XR, PGF, PSD et XCF
ont désormais leur filtre, MSP passe par `librecoil`, et PCX/TGA/SGI/PNM/XBM
sont servis par `simpleimg`.

---

## 4. Non supporté : décodeur libre existant, hors du dépôt

Rien n'est construit, mais une implémentation autonome existe et le portage est
du travail balisé.

| Format | Décodeur autonome |
|---|---|
| AVS2 | `davs2` |
| AVS3 | `uavs3d` (des signaux `AVS3/` sont déjà dans test_signals) |
| MPEG-5 EVC | `xevd` |
| Dirac / VC-2 | `vc2-reference` (BBC) |
| APNG | libpng + le patch APNG |
| VTF | VTFLib — **construit mais inutilisable** : réclame `libtxc_dxtn`, absent du dépôt |
| NITF | `nitro` — **construit mais inutilisable** : coda-oss refuse une cible 32 bits (`Unexpected Pointer Size: 4 Bytes`) |
| JPEG XS | `SVT-JPEG-XS` — **construit mais inutilisable** : intrinsèques x86 SSE4/AVX2 compilées sans condition |
| WMA, RealAudio | codecs de Rockbox — vrai portage, ils s'appuient sur l'API codec de Rockbox |
| Shorten, DSD (DSF/DFF) | implémentations éparses, à évaluer |

---

## 5. Non supporté : pas d'implémentation libre

Aucun décodeur libre n'existe, ou seulement à l'intérieur de ffmpeg — que ce
dépôt n'utilise pas comme couche de décodage générale (il n'en construit que des
sous-ensembles ciblés).

**Image** — ART (AOL), CD5 (Chasys), CPT (Corel PHOTO-PAINT), CLIP (Clip Studio),
PDN (Paint.NET), procreate, PXM (Pixelmator), PXZ (Pixlr), QFX, MAX (PaperPort),
PI2 (Portrait Innovations), EGT, C4 (JEDMICS), CIT, PX, SCT, CPL.

**Audio** — OptimFROG (OFR/OFS/OFF), LA, RKAU, TAK, VQF (TwinVQ), OTS, DWD,
SMP, MOD tracker exotiques non couverts par libxmp, AT3 (ATRAC3), BRSTM, AST, AW,
CWAV/BCWAV, QAU, PSF, THD (Dolby TrueHD, ffmpeg uniquement), WMA et RealAudio
(voir §4), SWA, VOX, VOC, GSM, MPC déjà couvert.

**Vidéo** — Bink (BIK/BK2), Smacker (SMK), RealVideo (RM/RMVB), WMV/VC-1, NSV,
Indeo, Cinepak, THP (Nintendo), ROQ, STR (PlayStation), BRAW (Blackmagic), DVR-MS,
WTV, GMV, NOA, CAM, DAT, AVCHD (conteneur propriétaire).

**Document** — DOC/DOCX, ODT, RTF, WPD, WPS, PAGES, HWP, LWP, AMI, SDW, 602,
CWK, MCW, TMDX, et l'essentiel des formats bureautiques : ils demandent une suite
complète, pas un décodeur.

---

## 6. Hors périmètre par nature

Ces entrées de la page ne sont pas des flux à décoder :

- **Texte et balisage** : TXT, MD, HTML/XHTML, XML, CSV, LOG, TeX, Troff, INFO,
  DocBook, DITA, N-Triples… — ils s'affichent, ils ne se décodent pas.
- **Livres et publications** : EPUB, MOBI, KPUB, BBeB — du HTML empaqueté ;
  MuPDF les rendrait (voir §2), mais un rendu de page n'est pas leur usage.
- **Conteneurs déjà démuxés** : AVI, MKV, MOV, MP4, ASF, OGG, WebM, 3GP, MXF —
  le contenu dépend du codec transporté.
- **Métadonnées et annexes** : Exif (la bibliothèque `libexif` est construite,
  mais ce sont des métadonnées, pas une image), SF2/SF3/SF4 (banques de sons),
  playlists M3U, MBP, ACL, TORRENT, sous-titres.
- **Partitions** : ABC, LilyPond, MusicXML, MEI, Finale, Sibelius — de la
  notation, pas du son. Seul MIDI est décodé, parce qu'il se synthétise.

---

## Résumé chiffré

| | Formats |
|---|---|
| Supportés | ~122 (dont ~500 variantes rétro via RECOIL et ~90 tracker via libxmp) |
| Bloqués par le runtime, filtre déjà écrit | 7 (§2) |
| Bibliothèque prête, filtre à écrire | 3 (§3) |
| Décodeur libre existant, à intégrer | ~12 (§4) |
| Sans implémentation libre | ~60 (§5) |
| Hors périmètre | ~120 (§6) |

Le prochain gain le plus important n'est pas un format mais **le solveur** :
le reconstruire avec les trampolines `setjmp`/`longjmp` complets et le support
des threads débloquerait d'un coup DjVu, XPS, CBZ, EPUB, FB2 et MOBI, dont les
filtres sont déjà écrits et les signaux de test déjà générés.

Vient ensuite Speex, qui ne demande qu'un filtre décodeur : la chaîne Ogg est
déjà en place et `oggdmx` produit le pid qu'il faut.
