#!/bin/bash
set -e

working_dir=$1
cd $working_dir

VERSION=`git describe --tags --long`
echo "Packageing version: $VERSION"

pwd
#cp ./example-settings.json ./public/settings.json

sed "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g" ./example-settings.json > ./public/settings.json