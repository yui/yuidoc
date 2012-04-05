#!/bin/bash

cd "$(dirname "$0")"

if [ ! -d ../node_modules ]; then
    echo "Dependencies are not installed, installing"
    cd ../ && npm install --loglevel silent && cd ./scripts
fi

if [ ! -x ../node_modules/.bin/yuitest ]; then
    echo "YUITest is not installed, installing"
    cd ../ && npm install --loglevel silent && cd ./scripts
fi

