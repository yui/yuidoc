#/bin/bash

cd "$(dirname "$0")"

./prep.sh
cd ../tests/
wait
../node_modules/.bin/yuitest ./parser.js ./builder.js

exit $?
