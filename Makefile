.PHONY: start build-demo build clean

start:
	npm run dev

build-demo:
	cd tetra-demo-src && npm install && npm run build
	rsync -av --delete tetra-demo-src/dist/ src/static/tetra-demo/ --exclude sample-graph.json

build: build-demo
	./build.sh

clean:
	rm -rf _site tetra-demo-src/dist tetra-demo-src/node_modules
