
build: node_modules
	node_modules/.bin/gulp

node_modules: package.json
	npm install

.PHONY: build
