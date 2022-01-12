

describe('Simple-img', () => {
  describe('#nanojpeg', () => {
    it('should decode Freedom.jpeg', (done) => {
      new Promise(function (resolve) {
        const img = document.createElement('img', { "is": "universal-img" });
        img.setAttribute("src", "http://bevaraserver.ddns.net/test-signals/Freedom.jpg");
        img.setAttribute("using", "simple-img.wasm");
        img.setAttribute("with", "imgdec.wasm");
        document.body.appendChild(img);
        const fetchs = img.decodingPromise.then(src =>
          Promise.all([
            fetch(src),
            fetch("http://bevaraserver.ddns.net/test-signals/Freedom.png")
          ]));

        fetchs.then((responses) => {
          arrayBuffers = responses.map(response => response.arrayBuffer());
          Promise.all(arrayBuffers)
            .then(buffers => {
              const result = new Uint8Array(buffers[0]);
              const ref = new Uint8Array(buffers[1]);
              expect(result).to.eql(ref);
              resolve();
            });
        });
      })
        .then(done);
    });
  });
});