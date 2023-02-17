
function create_test(tag, extension, using_attribute, with_atribute, test_file, reference_file, done, out, useCache) {
  new Promise(function (resolve) {
    const img = document.createElement(tag, { "is": extension });
    img.setAttribute("src", test_file);
    img.setAttribute("using", using_attribute);
    img.setAttribute("with", with_atribute);

    if (out){
      img.setAttribute("out", out);
    }

    if (useCache){
      img.setAttribute("use-cache","");
    }

    document.body.appendChild(img);
    console.log(using_attribute + ";" + with_atribute + " : Tag " + tag + " extended by " + extension + " has been added to the DOM");
    img.decodingPromise.then(src =>{
      if (reference_file){
        return Promise.all([
          fetch(src),
          fetch(reference_file)
        ]);
      }else{
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
                  "core-img.wasm",
                  "imgdec.wasm;fin.wasm;fout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm",
                  "http://bevara.ddns.net/test-signals/Freedom.jpg",
                  "http://bevara.ddns.net/test-signals/Freedom.png",
                  done,
                  "png",
                  false
                  );
    }).timeout(5000);
    
    it('should transcode Freedom.png to Freedom.jpeg', (done) => {
      create_test('img', 
                  'universal-img', 
                  "core-img.wasm",
                  "fin.wasm;fout.wasm;rfimg.wasm;writegen.wasm;ffsws.wasm;jpgenc.wasm;rfimg.wasm;imgdec.wasm",
                  "http://bevara.ddns.net/test-signals/Freedom.png",
                  "http://bevara.ddns.net/test-signals/out/png/Freedom.jpeg",
                  done,
                  "jpg",
                  false
                  );
    }).timeout(5000);
   
    it('should load all decoders', (done) => {
      create_test('img', 
                  'universal-img', 
                  "core-img.wasm",
                  "a52dec.wasm;ffenc.wasm;inspect.wasm;nhmlw.wasm;restamp.wasm;rfmpgvid.wasm;tileagg.wasm;ufmhas.wasm;vtt2tx3g.wasm;aout.wasm;ffmx.wasm;j2kdec.wasm;nhntr.wasm;rewind.wasm;rfnalu.wasm;tilesplit.wasm;ufnalu.wasm;vttdec.wasm;avidmx.wasm;ffsws.wasm;jpgenc.wasm;nhntw.wasm;rfac3.wasm;rfpcm.wasm;tssplit.wasm;ufobu.wasm;writegen.wasm;bifsdec.wasm;cryptin.wasm;fin.wasm;lsrdec.wasm;odfdec.wasm;rfadts.wasm;rfprores.wasm;ttml2srt.wasm;ufttxt.wasm;writeqcp.wasm;bsagg.wasm;cryptout.wasm;fout.wasm;m2psdmx.wasm;rfamr.wasm;rfqcp.wasm;ttml2vtt.wasm;ufvc1.wasm;writeuf.wasm;bsrw.wasm;dasher.wasm;flist.wasm;m2tsdmx.wasm;oggdmx.wasm;rfav1.wasm;rfrawvid.wasm;ttmldec.wasm;ufvtt.wasm;xviddec.wasm;bssplit.wasm;dashin.wasm;gsfdmx.wasm;m2tsmx.wasm;oggmx.wasm;rfflac.wasm;rfsrt.wasm;ttxtdec.wasm;unframer.wasm;btplay.wasm;faaddec.wasm;gsfmx.wasm;maddec.wasm;rfh263.wasm;rftruehd.wasm;tx3g2srt.wasm;vcrop.wasm;cdcrypt.wasm;ffavf.wasm;hevcmerge.wasm;mp4dmx.wasm;pngenc.wasm;rfimg.wasm;safdmx.wasm;tx3g2ttml.wasm;vflip.wasm;cecrypt.wasm;ffbsf.wasm;hevcsplit.wasm;mp4mx.wasm;probe.wasm;rflatm.wasm;tx3g2vtt.wasm;vobsubdmx.wasm;compose.wasm;ffdec.wasm;httpin.wasm;nanojpeg.wasm;reframer.wasm;rfmhas.wasm;svgplay.wasm;txtin.wasm;vorbisdec.wasm;ffdmx.wasm;imgdec.wasm;nhmlr.wasm;resample.wasm;rfmp3.wasm;theoradec.wasm;uflatm.wasm;vout.wasm",
                  "http://bevara.ddns.net/test-signals/Freedom.jpg",
                  "http://bevara.ddns.net/test-signals/Freedom.png",
                  done,
                  "png",
                  false
                  );
    }).timeout(60000);
  });
  
  describe('#j2kdec', () => {
    it('should decode Cevennes2.jp2', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fin.wasm;fout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done,
        "png",
        false
      );
    }).timeout(5000);

    it('should decode Bretagne1.j2k', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fout.wasm;j2kdec.wasm;ffdmx.wasm;writegen.wasm;pngenc.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Bretagne1.j2k",
        "http://bevara.ddns.net/test-signals/out/j2k/Bretagne1.png",
        done,
        "png",
        false
      );
    }).timeout(5000);


    it('should decode Cevennes2.jp2.bvr', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fin.wasm;fout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.jp2.bvr",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done,
        "png",
        false
      );
    }).timeout(5000);

    it('should handle cache with Cevennes2.jp2', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fin.wasm;fout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done,
        "png",
        true
      );

      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fin.wasm;fout.wasm;pngenc.wasm;rfimg.wasm;writegen.wasm;j2kdec.wasm",
        "http://bevara.ddns.net/test-signals/j2k/Cevennes2.jp2",
        "http://bevara.ddns.net/test-signals/out/j2k/Cevennes2.png",
        done,
        "png",
        true
      );
    }).timeout(5000);

  });

  describe('#svgplay', () => {
    it('should decode 410.svg', (done) => {
      create_test('img',
        'universal-img',
        "core-img.wasm",
        "fin.wasm;svgplay.wasm;compose.wasm;pngenc.wasm;writegen.wasm;fout.wasm",
        "http://bevara.ddns.net/test-signals/SVG/410.svg",
        "http://bevara.ddns.net/test-signals/out/svg/410.png",
        done,
        "png",
        false
      );
    }).timeout(5000);
  });


  describe('#maddec', () => {
    it('should decode ImagineDragons.mp3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfmp3.wasm;maddec.wasm",
        "http://bevara.ddns.net/test-signals/ImagineDragons.mp3",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
        done,
        "wav",
        false
      );
    }).timeout(10000);

    it('should decode ImagineDragons.mp3.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfmp3.wasm;maddec.wasm",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.mp3.bvr",
        "http://bevara.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
        done,
        "wav",
        false
      );
    }).timeout(10000);

  });

  describe('#a52dec', () => {
    it('should decode sound.ac3"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfac3.wasm;a52dec.wasm",
        "http://bevara.ddns.net/test-signals/sound.ac3",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
        done,
        "wav",
        false
      );
    }).timeout(10000);

    it('should decode sound.ac3.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfac3.wasm;a52dec.wasm",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.ac3.bvr",
        "http://bevara.ddns.net/test-signals/out/ac3/sound.wav",
        done,
        "wav",
        false
      );
    }).timeout(10000);
  });

  describe('#rfflac', () => {
    it('should decode ff-16b-1c-44100hz.flac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);

    
    it('should decode ff-16b-1c-44100hz.flac.bvr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.flac.bvr",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);

    it('should handle cache with ff-16b-1c-44100hz.flac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "fin.wasm;fout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
        "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        true
      );
      create_test('audio',
      "universal-audio",
      "core-audio.wasm",
      "fin.wasm;fout.wasm;writegen.wasm;rfflac.wasm;ffdec.wasm",
      "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
      "http://bevara.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
      done,
      "wav",
      true
    );
    }).timeout(60000);
  });


  describe('#faaddec', () => {
    it('should decode sample.aac"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "faaddec.wasm;fout.wasm;rfadts.wasm;writegen.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/sample.aac",
        "http://bevara.ddns.net/test-signals/out/faad/sample.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);
  });

  describe('#vorbisdec', () => {
    it('should decode Median_test.ogg"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "vorbisdec.wasm;fout.wasm;oggdmx.wasm;writegen.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/ogg/Median_test.ogg",
        "http://bevara.ddns.net/test-signals/out/ogg/Median_test.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);
  });

  describe('#rfamr', () => {
    it('should decode ff-16b-1c-8000hz.amr"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "rfamr.wasm;writegen.wasm;resample.wasm;ffdec.wasm;rfamr.wasm;fin.wasm;fout.wasm",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-8000hz.amr",
        "http://bevara.ddns.net/test-signals/out/amr/ff-16b-1c-8000hz.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);
  });

  describe('#ffdmx', () => {
    it('should decode ff-16b-1c-44100hz.wma"', (done) => {
      create_test('audio',
        "universal-audio",
        "core-audio.wasm",
        "writegen.wasm;fin.wasm;fout.wasm;ffdec.wasm;ffdmx.wasm;resample.wasm",
        "http://bevara.ddns.net/test-signals/ff-16b-1c-44100hz.wma",
        "http://bevara.ddns.net/test-signals/out/wma/ff-16b-1c-44100hz.wav",
        done,
        "wav",
        false
      );
    }).timeout(60000);
  });
  

  describe('#theoradec', () => {
    it('should decode Big_Buck_Bunny_Trailer_400p.ogv"', (done) => {
      create_test('video',
        "universal-video",
        "core-video.wasm",
        "theoradec.wasm;mp4mx.wasm;fout.wasm;rfnalu.wasm;ffenc.wasm;oggdmx.wasm;writegen.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/ogv/Big_Buck_Bunny_Trailer_400p.ogv",
        null,
        done,
        "mp4",
        false
      );
    }).timeout(60000);
  });

  describe('#mpeg', () => {
    it('should decode centaur_2.mpg"', (done) => {
      create_test('video',
        "universal-video",
        "core-video.wasm",
        "fout.wasm;m2psdmx.wasm;rfmpgvid.wasm;ffdec.wasm;mp4mx.wasm;rfnalu.wasm;ffenc.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
        null,
        done,
        "mp4",
        false
      );
    }).timeout(60000);

    it('should handle cache centaur_2.mpg"', (done) => {
      create_test('video',
        "universal-video",
        "core-video.wasm",
        "fout.wasm;m2psdmx.wasm;rfmpgvid.wasm;ffdec.wasm;mp4mx.wasm;rfnalu.wasm;ffenc.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
        null,
        done,
        "mp4",
        true
      );

      create_test('video',
        "universal-video",
        "core-video.wasm",
        "fout.wasm;m2psdmx.wasm;rfmpgvid.wasm;ffdec.wasm;mp4mx.wasm;rfnalu.wasm;ffenc.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/mpeg1/centaur_2.mpg",
        null,
        done,
        "mp4",
        true
      );
    }).timeout(60000);

  });

  describe('#xvid', () => {
    it('should decode Big_Buck_Bunny_Trailer_400p.avi"', (done) => {
      create_test('video',
        "universal-video",
        "core-video.wasm",
        "mp4mx.wasm;avidmx.wasm;xviddec.wasm;fout.wasm;rfmp3.wasm;rfmpgvid.wasm;rfnalu.wasm;ffenc.wasm;writegen.wasm;fin.wasm",
        "http://bevara.ddns.net/test-signals/xvid/Big_Buck_Bunny_Trailer_400p.avi",
        null,
        done,
        "mp4",
        false
      );
    }).timeout(60000);
  });

  

});