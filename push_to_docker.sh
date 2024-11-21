#!/bin/bash
version="1.0.2"

mkdir -p build/
cd build
../configure
make
cd ..
docker build -t player .
docker tag  player localhost:32000/player:$version
docker push localhost:32000/player:$version
