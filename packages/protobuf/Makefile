.PHONY: default

default: build

build:
	buf generate --template templates/buf.gen-ts.yaml proto
	buf generate --template templates/buf.gen-go.yaml proto