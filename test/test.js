function create_test(tag, extension, using_attribute, with_atribute, test_file, reference_file, done){
  new Promise(function (resolve) {
    const img = document.createElement(tag, { "is": extension });
    img.setAttribute("src", test_file);
    img.setAttribute("using", using_attribute);
    img.setAttribute("with", with_atribute);
    document.body.appendChild(img);
    console.log(using_attribute +";"+ with_atribute + " : Tag " + tag + " extended by " + extension +" has been added to the DOM");
    const fetchs = img.decodingPromise.then(src =>
      Promise.all([
        fetch(src),
        fetch(reference_file)
      ]));

    fetchs.then((responses) => {
      console.log(using_attribute +";"+ with_atribute + " : Both test and reference signal has been processed");
      arrayBuffers = responses.map(response => response.arrayBuffer());
      Promise.all(arrayBuffers)
        .then(buffers => {
          console.log(using_attribute +";"+ with_atribute + " : Comparing array buffers");
          const result = new Uint8Array(buffers[0]);
          const ref = new Uint8Array(buffers[1]);
          expect(result.length).to.equal(ref.length);
          expect(result).to.deep.equal(ref);
          console.log(using_attribute +";"+ with_atribute + " : Test OK");
          resolve();
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
                  "core-player.wasm",
                  "imgdec.wasm",
                  "http://bevaraserver.ddns.net/test-signals/Freedom.jpg",
                  "http://bevaraserver.ddns.net/test-signals/Freedom.png",
                  done
                  );
    }).timeout(5000);
  });

  describe('#j2kdec', () => {
    it('should decode Cevennes2.jp2', (done) => {
      create_test('img', 
      'universal-img', 
      "core-player.wasm",
      "j2kdec.wasm",
      "http://bevaraserver.ddns.net/test-signals/j2k/Cevennes2.jp2",
      "http://bevaraserver.ddns.net/test-signals/out/j2k/Cevennes2.png",
      done
      );
    }).timeout(5000);
  });

  // describe('#maddec', () => {
  //   it('should decode ImagineDragons.mp3"', (done) => {
  //     create_test('audio', 
  //     "universal-audio", 
  //     "core-player.wasm",
  //     "rfmp3.wasm;maddec.wasm",
  //     "http://bevaraserver.ddns.net/test-signals/ImagineDragons.mp3",
  //     "http://bevaraserver.ddns.net/test-signals/out/maddec/ImagineDragons.wav",
  //     done
  //     );
  //   }).timeout(600000);
  // });

  // describe('#a52dec', () => {
  //   it('should decode sound.ac3"', (done) => {
  //     create_test('audio', 
  //     "universal-audio", 
  //     "core-player.wasm",
  //     "rfac3.wasm;a52dec.wasm",
  //     "http://bevaraserver.ddns.net/test-signals/sound.ac3",
  //     "http://bevaraserver.ddns.net/test-signals/out/ac3/sound.wav",
  //     done
  //     );
  //   });
  // }).timeout(30000);

  //   describe('#rfflac', () => {
  //   it('should decode ff-16b-1c-44100hz.flac"', (done) => {
  //     create_test('audio', 
  //     "universal-audio", 
  //     "core-player.wasm",
  //     "rfflac.wasm;ffdec.wasm",
  //     "http://bevaraserver.ddns.net/test-signals/ff-16b-1c-44100hz.flac",
  //     "http://bevaraserver.ddns.net/test-signals/out/flac/ff-16b-1c-44100hz.wav",
  //     done
  //     );
  //   });
  // }).timeout(60000);
});