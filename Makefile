all:
	npm -g i .

version:
	./scripts/versions.js

docs:
	rm -rRf ./output/*
	./node_modules/.bin/selleck --out ./output/
	yuidoc

test:
	./scripts/prep.sh
	./node_modules/.bin/yuitest ./tests/parser.js

.PHONY: docs
