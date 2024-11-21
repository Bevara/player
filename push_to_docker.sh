mkdir -p build/
cd build
../configure
make
docker build -t player .
docker tag  player 192.168.1.120:32000/player:1.0.0
docker push  192.168.1.120:32000/player:1.0.0
