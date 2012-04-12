#/bin/bash

cd "$(dirname "$0")"

./prep.sh
cd ../tests/ && ../node_modules/.bin/yuitest ./parser.js ./builder.js
