
function create_test(tag, extension, using_attribute, with_atribute, test_file, reference_file, done, out, useCache, noWorker) {
  new Promise(function (resolve) {
    const img = document.createElement(tag, { "is": extension });
    img.setAttribute("src", test_file);
    img.setAttribute("using", using_attribute);
    if (with_atribute) {
      img.setAttribute("with", with_atribute);
    }

    img.setAttribute("script-directory", "/base/build/dist/");

    if (out) {
      img.setAttribute("out", out);
    }

    if (useCache) {
      img.setAttribute("use-cache", "");
    }

    if (noWorker) {
      img.setAttribute("no-worker", "");
    }

    document.body.appendChild(img);
    console.log(using_attribute + ";" + with_atribute + " : Tag " + tag + " extended by " + extension + " has been added to the DOM");
    img.decodingPromise.then(src => {
      if (reference_file) {
        return Promise.all([
          fetch(src),
          fetch(reference_file)
        ]);
      } else {
        resolve();
        return Promise.all([]);
      }
    })
      .then((responses) => {
        console.log(using_attribute + ";" + with_atribute + " : Both test and reference signal has been processed");
        arrayBuffers = responses.map(response => response.arrayBuffer());
        Promise.all(arrayBuffers)
          .then(buffers => {
            console.log(using_attribute + ";" + with_atribute + " : Calculating hash of the results");
            hashedBuffers = buffers.map(buffer => crypto.subtle.digest('SHA-256', buffer));
            Promise.all(hashedBuffers)
              .then(hashedResults => {
                console.log(using_attribute + ";" + with_atribute + " : Transforming hashes of to hex values");
                const result = new Uint8Array(hashedResults[0]);
                const ref = new Uint8Array(hashedResults[1]);
                const resultHex = result.map(b => b.toString(16).padStart(2, '0')).join('');
                const refHex = ref.map(b => b.toString(16).padStart(2, '0')).join('');
                console.log(using_attribute + ";" + with_atribute + " : hex values of result is " + resultHex + " and expected is " + refHex);
                expect(resultHex).to.equal(refHex);
                console.log(using_attribute + ";" + with_atribute + " : Test OK");
                document.body.removeChild(img);
                resolve();
              });
          });
      });
  })
    .then(done);
}



describe('core-player', () => {

  describe('#imgdec', () => {
    it('should decode Freedom.jpeg', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "imgdec;fin;fout;pngenc;rfimg;writegen",
        "http://bevara.ddns.net/test-signals/Freedom.jpg",
        "http://bevara.ddns.net/test-signals/Freedom.png",
        done,
        "png",
        false,
        false
      );
    }).timeout(5000);

    it('should transcode Freedom.png to Freedom.jpeg', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "fin;fout;rfimg;writegen;ffsws;jpgenc;rfimg;imgdec",
        "http://bevara.ddns.net/test-signals/Freedom.png",
        "http://bevara.ddns.net/test-signals/out/png/Freedom.jpeg",
        done,
        "jpg",
        false,
        false
      );
    }).timeout(5000);

    // it('should load all decoders', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "a52dec;ffenc;inspect;nhmlw;restamp;rfmpgvid;tileagg;ufmhas;vtt2tx3g;aout;ffmx;j2kdec;nhntr;rewind;rfnalu;tilesplit;ufnalu;vttdec;avidmx;ffsws;jpgenc;nhntw;rfac3;rfpcm;tssplit;ufobu;writegen;bifsdec;cryptin;fin;lsrdec;odfdec;rfadts;rfprores;ttml2srt;ufttxt;writeqcp;bsagg;cryptout;fout;m2psdmx;rfamr;rfqcp;ttml2vtt;ufvc1;writeuf;bsrw;dasher;flist;m2tsdmx;oggdmx;rfav1;rfrawvid;ttmldec;ufvtt;xviddec;bssplit;dashin;gsfdmx;m2tsmx;oggmx;rfflac;rfsrt;ttxtdec;unframer;btplay;faaddec;gsfmx;maddec;rfh263;rftruehd;tx3g2srt;vcrop;cdcrypt;ffavf;hevcmerge;mp4dmx;pngenc;rfimg;safdmx;tx3g2ttml;vflip;cecrypt;ffbsf;hevcsplit;mp4mx;probe;rflatm;tx3g2vtt;vobsubdmx;compose;ffdec;httpin;nanojpeg;reframer;rfmhas;svgplay;txtin;vorbisdec;ffdmx;imgdec;nhmlr;resample;rfmp3;theoradec;uflatm;vout",
    //     "http://bevara.ddns.net/test-signals/Freedom.jpg",
    //     "http://bevara.ddns.net/test-signals/Freedom.png",
    //     done,
    //     "png",
    //     false,
    //     false
    //   );
    // }).timeout(60000);
  });

  describe('#j2kdec', () => {
    it('should transcode Cevennes2.jp2 to png', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "fin;fout;pngenc;rfimg;writegen;j2kdec",
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done,
        "png",
        false,
        false);
    }).timeout(5000);

    // it('should transcode Cevennes2.jp2 to canvas', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "fin;fout;rfimg;writegen;j2kdec",
    //     "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
    //     "http://bevara.ddns.net/test-signals/out/j2k/cevennes2_canvas.png",
    //     done,
    //     "rgb",
    //     false,
    //     false);
    // }).timeout(5000);

    // it('should transcode Cevennes2.jp2 to png without worker', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "fin;fout;pngenc;rfimg;writegen;j2kdec",
    //     "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
    //     "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
    //     done,
    //     "png",
    //     false,
    //     true);
    // }).timeout(5000);

    it('should decode Bretagne1.j2k', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "fout;j2kdec;ffdmx;writegen;pngenc",
        "http://bevara.ddns.net/test-signals/j2k/Bretagne1.j2k",
        "http://bevara.ddns.net/test-signals/out/j2k/Bretagne1.png",
        done,
        "png",
        false,
        false);
    }).timeout(5000);


    // it('should decode Cevennes2.jp2.bvr', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "fin;fout;pngenc;rfimg;writegen;j2kdec",
    //     "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.jp2.bvr",
    //     "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
    //     done,
    //     "png",
    //     false
    //   );
    // }).timeout(5000);

    // it('should handle cache with Cevennes2.jp2', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "fin;fout;pngenc;rfimg;writegen;j2kdec",
    //     "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
    //     "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
    //     done,
    //     "png",
    //     true,
    //     false
    //   );

    //   create_test('img',
    //     'universal-img',
    //     "core",
    //     "fin;fout;pngenc;rfimg;writegen;j2kdec",
    //     "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
    //     "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
    //     done,
    //     "png",
    //     true,
    //     false
    //   );
    // }).timeout(5000);

  });

  describe('#jxldec', () => {
    it('should decode test.jxl to png', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "rfjxl;jxldec;fin;fout;pngenc;writegen",
        "http://bevara.ddns.net/test-signals/JXL/test.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/test.png",
        done,
        "png",
        false,
        false);
    }).timeout(200000);

    

    it('should decode test2.jxl to png', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "rfjxl;jxldec;fin;fout;pngenc;writegen",
        "http://bevara.ddns.net/test-signals/JXL/test2.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/test2.png",
        done,
        "png",
        false,
        false);
    }).timeout(200000);

    it('should decode test3.jxl to png', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "rfjxl;jxldec;fin;fout;pngenc;writegen",
        "http://bevara.ddns.net/test-signals/JXL/test3.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/test3.png",
        done,
        "png",
        false,
        false);
    }).timeout(200000);

    it('should decode red-room.jxl to png', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "rfjxl;jxldec;fin;fout;pngenc;writegen",
        "http://bevara.ddns.net/test-signals/JXL/red-room.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/red-room.png",
        done,
        "png",
        false,
        false);
    }).timeout(200000);




    it('should decode test.jxl to canvas', (done) => {
      create_test('img',
        'universal-img',
        "core",
        "rfjxl;jxldec;fin;fout;writegen",
        "http://bevara.ddns.net/test-signals/JXL/test.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/canvas.png",
        done,
        "rgba",
        false,
        false);
    }).timeout(200000);
  });

  describe('#corejxl', () => {

    it('should decode test.jxl', (done) => {
      create_test('img',
        'universal-img',
        "jxl",
        null,
        "http://bevara.ddns.net/test-signals/JXL/test.jxl",
        "http://bevara.ddns.net/test-signals/out/jxl/canvas.png",
        done,
        false,
        false
      );
    }).timeout(20000);

    // it('should decode test.jxl without workers', (done) => {
    //   create_test('img',
    //     'universal-img',
    //     "jxl",
    //     null,
    //     "http://bevara.ddns.net/test-signals/JXL/test.jxl",
    //     "http://bevara.ddns.net/test-signals/out/jxl/canvas.png",
    //     done,
    //     false,
    //     true
    //   );
    // }).timeout(20000);

  });

  describe('#corejp2', () => {
    it('should transcode Cevennes2.jp2 to canvas', (done) => {
      create_test('img',
        'universal-img',
        "jp2",
        null,
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/cevennes2_canvas.png",
        done,
        "rgb",
        false,
        false);
    }).timeout(5000);

    it('should transcode Cevennes2.jp2 to canvas without workers', (done) => {
      create_test('img',
        'universal-img',
        "jp2",
        null,
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/cevennes2_canvas.png",
        done,
        "rgb",
        false,
        true);
    }).timeout(5000);

  });

  // describe('#svgplay', () => {
  //   it('should decode 410.svg', (done) => {
  //     create_test('img',
  //       'universal-img',
  //       "core",
  //       "fin;svgplay;compose;pngenc;writegen;fout",
  //       "http://bevara.ddns.net/test-signals/SVG/410.svg",
  //       "http://bevara.ddns.net/test-signals/out/svg/410.png",
  //       done,
  //       "png",
  //       false,
  //       false);
  //   }).timeout(5000);
  // });


  describe('#maddec', () => {
    it('should decode ImagineDragons.mp3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "fin;fout;writegen;rfmp3;maddec",
        "http://bevara.ddns.net/test-signals/ImagineDragons.mp3",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(10000);

      // it('should decode ImagineDragons.mp3.bvr"', (done) => {
      //   create_test('audio',
      //     "universal-audio",
      //     "core",
      //     "fin;fout;writegen;rfmp3;maddec",
      //     "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.mp3.bvr",
      //     "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
      //     done,
      //     "wav",
      //      false,
      //  false        );
      // }).timeout(10000);

  });

  describe('#a52dec', () => {
    it('should decode sound.ac3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "fin;fout;writegen;rfac3;a52dec",
        "http://bevara.ddns.net/test-signals/sound.ac3",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(10000);

    // it('should decode sound.ac3 without workers"', (done) => {
    //   create_test('audio',
    //     "universal-audio",
    //     "core",
    //     "fin;fout;writegen;rfac3;a52dec",
    //     "http://bevara.ddns.net/test-signals/sound.ac3",
    //     "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
    //     done,
    //     "wav",
    //     false,
    //     true);
    // }).timeout(10000);

      // it('should decode sound.ac3.bvr"', (done) => {
      //   create_test('audio',
      //     "universal-audio",
      //     "core",
      //     "fin;fout;writegen;rfac3;a52dec",
      //     "http://bevara.ddns.net/test-signals/out/ac3/sound.ac3.bvr",
      //     "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
      //     done,
      //     "wav",
      //      false,
      //  false         );
      // }).timeout(10000);
  });

  describe('#rfflac', () => {
    it('should decode ff-16b-1c-44100hz.flac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "fin;fout;writegen;rfflac;ffdec",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(60000);


  //     it('should decode ff-16b-1c-44100hz.flac.bvr"', (done) => {
  //       create_test('audio',
  //         "universal-audio",
  //         "core",
  //         "fin;fout;writegen;rfflac;ffdec",
  //         "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.flac.bvr",
  //         "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
  //         done,
  //         "wav",
  //          false,
  //       false       );
  //     }).timeout(60000);

  //   it('should handle cache with ff-16b-1c-44100hz.flac"', (done) => {
  //     create_test('audio',
  //       "universal-audio",
  //       "core",
  //       "fin;fout;writegen;rfflac;ffdec",
  //       "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
  //       "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
  //       done,
  //       "wav",
  //       true,
  //       false
  //     );
  //     create_test('audio',
  //       "universal-audio",
  //       "core",
  //       "fin;fout;writegen;rfflac;ffdec",
  //       "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
  //       "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
  //       done,
  //       "wav",
  //       true,
  //       false
  //     );
  //   }).timeout(60000);
  });


  describe('#faaddec', () => {
    it('should decode sample.aac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "faaddec;fout;rfadts;writegen;fin",
        "http://bevara.ddns.net/test-signals/sample.aac",
        "http://bevara.ddns.net/test-signals/out/faad/sample.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(60000);
  });

  describe('#vorbisdec', () => {
    it('should decode Median_test.ogg"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "vorbisdec;fout;oggdmx;writegen;fin",
        "http://bevara.ddns.net/test-signals/ogg/Median_test.ogg",
        "http://bevara.ddns.net/test-signals/out/ogg/Median_test.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(60000);
  });

  describe('#rfamr', () => {
    it('should decode ff-16b-1c-8000hz.amr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "rfamr;writegen;resample;ffdec;fin;fout",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-8000hz.amr",
        "http://bevara.ddns.net/test-signals/out/amr/ff-16b-1c-8000hz.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(60000);
  });

  describe('#ffdmx', () => {
    it('should decode ff-16b-1c-44100hz.wma"', (done) => {
      create_test('audio',
        "universal-audio",
        "core",
        "writegen;fin;fout;ffdec;ffdmx;resample",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.wma",
        "http://bevara.ddns.net/test-signals/out/wma/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        false,
        false);
    }).timeout(360000);
  });


  describe('#theoradec', () => {
    it('should decode Big_Buck_Bunny_Trailer_400p.ogv"', (done) => {
      create_test('video',
        "universal-video",
        "core",
        "theoradec;mp4mx;fout;rfnalu;ffenc;oggdmx;writegen;fin",
        "http://bevara.ddns.net/test-signals/ogv/Big_Buck_Bunny_Trailer_400p.ogv",
        null,
        done,
        "mp4",
        false,
        false);
    }).timeout(360000);
  });

  describe('#mpeg', () => {
    it('should decode centaur_2.mpg', (done) => {
      create_test('video',
        "universal-video",
        "core",
        "fout;m2psdmx;rfmpgvid;ffdec;mp4mx;rfnalu;ffenc;fin",
        "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
        null,
        done,
        "mp4",
        false,
        false);
    }).timeout(360000);

  //   // it('should decode centaur_2.mpg without workers', (done) => {
  //   //   create_test('video',
  //   //     "universal-video",
  //   //     "core",
  //   //     "fout;m2psdmx;rfmpgvid;ffdec;mp4mx;rfnalu;ffenc;fin",
  //   //     "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
  //   //     null,
  //   //     done,
  //   //     "mp4",
  //   //     false,
  //   //     true);
  //   // }).timeout(360000);

  //   it('should handle cache centaur_2.mpg"', (done) => {
  //     create_test('video',
  //       "universal-video",
  //       "core",
  //       "fout;m2psdmx;rfmpgvid;ffdec;mp4mx;rfnalu;ffenc;fin",
  //       "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
  //       null,
  //       done,
  //       "mp4",
  //       true
  //     );

  //     create_test('video',
  //       "universal-video",
  //       "core",
  //       "fout;m2psdmx;rfmpgvid;ffdec;mp4mx;rfnalu;ffenc;fin",
  //       "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
  //       null,
  //       done,
  //       "mp4",
  //       true
  //     );
  //   }).timeout(360000);

  });

  describe('#xvid', () => {
    it('should decode Big_Buck_Bunny_Trailer_400p.avi"', (done) => {
      create_test('video',
        "universal-video",
        "core",
        "mp4mx;avidmx;xviddec;fout;rfmp3;rfmpgvid;rfnalu;ffenc;writegen;fin",
        "http://bevara.ddns.net/test-signals/xvid/Big_Buck_Bunny_Trailer_400p.avi",
        null,
        done,
        "mp4",
        false,
        false);
    }).timeout(360000);
  });
});