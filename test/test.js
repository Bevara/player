
function create_test(tag, extension, using_attribute, with_atribute, test_file, reference_file, done) {
  new Promise(function (resolve) {
    const img = document.createElement(tag, { "is": extension });
    img.setAttribute("src", test_file);
    img.setAttribute("using", using_attribute);
    img.setAttribute("with", with_atribute);
    document.body.appendChild(img);
    console.log(using_attribute + ";" + with_atribute + " : Tag " + tag + " extended by " + extension + " has been added to the DOM");
    const fetchs = img.decodingPromise.then(src =>
      Promise.all([
        fetch(src),
        fetch(reference_file)
      ]));

    fetchs.then((responses) => {
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
              resolve();
            })
        });
    });
  })
    .then(done);
}



describe('core-player', () => {

  // describe('#imgdec', () => {
  //   it('should decode Freedom.jpeg', (done) => {
  //     create_test('img', 
  //                 'universal-img', 
  //                 "core-img.wasm",
  //                 "imgdec.wasm",
  //                 "http://bevara.ddns.net/test-signals/Freedom.jpg",
  //                 "http://bevara.ddns.net/test-signals/Freedom.png",
  //                 done
  //                 );
  //   }).timeout(5000);
  // });
  
  describe('#j2kdec', () => {
    it('should decode Cevennes2.jp2', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "filein.wasm;fileout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done
      );
    }).timeout(5000);

    it('should decode Bretagne1.j2k', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fileout.wasm;j2kdec.wasm;ffdmx.wasm;writegen.wasm;pngenc.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Bretagne1.j2k",
        "http://bevara.ddns.net/test-signals/out/j2k/Bretagne1.png",
        done
      );
    }).timeout(5000);


    it('should decode Cevennes2.jp2.bvr', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "filein.wasm;fileout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.jp2.bvr",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done
      );
    }).timeout(5000);

  });

  describe('#maddec', () => {
    it('should decode ImagineDragons.mp3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfmp3.wasm;maddec.wasm",
        "http://bevara.ddns.net/test-signals/ImagineDragons.mp3",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
        done
      );
    }).timeout(10000);

    it('should decode ImagineDragons.mp3.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfmp3.wasm;maddec.wasm",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.mp3.bvr",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
        done
      );
    }).timeout(10000);

  });

  describe('#a52dec', () => {
    it('should decode sound.ac3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfac3.wasm;a52dec.wasm",
        "http://bevara.ddns.net/test-signals/sound.ac3",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
        done
      );
    }).timeout(10000);

    it('should decode sound.ac3.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfac3.wasm;a52dec.wasm",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.ac3.bvr",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
        done
      );
    }).timeout(10000);
  });

  describe('#rfflac', () => {
    it('should decode ff-16b-1c-44100hz.flac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done
      );
    }).timeout(60000);
    it('should decode ff-16b-1c-44100hz.flac.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "filein.wasm;fileout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.flac.bvr",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done
      );
    }).timeout(60000);
  });

  describe('#faaddec', () => {
    it('should decode sample.aac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "faaddec.wasm;fileout.wasm;rfadts.wasm;writegen.wasm;filein.wasm",
        "http://bevara.ddns.net/test-signals/sample.aac",
        "http://bevara.ddns.net/test-signals/out/faad/sample.wav",
        done
      );
    }).timeout(60000);
  });

  describe('#vorbisdec', () => {
    it('should decode Median_test.ogg"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "vorbisdec.wasm;fileout.wasm;oggdmx.wasm;writegen.wasm;filein.wasm",
        "http://bevara.ddns.net/test-signals/ogg/Median_test.ogg",
        "http://bevara.ddns.net/test-signals/out/ogg/Median_test.wav",
        done
      );
    }).timeout(60000);
  });


  // describe('#mpeg', () => {
  //   it('should decode centaur_2.mpg"', (done) => {
  //     create_test('video',
  //       "universal-video",
  //       "core-video.wasm",
  //       "fileout.wasm;m2psdmx.wasm;rfmpgvid.wasm;ffdec.wasm;mp4mx.wasm;rfnalu.wasm;ffenc.wasm;filein.wasm",
  //       "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
  //       "http://bevara.ddns.net/test-signals/out/mpeg/centaur_2.mp4",
  //       done
  //     );
  //   }).timeout(60000);
  // });

  // describe('#rfamr', () => {
  //   it('should decode ff-16b-1c-8000hz.amr"', (done) => {
  //     create_test('audio',
  //       "universal-audio",
  //       "core-player.wasm",
  //       "rfamr.wasm;ffdec.wasm",
  //       "http://bevara.ddns.net/test-signals/ff-16b-1c-8000hz.amr",
  //       "http://bevara.ddns.net/test-signals/out/amrff-16b-1c-44100hz.wav",
  //       done
  //     );
  //   }).timeout(60000);
  // })
});