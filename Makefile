# Specify defaults for testing
PREFIX := $(shell pwd)/prefix
PYTHON = dls-python
MODULEVER=0.0

# Override with any release info
-include Makefile.private

test:
	npm run lint:css
	npm run lint:js
	npm run build
	npm run test
	codecov
	npm run e2e	

install:
	npm install -g codecov
	npm install	

# Build docs
docs:
	sphinx-build -b html docs/source docs/build/html

# Clean the module
clean:
	rm -rf docs/build
	find -name '*~' -delete


.PHONY: docs
