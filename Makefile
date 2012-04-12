all:
	npm -g i .

version:
	./scripts/versions.js

help:
	./scripts/help.sh

doc:
	./node_modules/.bin/selleck --out ./output/

clean:
	rm -rRf ./output/*

api:
	./lib/cli.js

docs: clean help doc api

test:
	./scripts/prep.sh
	./node_modules/.bin/yuitest ./tests/parser.js

.PHONY: docs clean
