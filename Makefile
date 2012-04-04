all:
	npm -g i .

test:
	./node_modules/.bin/yuitest ./tests/parser.js
