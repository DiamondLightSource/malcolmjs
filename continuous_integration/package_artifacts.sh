#!/bin/sh
set -e

VERSION=`eval git describe --tags --long`
echo "Packageing version: $VERSION"

if [ -d `eval echo "./artifacts"` ]; then
	rm -rf ./artifacts
fi
mkdir artifacts

cd build
zip -r ../artifacts/malcolmjs-$VERSION.zip ./*
tar -zcf ../artifacts/malcolmjs-$VERSION.tar.gz ./*
