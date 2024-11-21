mkdir -p build/
cd build
../configure
make
cd ..
docker build -t player .
docker tag  player localhost:32000/player:1.0.0
docker push localhost:32000/player:1.0.0
