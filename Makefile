all:
	npm -g i .

version:
	./scripts/versions.js

doc:
	rm -rRf ./output/*
	./lib/cli.js --help &> ./docs/args/partials/help.mustache
	./node_modules/.bin/selleck --out ./output/

api:
	./lib/cli.js

docs: doc api

test:
	./scripts/prep.sh
	./node_modules/.bin/yuitest ./tests/parser.js

.PHONY: docs
