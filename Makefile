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

DS_KEY_FILE ?= /Users/mickey/Projects/verdant-eye/edgeglider/.ak_ds_20_may

claude-ds:
	@if [ ! -f $(DS_KEY_FILE) ]; then \
		echo "DeepSeek API key file not found: $(DS_KEY_FILE)"; exit 2; \
	fi
	@ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic \
	 ANTHROPIC_AUTH_TOKEN="$$(cat $(DS_KEY_FILE) | tr -d '[:space:]')" \
	 ANTHROPIC_MODEL=deepseek-v4-pro[1m] \
	 ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m] \
	 ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m] \
	 ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash \
	 CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash \
	 CLAUDE_CODE_EFFORT_LEVEL=max \
	 claude
