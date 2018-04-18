#!/bin/bash
set -e

VERSION=`git describe --tags --long`
echo "Packageing version: $VERSION"

pwd
 
if [ -d `eval echo "./artifacts"` ]; then
	rm -rf ./artifacts
fi
mkdir artifacts

cd build
zip -r ../artifacts/malcolmjs-$VERSION.zip ./*
tar -zcf ../artifacts/malcolmjs-$VERSION.tar.gz ./*
